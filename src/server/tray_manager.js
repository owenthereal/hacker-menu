import NativeImage from 'native-image'

export default class TrayManager {
  constructor (window, tray, icon, iconNew) {
    this.window = window
    this.tray = tray
    this.icon = icon
    this.iconNew = iconNew
    this.hasNewStories = false
    this.setUpTrayListeners()
  }

  setUpTrayListeners () {
    var self = this
    var setIcon = function () {
      if (self.hasNewStories) {
        self.tray.setImage(NativeImage.createFromPath(self.icon))
        self.hasNewStories = false
      }
    }
    this.tray.on('clicked', setIcon)
    this.tray.on('double-clicked', setIcon)
  }

  notifyNewStories () {
    if (!this.hasNewStories && !this.window.isVisible()) {
      this.tray.setImage(NativeImage.createFromPath(this.iconNew))
      this.hasNewStories = true
    }
  }
}
