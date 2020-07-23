const fs = require('fs')

const PKG_KEYS = [
  'name',
  'version',
  'description',
  'homepage',
  'keywords',
  'license',
  'author',
  'repository',
  'bugs',
  'scripts',
  'dependencies',
  'devDependencies',
  'main',
  'browser',
  'bin  ',
  'man',
  'files',
  'directories',
  'config',
  'peerDependencies',
  'optionalDependencies',
  'engines',
  'private',
  'publishConfig'
]
const REQUIRED_KEYS = {
  name: 'string',
  version: 'string',
  scripts: 'object',
  dependencies: 'object',
  devDependencies: 'object'
}

function mergePkg (pkg, newPkg) {
  PKG_KEYS.forEach(key => {
    // If one side doesn't exist, take the side that exists.
    if (!pkg[key] || !newPkg[key]) {
      pkg[key] = newPkg[key] || pkg[key]
    // Now we know both sides exist...
    // If both sides are an object, merge it.
    } else if (
      (typeof pkg[key] === 'object' && pkg[key] instanceof Object) &&
      (typeof newPkg[key] === 'object' && newPkg[key] instanceof Object)
    ) {
      pkg[key] = {
        ...pkg[key],
        ...newPkg[key]
      }
    // Otherwise accept the newPkg side.
    } else {
      pkg[key] = newPkg[key]
    }
    // Ensure required keys exist.
    const requiredType = REQUIRED_KEYS[key]
    if ((!pkg[key] && Boolean(requiredType))) {
      pkg[key] = requiredType === 'object' ? {} : ''
    }
  })
  return pkg
}

module.exports = {
  helpers: {
    // Merge with existing package.json data.
    pkg (...pkgs) {
      let existingPkg = fs.existsSync('./package.json')
      existingPkg = existingPkg ? JSON.parse(fs.readFileSync('./package.json', 'utf8')) : {}
      return pkgs.reduce((result, newPkg) => {
        result = mergePkg(result, newPkg)
        return result
      }, existingPkg);
    },
    mergePkg,
    include (filepath) {
      return fs.readFileSync(filepath, 'utf8')
    }
  }
}
