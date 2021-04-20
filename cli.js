#! /usr/bin/env node

const processEnv = require('./scripts/processEnv')
const execCommand = require('./scripts/execCommand')
const yargs = require('yargs')

const { argv } = yargs.usage('Usage: $0 <command> [options]').options({
  command: {
    alias: 'c',
    default: '',
    demandOption: false,
    describe: 'Command to be executed after dots-env scripts',
    nargs: 1
  }
})

processEnv().then(() => {
  execCommand(argv.command)
})
