import Events from 'events'
import Firebase from 'firebase'
import Moment from 'moment'
import URL from 'url'

export default class HN {
  constructor(url) {
    this.hn = new Firebase(url);
    this.eventEmitter = new Events.EventEmitter
  }
  on(type, cb) {
    this.eventEmitter.on(type, cb)
  }
  start() {
    var self = this
    self.hn.child('topstories').on('value', function(storyIds) {
      var count = 0;
      storyIds.forEach(function(storyId) {
        var index = parseInt(storyId.key())
        var id = storyId.val()

        self.hn.child('item/' + id).once('value', function(storySnapshot) {
          var story = storySnapshot.val()
          if (!story) {
            console.log(storySnapshot.key())
            return
          }

          story.rank = index
          story.timeAgo = Moment.unix(story.time).fromNow()
          story.yurl = "https://news.ycombinator.com/item?id=" + story.id
          story.host = URL.parse(story.url).hostname
          self.eventEmitter.emit("top", story)
        }, function(err) {
          console.log(err)
        });

        return ++count == 10
      });
    }, function (errorObject) {
      console.log("The read failed: " + errorObject.code)
    })
  }
}
