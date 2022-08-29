const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')
const mapValues = require('lodash/mapValues')
const emoji = require("node-emoji")

const defaultConfig = require('../default-config')
const customConfig = require('../custom-config')
const { argv } = require('../argv')

const { command, ...options } = argv

const processEnv = (configs = {}) => new Promise(
  async (resolve) => {

    const parsedConfigs = mapValues(configs, (configValue, configName) => {
      return configValue !== '' ? configValue : customConfig[configName]
    })

    const allConfigs = { ...customConfig, ...parsedConfigs }

    const {
      local = defaultConfig.local,
      env = defaultConfig.env,
      envPath = defaultConfig.envPath,
      destinationPath = defaultConfig.destinationPath
    } = allConfigs
    
    let envFile = `.env${env ? `.${env}` : ''}`
    if (!fs.existsSync(path.resolve(process.cwd(), `${envPath}${envFile}`))) {
      envFile = `${envPath}.env`
    }

    if (local) {
      const localEnvFile = `${envFile}.local`
      if (fs.existsSync(path.resolve(process.cwd(), `${envPath}${localEnvFile}`))) {
        envFile = localEnvFile
      }
    }

    const originalEnv = `${envPath}${envFile}`
    const originalEnvPath = path.resolve(process.cwd(), originalEnv)
    
    const originalDestination = `${destinationPath}.env`
    const destinationEnvPath = path.resolve(process.cwd(), originalDestination)

    console.info(`\x1b[36m${emoji.get('rocket')} Using env file: ${originalEnv}`)

    const createRootEnv = () => new Promise((res, rej) => {
      fs.copyFile(originalEnvPath, destinationEnvPath, (error) => {
        if (error) {
          return rej(error)
        }
        console.info(`\x1b[90m${emoji.get('clipboard')} Created ${originalDestination}`)
        return res()
      })
    })

    try {
      const getEnvValues = () => dotenv.parse(fs.readFileSync(destinationEnvPath))

      const reloadEnvValues = () => {
        Object.entries(getEnvValues()).map(
          ([configName, configValue]) => {
            process.env[configName] = configValue
          }
        )
      }

      await createRootEnv()
      reloadEnvValues()

      resolve({
        envName: env,
        getEnvValues,
        reloadEnvValues,
        envFile,
        originalEnvPath,
        destinationEnvPath,
        local
      })
    } catch (error) {
      console.error(`error: ${ error.toString() }`)
    }
  }
)

module.exports = (opts = {}) => processEnv({...options, ...opts})
