---
to: "<%= (locals.features.linting || locals.features.release) ? '.huskyrc.js' : null %>"
---
module.exports = {
  hooks: {
    'commit-msg': 'commitlint -E HUSKY_GIT_PARAMS',
    <% if (locals.features.linting) { %>'pre-commit': 'lint-staged',<% } %>
  }
}
