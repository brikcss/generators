---
to: "<%= (locals.features.release) ? locals.dest + '.release-it.js' : null %>"
---
/* eslint-disable no-template-curly-in-string */
module.exports = {
  disableMetrics: true,
  hooks: {
    'before:init': 'npm test',
    'after:bump': 'npx auto-changelog -p',
    'after:release': 'echo Successfully released ${name} v${version} to ${repo.repository}.'
  },
  plugins: {
    '@release-it/conventional-changelog': {
      config: require('./.commitlintrc.js'),
      // infile: 'CHANGELOG.md'
    },
    './scripts/add-contributors.js': {
      enabled: true,
      nyc: {},
      ejs: {},
      // template: ``,
      to: 'README.md',
      overwrite: false
    },
    './scripts/deploy-github-pages.js': {
      enabled: <%= (locals.features.githubPages) ? 'true' : 'false' %>,
      to: 'dist',
      ghPages: {}
    },
    './scripts/deploy-vercel.js': {
      enabled: <%= (locals.features.vercel) ? 'true' : 'false' %>
    },
  },
  git: {
    changelog: "npx auto-changelog --stdout --commit-limit false --unreleased --template 'RELEASE.tpl.md'",
    requireCleanWorkingDir: true,
    requireBranch: false,
    requireUpstream: true,
    requireCommits: false,
    addUntrackedFiles: false,
    commit: true,
    commitMessage: 'chore: Release v${version}.',
    commitArgs: [],
    tag: true,
    tagName: null,
    tagAnnotation: 'Release ${version}',
    tagArgs: [],
    push: true,
    pushArgs: ['--follow-tags'],
    pushRepo: ''
  },
  npm: {
    publish: <%= (locals.features.npm) ? 'true' : 'false' %>,
    publishPath: '.',
    tag: null,
    otp: null,
    ignoreVersion: false,
    skipChecks: false
  },
  github: {
    release: true,
    releaseName: 'Release ${version}',
    releaseNotes: null,
    preRelease: false,
    draft: false,
    tokenRef: 'GITHUB_TOKEN',
    assets: null,
    host: null,
    timeout: 0,
    proxy: null,
    skipChecks: false
  },
  // gitlab: {
  //   release: false,
  //   releaseName: 'Release ${version}',
  //   releaseNotes: null,
  //   tokenRef: 'GITLAB_TOKEN',
  //   assets: null,
  //   origin: null,
  //   skipChecks: false
  // }
}
