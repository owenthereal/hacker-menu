import Menubar from 'menubar'
import Shell from 'shell'
import Server from 'electron-rpc/server'
import Path from 'path'
import _ from 'underscore'
import AutoUpdateManager from './server/auto_update_manager'
import StoryManager from './server/story_manager'
import TrayManager from './server/tray_manager'
import StoryType from './model/story_type'

var server = new Server()

var opts = {
  dir: __dirname,
  icon: Path.join(__dirname, '..', 'images', 'Icon.png'),
  iconNew: Path.join(__dirname, '..', 'images', 'Icon-new.png'),
  preloadWindow: true
}
var menu = Menubar(opts)

process.on('uncaughtException', function (error) {
  if (!_.isEmpty(error.message)) {
    console.log(error.message)
  }

  if (!_.isEmpty(error.stack)) {
    console.log(error.stack)
  }
})

menu.on('after-create-window', function () {
  server.configure(menu.window.webContents)
  menu.window.webContents.on('new-window', function (e, url, frameName, disposition) {
    e.preventDefault()
    Shell.openExternal(url)
  })
})

menu.on('ready', function () {
  menu.tray.setToolTip('Hacker Menu')

  var autoUpdateManager = new AutoUpdateManager(menu.app.getVersion())
  autoUpdateManager.on('update-available', function (releaseVersion) {
    server.send('update-available', releaseVersion)
  })

  var trayManager = new TrayManager(menu.window, menu.tray, opts.icon, opts.iconNew)

  var storyManager = new StoryManager(20)
  storyManager.on('story-manager-status', function (status) {
    server.send('story-manager-status', status)
  })
  storyManager.on('new-story', function () {
    trayManager.notifyNewStories()
  })

  _.each(StoryType.ALL, function (type) {
    server.on(type, function (req, next) {
      storyManager.fetch(type, function (err, stories) {
        if (err) {
          return next(err)
        }

        next(null, stories)
      })
    })

    storyManager.watch(type, function (err, stories) {
      if (err) {
        console.log(err)
        return
      }

      server.send(type, stories)
    })
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
    Shell.openExternal(req.body.url)
  })
})
