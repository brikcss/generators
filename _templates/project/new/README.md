---
to: README.md
---
# <%= locals.name || 'New Project' %>

<%= locals.description || '' %>

## Install

```bash
npm i <%= locals.name %>
```

## Development

### Code linting on commit

`git commit` will automatically format and lint files to be committed. Nothing is required other than to commit code with git.

### Auto release

#### `npm run release`

Run an automated release workflow with [release-it](https://www.npmjs.com/package/release-it). See configuration in `.release-it.js`.

#### `npm run release -- --dry-run`

Run a dry run release. This allows you to see the interactivity and commands that would be executed before actually releasing.
