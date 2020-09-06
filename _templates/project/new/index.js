const path = require('path')

module.exports = {
  prompt: ({ prompter, args }) => {
    const fs = require('fs')
    const cwd = process.cwd()
    const pkgExists = fs.existsSync(path.join(cwd, 'package.json'))
    let answers = {}
    let pkg = pkgExists ? require(path.join(cwd, 'package.json')) : {}
    const questions = [{
      type: 'select',
      name: 'type',
      message: 'What type of project is this?',
      choices: [
        { name: 'node', message: 'NodeJS' },
        { name: 'web', message: 'Web project' }
      ]
    }, {
      type: 'confirm',
      name: 'monorepo',
      message: 'Would you like to create a monorepo?'
    }]

    if (pkgExists) {
      let footer = JSON.stringify(pkg, null, 4).split('\n').slice(1, -1)
      if (footer.length > 6) {
        footer = footer.slice(0, 6)
        footer.push('    ...')
      }
      footer = footer.join('\n')
      questions.push({
        type: 'confirm',
        name: 'usePkg',
        message: 'Is package.json accurate (if not, you may update it now and come back to this prompt)?',
        footer,
        initial: true
      })
    }

    return prompter
      .prompt(questions)
      .then(a => {
        answers = a
        if (!answers.usePkg) pkg = {}
        const hasScope = pkg.name && pkg.name[0] === '@'
        const pkgScope = hasScope ? pkg.name.split('/')[0] : ''
        const questions = []

        if (!pkg.name) {
          questions.push({
            type: 'input',
            name: 'name',
            message: 'What is the name of the project/package?'
          }, {
            type: 'input',
            name: 'npm_scope',
            message: 'What is the NPM scope (blank if none)?',
            result (a) {
              if (a[0] !== '@') return '@' + a
              return a
            }
          })
        } else {
          pkg.npm_scope = pkgScope
        }

        if (!pkg.repository) {
          questions.push({
            type: 'input',
            name: 'github_username',
            message: 'What is the GitHub username?',
            initial: (r) => r.enquirer.answers.npm_scope ? r.enquirer.answers.npm_scope.replace('@', '') : ''
          }, {
            type: 'input',
            name: 'repository',
            message: 'What is the repo URL?',
            initial: (r) => {
              const a = r.enquirer.answers
              return `https://github.com/${[a.github_username, a.name].filter(Boolean).join('/').toLowerCase()}`
            }
          })
        }

        if (!pkg.homepage) {
          questions.push({
            type: 'input',
            name: 'homepage',
            message: 'What is the homepage?',
            initial: (r) => r.enquirer.answers.repository || ''
          })
        }

        if (!pkg.description) {
          questions.push({
            type: 'input',
            name: 'description',
            message: 'What is the project/package description?'
          })
        }

        if (!pkg.version) {
          questions.push({
            type: 'input',
            name: 'version',
            message: 'What is the project/package starting version?',
            initial: '0.0.0'
          })
        }

        if (!pkg.author) {
          questions.push({
            type: 'input',
            name: 'author',
            message: 'What is the author\'s name and contact info?',
            initial: 'Tyson Zimmerman <thezimmee@gmail.com> (https://github.com/thezimmee)'
          })
        }

        if (!pkg.license) {
          questions.push({
            type: 'input',
            name: 'license',
            message: 'What is the license?',
            initial: 'ISC'
          })
        }

        return prompter.prompt(questions)
          .then(a => {
            if (a.npm_scope && !a.name.includes(a.npm_scope)) {
              a.name = [a.npm_scope, a.name].join('/')
            }
            return a
          })
          .then(a => Object.assign({}, pkg, answers, a))
      })
      .then(answers => {
        const features = {
          linting: true,
          jest: true,
          browserTesting: answers.type === 'web',
          uiTesting: answers.type === 'web',
          github: true,
          npm: answers.type === 'node',
          vercel: answers.type === 'web',
          githubPages: false,
          monorepo: answers.monorepo
        }

        return prompter.prompt([{
          type: 'multiselect',
          name: 'features',
          message: 'Confirm features to include in this project:',
          initial: Object.keys(features).filter(k => features[k]),
          choices: [
            { name: 'linting', message: 'Code linting' },
            { name: 'npm', message: 'Deploy/publish to NPM' },
            { name: 'vercel', message: 'Deploy to Vercel' },
            { name: 'githubPages', message: 'Deploy to GitHub pages' },
            { name: 'github', message: 'GitHub releases' },
            { name: 'monorepo', message: 'Monorepo' },
            { name: 'jest', message: 'Testing: unit/e2e' },
            { name: 'uiTesting', message: 'Testing: UI/visual regression' },
            { name: 'browserTesting', message: 'Testing: Browser/DOM' },
          ],
          result (names) {
            for (const feature in features) {
              features[feature] = names.includes(feature)
            }
            features.release = Boolean(features.github || features.npm || features.vercel)
            features.testing = Boolean(features.jest || features.browserTesting || features.uiTesting)
            return features
          }
        }]).then(a => Object.assign({}, answers, a))
      })
  }
}
