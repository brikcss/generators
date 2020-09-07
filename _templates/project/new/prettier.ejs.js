---
to: "<%= locals.features.linting ? locals.dest + '.prettierrc.js' : null %>"
---
module.exports = {
  trailingComma: 'es5',
  singleQuote: true,
  printWidth: 100,
  overrides: [
    {
      files: '*.md',
      options: {
        tabWidth: 4
      }
    }
  ]
}
