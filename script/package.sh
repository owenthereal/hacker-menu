#!/usr/bin/env bash

set -e

electron-packager . 'Hacker Menu' \
  --overwrite \
  --sign='Developer ID Application: Jingwen Ou' \
  --icon='images/Icon@1024.icns' \
  --platform=darwin \
  --arch=x64 \
  --version=$npm_package_config_electron_version \
  --ignore='src' \
  --ignore='node_modules/(babel|standard|csscomb)' \
  --ignore='node_modules/electron-(packager|prebuild|rebuild)'
