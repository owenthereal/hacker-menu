import Events from 'events'
import autoUpdater from 'auto-updater'

export default class AutoUpdateManager extends Events.EventEmitter {
  constructor (version, logger) {
    super()
    this.version = version
    // this.feedUrl = 'http://localhost:5000/updates?version=' + version
    this.feedUrl = 'https://hacker-menu.herokuapp.com/updates?version=' + version
    this.state = AutoUpdateManager.IDLE_STATE
    this.logger = logger

    process.nextTick(this.setupAutoUpdater.bind(this))
  }

  setupAutoUpdater () {
    var self = this

    autoUpdater.on('error', function (event, message) {
      self.setState(AutoUpdateManager.ERROR_STATE)
      self.logger.error('auto-updater-manager.error', { error: message })
    })

    autoUpdater.setFeedUrl(this.feedUrl)

    autoUpdater.on('checking-for-update', function () {
      self.setState(AutoUpdateManager.CHECKING_STATE)
    })

    autoUpdater.on('update-not-available', function () {
      self.setState(AutoUpdateManager.NO_UPDATE_AVAILABLE_STATE)
    })

    autoUpdater.on('update-available', function () {
      self.setState(AutoUpdateManager.DOWNLOADING_STATE)
    })

    autoUpdater.on('update-downloaded', function (event, releaseNotes, releaseName, releaseDate, updateUrl) {
      self.setState(AutoUpdateManager.UPDATE_AVAILABLE_STATE)
      self.logger.info('auto-update-manager.update-downloaded', {releaseNotes: releaseNotes, releaseName: releaseName, releaseDate: releaseDate, updateUrl: updateUrl})

      self.emit('update-available', releaseName)
    })

    this.scheduleUpdateCheck()
  }

  setState (state) {
    this.state = state
    this.emit('state-changed', state)
    this.logger.info('auto-update-manager.state-changed', { state: state })
  }

  scheduleUpdateCheck () {
    var fourHours = 1000 * 60 * 60 * 4
    setInterval(this.checkForUpdates.bind(this), fourHours)
    this.checkForUpdates()
  }

  checkForUpdates () {
    autoUpdater.checkForUpdates()
  }

  quitAndInstall () {
    autoUpdater.quitAndInstall()
  }

 isUpdateAvailable () {
   return this.state === AutoUpdateManager.UPDATE_AVAILABLE_STATE
 }
}

AutoUpdateManager.IDLE_STATE = 'idle'
AutoUpdateManager.CHECKING_STATE = 'checking'
AutoUpdateManager.DOWNLOADING_STATE = 'downloading'
AutoUpdateManager.UPDATE_AVAILABLE_STATE = 'update-available'
AutoUpdateManager.NO_UPDATE_AVAILABLE_STATE = 'no-update-available'
AutoUpdateManager.ERROR_STATE = 'error'
