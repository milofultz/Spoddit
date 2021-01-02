// reddit functions
var getTopPosts = async function (subreddit, time, n=10) {
  try {
    var url = `https://www.reddit.com/r/${subreddit}/top/.json?t=${time}`;
    return await fetch(url)
      .then(response => response.json())
      .then(json => extractAndOrderPostData(json.data.children))
      .catch(error => console.log(error));
  } catch {
    console.log(`An error occurred in getting top posts from ${subreddit} with time ${time}.`);
  }
};

var extractAndOrderPostData = function (rawPosts) {
  var output = [];
  var properties = ["score", "title", "author", "subreddit", "url"];
  for (var i = 0; i < rawPosts.length; i++) {
    var rawPost = rawPosts[i].data;
    var postData = {};
    complete = true;
    for (var j = 0; j < properties.length; j++) {
      var property = properties[j];
      if (rawPost[property] === undefined) {
        complete = false;
        break;
      }
      postData[property] = rawPost[property];
    }
    if (complete) {
      output.push(postData);
    }
  }
  // Sort high to low
  output.sort(function(a, b) {
    return parseInt(b.score) - parseInt(a.score);
  });
  return output;
};
