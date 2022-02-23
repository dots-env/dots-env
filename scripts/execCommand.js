const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

const filter = require('lodash/filter')
const find = require('lodash/find')
const isArray = require('lodash/isArray')
const reduce = require('lodash/reduce')

const { options: argvOptions } = require('../argv')

const getTerminalType = () => {
  switch (process.platform) {
    case 'linux':
    case 'darwin':
      return 'bash'
    default:
      return 'powershell'
  }
}

const execCommand = (command, options = {}, argvException = []) => new Promise((resolve, reject) => {

  const ignoredArgvs = [
    ...argvException,
    ...reduce(argvOptions, (acc, option, optionName) => [
      ...acc,
      { param: `--${ optionName }`, hasValue: !!option.nargs },
      { param: `-${ option.alias }`, hasValue: !!option.nargs }
    ], [])
  ]

  let argvs = isArray(process.argv) ? process.argv.slice(2) : []

  argvs = filter(argvs, (argv, i) => {
    const ignoredParam = find(ignoredArgvs, { param: argv })
    const ignoredValue = find(ignoredArgvs, { param: argvs[i - 1] })

    if (ignoredParam || (ignoredValue && ignoredValue.hasValue)) {
      return false
    }
    return true
  })

  let envCmd = ''
  const envPath = path.resolve(process.cwd(), '.env')
  if (fs.existsSync(envPath)) {
    envCmd = `env-cmd -f ${ envPath }`
  }

  try {
    const childProcess = spawn(
      getTerminalType(),
      ['-c', `${envCmd} ${ command } ${ argvs.join(' ') }`],
      { stdio: 'inherit', ...options }
    )

    childProcess.on('error', (error) => {
      throw error
    })

    childProcess.on('close', (code) => {
      if (code > 0) {
        reject(new Error(`Command failed with status code ${ code }`))
      }
      resolve()
    })
  } catch (error) {
    console.error(error)
    reject(error)
  }
})

module.exports = execCommand
