// reddit functions
var getTopPosts = function (subreddit, time, n=10, callback) {
  try {
    // Create URL
    var url = `https://www.reddit.com/r/${subreddit}/top/.json?t=${time}`;
    // Get JSON from top posts
    var xhr = new XMLHttpRequest();
    xhr.open('GET', url, true);
    xhr.onload = function () {
      if (this.status === 200) {
        var res = JSON.parse(this.responseText);
        callback(res.data.children);
      }
    };
    xhr.onerror = function () {
      console.log(`An error occurred in getting top posts from ${subreddit} with time ${time}.`);
    }
    xhr.send();
  } catch {
    console.log(`An error occurred in getting top posts from ${subreddit} with time ${time}.`);
  }
};

var getOrderedTopPostData = function (rawPosts) {
  var output = [];
  var attributes = ["score", "title", "author", "subreddit", "url"];
  for (var i = 0; i < rawPosts.length; i++) {
    var rawPost = rawPosts[i].data;
    var postData = {};
    complete = true;
    for (var j = 0; j < attributes.length; j++) {
      var attribute = attributes[j];
      if (rawPost[attribute] === undefined) {
        complete = false;
        break;
      }
      postData[attribute] = rawPost[attribute];
    }
    // Filter incomplete cases
    if (complete) output.push(postData);
  }

  // Sort output data
  output.sort(function(a, b) {
    return parseInt(b.score) - parseInt(a.score);
  });
  return output;
};

getTopPosts('music', 10, 10, getOrderedTopPostData);