---
to: "<%= locals.features.githubPages ? 'scripts/deploy-github-pages.js' : null %>"
---
const ghPages = require('gh-pages')

module.exports = class GithubPagesDeploy extends Plugin {
  constructor (...args) {
    super(...args)
    this.registerPrompts({
      publish: {
        type: 'confirm',
        message: context => `Deploy v${context.version} to GitHub pages?`
      }
    })
  }

  static isEnabled () {
    return this.options.enabled
  }

  async release () {
    await this.step({
      task: () => ghPages.publish(this.options.to || 'dist', this.options.ghPages),
      label: 'Deploy to GitHub pages',
      prompt: 'publish'
    })
  }
}
