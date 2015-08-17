var Firebase = require('firebase')

var hn = new Firebase('https://hacker-news.firebaseio.com/v0');
hn.child('topstories').on('value', function(storyIds) {
  var count = 0;
  storyIds.forEach(function(storyId) {
    var index = storyId.key();
    var id = storyId.val();

    hn.child('item/' + id).once('value', function(storySnapshot) {
      var story = storySnapshot.val();
      console.log(story.id);
    }, function(err) {
      console.log(err);
    });

    return ++count == 10;
  });
}, function (errorObject) {
  console.log("The read failed: " + errorObject.code);
});
