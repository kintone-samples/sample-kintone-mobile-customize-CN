/* eslint-disable no-console */
/* eslint-disable import/no-extraneous-dependencies */
const chalk = require('chalk')

const prefix = `${chalk.greenBright('[cka]')}`

module.exports = Object.freeze({
  error: (err) => {
    console.error(`${prefix}: ${chalk.redBright(err)}`)
  },

  warn: (msg) => {
    console.error(`${prefix}: ${chalk.yellowBright(msg)}`)
  },

  info: (msg) => {
    console.info(`${prefix}: ${chalk.greenBright(msg)}`)
  },
})
