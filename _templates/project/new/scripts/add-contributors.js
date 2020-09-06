---
to: "scripts/add-contributors.js"
---
/* globals Plugin */
const nyc = require('name-your-contributors')
const ejs = require('ejs')
const fs = require('fs')
const DEFAULT_TEMPLATE = <%-
(() => {
  return `\`<!-- START: CONTRIBUTORS -->

## Contributors

Thank you to the following individuals for your contributions!

<table>\<\% locals.contributors.forEach((c, index) => { _\%\>
\<\% if (index % 4 === 0) { \%\><tr>\<\% } \%\>
<td align="center">
  <a href="\<\%= c.url \%\>" title="\<\%= c.name \%\>">
    <img src="\<\%= c.url \%\>.png?size=64" height="64" alt="\<\%= c.name \%\>" />
  </a>
  <div>
    <a href="\<\%= c.url \%\>" title="\<\%= c.name \%\>"><font size="4">\<\%= c.name \%\></font></a>
    <div>
      \<\% if (c.codeContributions) { _\%\>
      <svg width="1em" height="1em" viewBox="0 0 16 16" fill="#888" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M4.854 4.146a.5.5 0 0 1 0 .708L1.707 8l3.147 3.146a.5.5 0 0 1-.708.708l-3.5-3.5a.5.5 0 0 1 0-.708l3.5-3.5a.5.5 0 0 1 .708 0zm6.292 0a.5.5 0 0 0 0 .708L14.293 8l-3.147 3.146a.5.5 0 0 0 .708.708l3.5-3.5a.5.5 0 0 0 0-.708l-3.5-3.5a.5.5 0 0 0-.708 0zm-.999-3.124a.5.5 0 0 1 .33.625l-4 13a.5.5 0 0 1-.955-.294l4-13a.5.5 0 0 1 .625-.33z"/>
      </svg>
      <font color="#888">\<\%= c.codeContributions \%\> code contributions</font>
      <br/>
      \<\% } _\%\>
      <svg width="1em" height="1em" viewBox="0 0 16 16" fill="#888" xmlns="http://www.w3.org/2000/svg">
        <path fill-rule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z"/>
      </svg>
      <font color="#888">\<\%= c.total \%\>\<\% if (c.codeContributions) { \%\> total\<\% } \%\> contributions</font>
    </div>
  </div>
</td>
\<\% if (index % 4 === 0) { \%\></tr>\<\% } \%\>
\<\%_ }) \%\></table>

<!-- END: CONTRIBUTORS -->\``
})()
%>

module.exports = class AddContributors extends Plugin {
  constructor (...args) {
    super(...args)
    this.options = Object.assign({
      nyc: {},
      ejs: {},
      enabled: true,
      template: DEFAULT_TEMPLATE,
      to: 'README.md',
      overwrite: false
    }, this.options)
  }

  static isEnabled () {
    return this.options.enabled !== false
  }

  async beforeBump () {
    await nyc.repoContributors(this.options.nyc).then(data => {
      // Format the return data. GitHub avatars are found at https://github.com/{username}.png?size={size}
      // Format single list of contributors, with types of contributions.
      const contributors = []
      const map = {}
      Object.keys(data).forEach(key => {
        data[key].forEach((c, i) => {
          let contributor = map[c.login]
          // Find or create contributor in map.
          if (!contributor) {
            map[c.login] = {
              id: c.login,
              name: c.name,
              url: c.url,
              total: 0,
              codeContributions: 0,
              contributions: {}
            }
            contributor = map[c.login]
            contributors.push(contributor)
          }
          // Add contributions.
          contributor.contributions[key] = c.count
          contributor.total = contributor.total + c.count
          if (['commitAuthors', 'prCreators'].includes(key)) {
            contributor.codeContributions = contributor.codeContributions + c.count
          }
          // Update original data with map reference.
          data[key][i] = contributor
        })
      })
      contributors.sort((a, b) => a.total - b.total)
      data.contributors = contributors
      data.contributorsMap = map

      // Add contributors to destination file.
      const markup = ejs.render(this.options.template, data, this.options.ejs)
      let outputFile = markup
      // Overwrite, replace or append.
      if (!this.options.overwrite) {
        if (fs.existsSync(this.options.to)) {
          outputFile = fs.readFileSync(this.options.to, 'utf8')
        }
        if (outputFile.includes('<!-- START: CONTRIBUTORS -->') && outputFile.includes('<!-- END: CONTRIBUTORS -->')) {
          outputFile = outputFile.replace(/<!-- START: CONTRIBUTORS -->([\s\S]*)<!-- END: CONTRIBUTORS -->/, markup)
        } else {
          outputFile = [outputFile, markup].join('\n\n')
        }
      }
      fs.writeFileSync(this.options.to, outputFile)

      // Add contributors to package.json.
      let pkg = fs.existsSync('package.json')
      if (pkg) {
        pkg = require('package.json')
        pkg.contributors = data.contributors
        fs.writeFileync('package.json', JSON.stringify(pkg, null, 2))
      }
    })
  }
}
