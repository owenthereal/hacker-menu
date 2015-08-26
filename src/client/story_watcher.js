import Events from 'events'
import Firebase from 'firebase'
import Moment from 'moment'
import URL from 'url'
import _ from 'underscore'

export default class StoryWatcher extends Events.EventEmitter {
  constructor (url) {
    super()
    this.maxNumOfStories = 20 // TODO: make it configurable
    this.fb = new Firebase(url)
    this.fbRefs = {}
    this.fbFuns = {}
  }
  onStoryChange (type, storyIds) {
    var self = this
    var count = storyIds.numChildren()

    storyIds.forEach(function (storyId) {
      var index = parseInt(storyId.key(), 10)
      var id = storyId.val()

      self.fb.child('item/' + id).once('value', function (storySnapshot) {
        var story = storySnapshot.val()
        if (!story) {
          self.emitError(type, new Error('Error loading ' + storySnapshot.key()))
          return
        }

        story.rank = index
        story.timeAgo = Moment.unix(story.time).fromNow()
        story.yurl = self.getYurl(story.id)
        story.by_url = self.getByUrl(story.by)
        if (_.isEmpty(story.url)) {
          story.url = story.yurl
        } else {
          story.host = URL.parse(story.url).hostname
        }
        if (_.isUndefined(story.descendants)) {
          story.descendants = 0
        }

        self.emit(type, story)

        if (--count === 0) {
          self.emit('status', StoryWatcher.UPDATED_STATUS)
        } else {
          self.emit('status', StoryWatcher.SYNCING_STATUS)
        }
      }, function (err) {
        self.emitError(type, err)
      })

      return false
    })
  }
  getYurl (id) {
    return 'https://news.ycombinator.com/item?id=' + id
  }
  getByUrl (by) {
    return 'https://news.ycombinator.com/user?id=' + by
  }
  getChildName (type) {
    var child = ''
    if (type === StoryWatcher.TOP_TYPE) {
      child = 'topstories'
    } else if (type === StoryWatcher.SHOW_TYPE) {
      child = 'showstories'
    } else if (type === StoryWatcher.ASK_TYPE) {
      child = 'askstories'
    } else {
      throw new Error('Unsupported watch type ' + type)
    }

    return child
  }
  watch (type, callback, errback) {
    if (callback != null) {
      this.on(type, callback)
    }

    if (errback != null) {
      this.on(type + '-error', errback)
    }

    this.fbRefs[type] = this.fb.child(this.getChildName(type)).limitToFirst(this.maxNumOfStories)
    this.fbFuns[type] = this.fbRefs[type].on('value', this.onStoryChange.bind(this, type), function (err) {
      this.emitError(type, err)
    }.bind(this))
  }
  unwatchAll () {
    _.each(this.fbRefs, function (ref, type) {
      ref.off('value', this.fbFuns[type])
      delete this.fbRefs[type]
      delete this.fbFuns[type]

      this.removeAllListeners(type)
      this.removeAllListeners(type + '-error')
    }, this)
  }
  emitError (type, obj) {
    this.emit(type + '-error', obj)
  }
}

StoryWatcher.SYNCING_STATUS = 'syncing'
StoryWatcher.UPDATED_STATUS = 'updated'

StoryWatcher.TOP_TYPE = 'top'
StoryWatcher.SHOW_TYPE = 'show'
StoryWatcher.ASK_TYPE = 'ask'
