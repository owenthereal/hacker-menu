var menubar = require('menubar')
var shell = require('shell')
var dialog = require('dialog')
var Server = require('electron-rpc/server')

var server = new Server()

var opts = {dir: __dirname}
var menu = menubar(opts)

process.on('uncaughtException', function (err) {
  dialog.showErrorBox('Uncaught Exception: ' + err.message, err.stack || '')
  menu.app.quit()
})

menu.on('ready', function () {
  menu.on('after-create-window', function () {
    server.configure(menu.window.webContents)
    menu.window.webContents.on('new-window', function (e, url, frameName, disposition) {
      e.preventDefault()
      shell.openExternal(url)
    })
  })

  server.on('terminate', function (e) {
    server.destroy()
    menu.app.terminate()
  })

  server.on('open-url', function(req) {
    shell.openExternal(req.body.url)
  })
})
