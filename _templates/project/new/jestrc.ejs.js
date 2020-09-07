---
to: "<%= locals.dest %>.jestrc.js"
---
module.exports = {
  setupFilesAfterEnv: ['<rootDir>/.jest-setup.js']
}
