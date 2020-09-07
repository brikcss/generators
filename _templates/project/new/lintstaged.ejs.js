---
to: "<%= locals.features.linting ? locals.dest + '.lintstagedrc.js' : null %>"
---
module.exports = {
  '*.js': ['prettier --parser babel --write', 'standard --fix'],
  '*.css': ['prettier --parser css --write', 'stylelint --fix'],
  '*.json': ['prettier --parser json --write'],
  '*.md': ['prettier --parser markdown --write'],
  '*.html': ['prettier --parser html --write'],
  '*.{yaml,yml}': ['prettier --parser yaml --write']
}
