#! /usr/bin/env node

const processEnv = require('./scripts/processEnv')
const execCommand = require('./scripts/execCommand')
const { argv } = require('./argv')

const { command } = argv

processEnv().then(() => {
  execCommand(command)
})
