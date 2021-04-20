const { spawn } = require('child_process')

const filter = require('lodash/filter')
const find = require('lodash/find')
const isArray = require('lodash/isArray')

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
  let argvs = isArray(process.argv) ? process.argv.slice(2) : []

  const ignoredArgvs = [
    ...argvException,
    { param: '--env', hasValue: true },
    { param: '--local', hasValue: false }
  ]

  argvs = filter(argvs, (argv, i) => {
    const ignoredParam = find(ignoredArgvs, { param: argv })
    const ignoredValue = find(ignoredArgvs, { param: argvs[i - 1] })

    if (ignoredParam || (ignoredValue && ignoredValue.hasValue)) {
      return false
    }
    return true
  })

  try {
    const childProcess = spawn(
      getTerminalType(),
      ['-c', `${ command } ${ argvs.join(' ') }`],
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
