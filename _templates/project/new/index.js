const path = require('path')
const fs = require('fs')

function formatDest (dir) {
  if (typeof dir !== 'string' || dir === '.') return ''
  if (dir.slice(-1) !== '/') return dir + '/'
  return dir
}

function findPkg (destDir) {
  const cwd = process.cwd()
  const destArray = ['', ...destDir.slice(0, -1).split('/')]
  const destLength = destArray.length
  let result
  destArray.some((e, i) => {
    const testPath = path.join(cwd, destArray.slice(0, destLength - i).join('/'), 'package.json')
    if (fs.existsSync(testPath)) {
      result = testPath
      return true
    }
  })
  return result
}

module.exports = {
  prompt: ({ prompter, args }) => {
    //
    // STEP 1: Get project type and helpful data to auto configure.
    //

    if (args.name && ['node', 'web'].includes(args.name)) {
      args.type = args.name
      args.name = undefined
    }
    const questions = []
    let answers = args || {}
    let pkg = {}

    if (!answers.type) {
      questions.push({
        type: 'select',
        name: 'type',
        message: 'What type of project is this?',
        choices: [
          { name: 'node', message: 'NodeJS' },
          { name: 'web', message: 'Web project' }
        ]
      })
    }

    if (!answers.dest) {
      questions.push({
        type: 'input',
        name: 'dest',
        message: 'Where is the project\'s root directory (`.` for cwd)?',
        initial: '.'
      })
    }

    if (!answers.monorepo) {
      questions.push({
        type: 'confirm',
        name: 'monorepo',
        message: 'Would you like to create a monorepo?'
      })
    }

    return prompter
      .prompt(questions)
      .then(a => {
        //
        // STEP 2: Get any useful package.json data to auto configure.
        //

        answers = Object.assign(answers, a)
        const questions = []
        const pkgPath = findPkg(answers.dest)
        pkg = pkgPath ? require(pkgPath) : {}

        if (pkgPath && !answers.usePkg) {
          let footer = JSON.stringify(pkg, null, 4).split('\n').slice(1, -1)
          if (footer.length > 6) {
            footer = footer.slice(0, 6)
            footer.push('    ...')
          }
          footer = footer.join('\n')
          questions.push({
            type: 'select',
            name: 'usePkg',
            message: `Use ${path.relative('.', pkgPath)}?`,
            footer: `\n    package.json contents:\n\n${footer}\n\n    NOTE: You may update package.json for accuracy before completing this prompt.`,
            initial: 'confirm',
            choices: [
              { name: 'yes', message: 'Yes, package.json is 100% accurate.' },
              { name: 'confirm', message: 'Yes, but confirm.' },
              { name: 'no', message: 'No, ask me everything.' }
            ]
          })
        }

        return prompter.prompt(questions)
      })
      .then(a => {
        //
        // STEP 3: Get any other missing data.
        //

        answers = Object.assign(answers, answers.usePkg !== 'no' ? pkg : {}, a)
        answers.dest = formatDest(answers.dest)
        const confirmPkg = answers.usePkg === 'confirm'
        const questions = []
        if (!answers.name || confirmPkg) {
          questions.push({
            type: 'input',
            name: 'name',
            message: 'What is the name of the project/package?',
            initial: answers.name || (answers.dest ? answers.dest.slice(0, -1).split('/').slice(-1)[0] : '')
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
          const hasScope = answers.name && answers.name[0] === '@'
          answers.npm_scope = hasScope ? answers.name.split('/')[0] : ''
        }

        if (!answers.repository || confirmPkg) {
          questions.push({
            type: 'input',
            name: 'github_username',
            message: 'What is the GitHub username?',
            initial: (r) => answers.repository || r.enquirer.answers.npm_scope ? r.enquirer.answers.npm_scope.replace('@', '') : ''
          }, {
            type: 'input',
            name: 'repository',
            message: 'What is the repo URL?',
            initial: (r) => {
              if (r.enquirer.answers.repository) return r.enquirer.answers.repository
              const a = r.enquirer.answers
              return `https://github.com/${[a.github_username, a.name].filter(Boolean).join('/').toLowerCase()}`
            }
          })
        }

        if (!answers.homepage || confirmPkg) {
          questions.push({
            type: 'input',
            name: 'homepage',
            message: 'What is the homepage?',
            initial: (r) => answers.homepage || r.enquirer.answers.repository || ''
          })
        }

        if (!answers.description || confirmPkg) {
          questions.push({
            type: 'input',
            name: 'description',
            message: 'What is the project/package description?',
            initial: answers.description || ''
          })
        }

        if (!answers.version || confirmPkg) {
          questions.push({
            type: 'input',
            name: 'version',
            message: 'What is the project/package starting version?',
            initial: answers.version || '0.0.0'
          })
        }

        if (!answers.author || confirmPkg) {
          questions.push({
            type: 'input',
            name: 'author',
            message: 'What is the author\'s name and contact info?',
            initial: answers.author || 'Tyson Zimmerman <thezimmee@gmail.com> (https://github.com/thezimmee)'
          })
        }

        if (!answers.license || confirmPkg) {
          questions.push({
            type: 'input',
            name: 'license',
            message: 'What is the license?',
            initial: answers.license || 'ISC'
          })
        }

        return prompter.prompt(questions)
          .then(a => {
            if (a.npm_scope && !a.name.includes(a.npm_scope)) {
              a.name = [a.npm_scope, a.name].join('/')
            }
            return a
          })
      })
      .then(a => {
        //
        // Step 4: Confirm all the desired features.
        //

        answers = Object.assign(answers, a)
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
            { name: 'browserTesting', message: 'Testing: Browser/DOM' }
          ],
          result (names) {
            for (const feature in features) {
              features[feature] = names.includes(feature)
            }
            features.release = Boolean(features.github || features.npm || features.vercel)
            features.testing = Boolean(features.jest || features.browserTesting || features.uiTesting)
            return features
          }
        }]).then(a => Object.assign(answers, a))
      })
  }
}
