const fs = require('fs')
const path = require('path')
const dotenv = require('dotenv')

const { argv } = require('../argv')

const processEnv = ({
  local = argv.local,
  env = argv.env,
  envPath = argv.envPath
} = {}) => new Promise(
  async (resolve) => {

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
    const destinationEnvPath = path.resolve(process.cwd(), '.env')

    console.info(`>>> Using env file: ${originalEnv}`)

    const createRootEnv = () => new Promise((res, rej) => {
      fs.copyFile(originalEnvPath, destinationEnvPath, (error) => {
        if (error) {
          return rej(error)
        }
        return res()
      })
    })

    try {
      await createRootEnv()

      const envConfig = dotenv.parse(fs.readFileSync(destinationEnvPath))

      Object.entries(envConfig).map(
        ([configName, configValue]) => {
          process.env[configName] = configValue
        }
      )

      resolve({
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

module.exports = processEnv
