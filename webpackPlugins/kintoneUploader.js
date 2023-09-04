const Client = require('../scripts/client')

class KintoneUploaderWebpackPlugin {
  constructor(options = {}) {
    this.options = options
  }
  apply(compiler) {
    compiler.hooks.done.tap('AfterCompile', (compilation) => {
      const customize = new Set(['mobile'].map((el) => el.toUpperCase()))
      const { url, user, password, outputDir } = this.options
      const client = new Client(url, user, password)
      client.customizeFiles(outputDir, customize)
    })
  }
}

module.exports = KintoneUploaderWebpackPlugin
