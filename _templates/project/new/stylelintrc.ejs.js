---
to: "<%= locals.features.linting ? locals.dest + '.stylelintrc.js' : null %>"
---
module.exports = {
  extends: 'stylelint-config-recommended',
  rules: {
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['global']
      }
    ],
    'unit-no-unknown': [
      true,
      {
        ignoreUnits: ['gu']
      }
    ]
  }
}
