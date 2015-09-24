#!/usr/bin/env node

var packager = require('electron-packager')
var package = require('../package.json')
var opts = {
  dir: '.',
  name: 'Hacker Menu',
  overwrite: true,
  icon: 'images/Icon@1024.icns',
  platform: 'darwin',
  arch: 'x64',
  version: package.config.electron_version,
  ignore: [
    'src',
    'script',
    'release',
    'node_modules/(babel|standard|csscomb)',
    'node_modules/electron-(packager|prebuild|rebuild)'
  ]
}
if (!process.env.CI) {
  opts.sign = 'Developer ID Application: Jingwen Ou'
}
packager(opts, function done (err, appPaths) {
  if (err) {
    if (err.message) {
      console.error(err.message)
    } else {
      console.error(err, err.stack)
    }

    process.exit(1)
  }

  if (appPaths.length > 1) {
    console.error('Wrote new apps to:\n' + appPaths.join('\n'))
  } else if (appPaths.length === 1) {
    console.error('Wrote new app to', appPaths[0])
  }
})
