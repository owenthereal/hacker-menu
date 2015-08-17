var menubar = require('menubar')

var opts = {dir: __dirname}
var menu = menubar(opts)

process.on('uncaughtException', function (err) {
  dialog.showErrorBox('Uncaught Exception: ' + err.message, err.stack || '')
  menu.app.quit()
})

menu.on('ready', function ready () {
})
