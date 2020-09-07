---
to: "<%= locals.features.vercel ? locals.dest + 'scripts/deploy-verceljs.js' : null %>"
---
const { Plugin } = require('release-it')
const fs = require('fs')

module.exports = class VercelDeploy extends Plugin {
  constructor (...args) {
    super(...args)
    this.registerPrompts({
      publish: {
        type: 'confirm',
        message: context => `Deploy v${context.version} to Vercel?`
      }
    })
  }

  static isEnabled () {
    return this.options.enabled || fs.existsSync('vercel.json')
  }

  async release () {
    await this.step({
      task: () => this.exec('npx now'),
      label: 'Deploy to Vercel',
      prompt: 'publish'
    })
  }
}
