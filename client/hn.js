import Events from 'events'
import Firebase from 'firebase'

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
          story.rank = index
          self.eventEmitter.emit("story", story)
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
