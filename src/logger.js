import fs from 'fs'
import Winston from 'winston'
import NewrelicWinston from 'newrelic-winston'
import Path from 'path'

module.exports = function (appDataPath, version) {
  var env = 'prod'
  try {
    fs.statSync(Path.join(__dirname, 'newrelic.js'))
  } catch (err) {
    env = 'dev'
  }

  var logDir = Path.join(appDataPath, 'Log')
  try {
    fs.mkdirSync(logDir)
  } catch (e) {
    // ignore
  }

  var versionRewriter = function (level, msg, meta) {
    if (!meta) {
      meta = {}
    }

    meta.version = version
    return meta
  }

  return new Winston.Logger({
    transports: [
      new Winston.transports.Console(),
      new Winston.transports.DailyRotateFile({ filename: Path.join(logDir, 'app.log') }),
      new NewrelicWinston({ env: env })
    ],
    rewriters: [ versionRewriter ]
  })
}
