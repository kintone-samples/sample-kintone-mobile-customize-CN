/* eslint-disable import/no-extraneous-dependencies */
const webpack = require('webpack')
const configuration = require('../config/webpack.prod')
const envfile = require('./env')
const Client = require('./client')
const config = require('./config')
const logger = require('./logger')

const upload = async () => {
  logger.info('Start compiling.......')
  let hash
  const env = await envfile.load(config.envfile)
  const client = new Client(env[config.envBaseURL], env[config.envUserName], env[config.envPassword])

  webpack(configuration, async (err, stats) => {
    if (err || stats.hasErrors()) {
      console.error(
        err ||
          stats.toString({
            colors: true,
          }),
      )
    } else if (hash !== stats.hash) {
      hash = stats.hash
      console.log(
        stats.toString({
          colors: true,
        }),
      )
      await client.customizeFiles(env[config.envAppID], config.outputDir, config.customize)
    }
  })
}

upload()
