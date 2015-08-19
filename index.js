var menubar = require('menubar')
var shell = require('shell')
var dialog = require('dialog')

var opts = {dir: __dirname}
var menu = menubar(opts)

process.on('uncaughtException', function (err) {
  dialog.showErrorBox('Uncaught Exception: ' + err.message, err.stack || '')
  menu.app.quit()
})

menu.on('ready', function () {
  menu.on('after-create-window', function () {
    menu.window.webContents.on('new-window', function (e, url, frameName, disposition) {
      e.preventDefault()
      shell.openExternal(url)
    })
  })
})
