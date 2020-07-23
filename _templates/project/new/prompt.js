module.exports = [
  {
    type: 'input',
    name: 'name',
    message: 'What is the project/package name?'
  }, {
    type: 'input',
    name: 'npm_scope',
    message: 'What is the NPM scope (blank if none)?'
  }, {
    type: 'input',
    name: 'github_username',
    message: 'What is the GitHub username?',
    initial: (r) => r.enquirer.answers.npm_scope ? r.enquirer.answers.npm_scope.replace('@', '') : ''
  }, {
    type: 'input',
    name: 'description',
    message: 'What is the project/package description?'
  }, {
    type: 'input',
    name: 'version',
    message: 'What is the project/package version?',
    initial: '0.0.0'
  }, {
    type: 'input',
    name: 'author',
    message: 'What is the author\'s name and contact info?',
    initial: 'Tyson Zimmerman <thezimmee@gmail.com> (https://github.com/thezimmee)'
  }, {
    type: 'input',
    name: 'repository',
    message: 'What is the repo URL?',
    initial: (r) => {
      const a = r.enquirer.answers
      return `https://github.com/${[a.github_username, a.name].filter(Boolean).join('/').toLowerCase()}`
    }
  }, {
    type: 'input',
    name: 'homepage',
    message: 'What is the homepage?',
    initial: (r) => r.enquirer.answers.repository || ''
  }, {
    type: 'input',
    name: 'license',
    message: 'What is the license?',
    initial: 'ISC'
  }, {
    type: 'multiselect',
    name: 'features',
    message: 'What features will this project include?',
    initial: ['linting', 'jest', 'github', 'npm'],
    choices: [
      { name: 'linting', message: 'Code linting', value: true, default: true, initial: true },
      { name: 'jest', message: 'Jest unit/end to end testing' },
      { name: 'browserTesting', message: 'Browser/DOM testing' },
      { name: 'uiTesting', message: 'UI visual regression testing' },
      { name: 'github', message: 'GitHub releases' },
      { name: 'npm', message: 'Publish to NPM' },
      { name: 'vercel', message: 'Deploy to Vercel' },
      { name: 'githubPages', message: 'Deploy to GitHub pages' },
      { name: 'monorepo', message: 'Monorepo' },
    ],
    result (names) {
      const result = this.map(names)
      result.release = result.github || result.npm || result.vercel
      result.testing = result.jest || result.browserTesting || result.uiTesting
      return result
    }
  }
]
