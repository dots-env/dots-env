const fs = require('fs')
const path = require('path')
const yargs = require('yargs')
const dotenv = require('dotenv')

const processEnv = ({ envPath = '' } = {}) => new Promise(
  async (resolve) => {
    const { argv } = yargs.usage('Usage: $0 <command> [options]').options({
      env: {
        alias: 'e',
        default: 'development',
        demandOption: false,
        describe: 'Environment',
        nargs: 1
      },
      local: {
        alias: 'l',
        type: 'boolean',
        describe: 'Get .env?(.*).local'
      }
    })

    const { env, local } = argv

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

    console.info(`>>> Using env file: ${envFile}`)

    const originalEnvPath = path.resolve(process.cwd(), `${envPath}${envFile}`)
    const destinationEnvPath = path.resolve(process.cwd(), '.env')

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
      process.env.ENVFILE = envFile

      resolve({
        envFilePath: `${envPath}${envFile}`,
        envFile,
        local,
        argv
      })
    } catch (error) {
      console.error(`error: ${ error.toString() }`)
    }
  }
)

module.exports = processEnv
