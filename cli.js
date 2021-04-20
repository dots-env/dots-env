#! /usr/bin/env node

const processEnv = require('./scripts/processEnv')
const execCommand = require('./scripts/execCommand')
const { argv } = require('./argv')

const { command, ...options } = argv

processEnv(options).then(() => {
  execCommand(command)
})
