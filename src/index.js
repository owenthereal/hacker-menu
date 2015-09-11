import Menubar from 'menubar'
import Shell from 'shell'
import Server from 'electron-rpc/server'
import Path from 'path'
import _ from 'lodash'
import AutoUpdateManager from './server/auto_update_manager'
import StoryManager from './server/story_manager'
import TrayManager from './server/tray_manager'
import StoryType from './model/story_type'
import ReadCache from './model/read_cache'
import Winston from 'winston'
import Nslog from './winston/nslog'

var server = new Server()

var opts = {
  dir: __dirname,
  icon: Path.join(__dirname, '..', 'images', 'Icon.png'),
  iconNew: Path.join(__dirname, '..', 'images', 'Icon-new.png'),
  preloadWindow: true
}
var menu = Menubar(opts)
var appDataPath = Path.join(menu.app.getPath('appData'), menu.app.getName())

var logger = new Winston.Logger({
  transports: [
    new Nslog()
  ]
})

var readCache = new ReadCache(appDataPath, 500, logger)

process.on('uncaughtException', function (error) {
  if (error) {
    logger.error('uncaughtException', { message: error.message, stack: error.stack })
  }
})

menu.on('after-create-window', function () {
  server.configure(menu.window.webContents)
  readCache.load()

  menu.window.webContents.on('new-window', function (e, url, frameName, disposition) {
    e.preventDefault()
    Shell.openExternal(url)
  })

  menu.window.on('closed', function () {
    menu.window = null
    readCache.store()
  })
})

menu.on('ready', function () {
  menu.tray.setToolTip('Hacker Menu')

  var autoUpdateManager = new AutoUpdateManager(menu.app.getVersion(), logger)
  autoUpdateManager.on('update-available', function (releaseVersion) {
    server.send('update-available', releaseVersion)
  })

  var trayManager = new TrayManager(menu.window, menu.tray, opts.icon, opts.iconNew)

  var storyManager = new StoryManager(20, readCache)
  storyManager.on('new-story', function () {
    trayManager.notifyNewStories()
  })
  storyManager.on('story-manager-status', function (status) {
    logger.info('story-manager-status', status)
  })

  _.each(StoryType.ALL, function (type) {
    server.on(type, function (req, next) {
      storyManager.fetch(type, function (err, stories) {
        if (err) {
          return next(err)
        }

        var body = {}
        body[type] = stories

        next(null, body)
      })
    })

    storyManager.watch(type, function (err, stories) {
      if (err) {
        logger.error('story-manager-watch-error', { message: err.message, stack: err.stack })
        return
      }

      var body = {}
      body[type] = stories

      server.send(type, body)
    })
  })

  server.on('current-version', function (req, next) {
    next(null, menu.app.getVersion())
  })

  server.on('terminate', function (e) {
    server.destroy()

    if (autoUpdateManager.isUpdateAvailable()) {
      autoUpdateManager.quitAndInstall()
    } else {
      menu.app.terminate()
    }
  })

  server.on('open-url', function (req) {
    var url = _.trim(req.body.url, '#')
    Shell.openExternal(url)
  })

  server.on('mark-as-read', function (req, next) {
    readCache.set(req.body.id)
    next()
  })
})
