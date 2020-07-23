---
to: README.md
---
# <%= locals.name || 'New Project' %>

<%= locals.description || '' %>

## Install

```bash
# 1) Update package.json.
npx npm-check-updates -u
# 2) Install dependencies.
npm i
```

## Features and Usage

### Code linting on commit

`git commit` will automatically format and lint files to be committed. Nothing is required other than to commit code with git.

### Auto release

#### `npm run release`

This script will run an automated release workflow with [release-it](https://www.npmjs.com/package/release-it). A release can do any of the following:

1. Run tests.
2. Bump version.
3. Create a GitHub release.
4. Generate a changelog.
5. Update contributors.
6. Publish to NPM.
7. Manage pre-releases.
8. Deploy to Vercel.
9. Deploy to GitHub pages.

Any of these features can be toggled in `.release-it.js`. **It's important you configure it to your desired environments and settings.**

#### `npm run release -- --dry-run`

Do a dry run release. This allows you to see the interactivity and commands that would be executed before actually releasing.
