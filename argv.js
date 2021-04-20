const yargs = require('yargs')

const options = {
  command: {
    alias: 'c',
    default: '',
    demandOption: false,
    describe: 'Command to be executed after dots-env scripts',
    nargs: 1
  },
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
    describe: 'Get .env?(.*).local',
    nargs: 0
  },
  envPath: {
    alias: 'p',
    default: '',
    demandOption: false,
    describe: 'Path of original .env?(.*) file',
    nargs: 1
  }
}

const { argv } = yargs
  .usage('Usage: $0 <command> [options]')
  .options(options)

module.exports = {
  argv,
  options
}