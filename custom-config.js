const path = require('path')
const fs = require('fs')

const customConfigPath = path.resolve(process.cwd(), 'dots-env.config.js')

let customConfig = {}

if (fs.existsSync(customConfigPath)) {
  const userGlobalConfigs = require(customConfigPath)
  if (userGlobalConfigs) {
    customConfig = userGlobalConfigs
  }
}

module.exports = customConfig