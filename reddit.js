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

var removeFeatures = function (title) {
  try {
    return title.replace(/[\(\[](ft|feat).*[\)\]]/, '').trim();
  } catch (err) {
    console.log(err);
    return title;
  }
};

var removeAmpersand = function (title) {
  try {
    return title.replace(/&amp;/, '').trim();
  } catch (err) {
    console.log(err);
    return title;
  }
};

var removeText = function (title) {
  try {
    title = title.replace(/\(Extended\)|\(extended\)|\(Version\)|\(version\)/, '');
    // Preserve title if this regex present
    if (/[\(\[].*(VIP|Mix|mix|Dub|dub|Edit|edit)[\)\]]/.test(title)) {
      return title.trim();
    // Otherwise remove the parenthesized/bracketed text
    } else {
      return title.replace(/[\(\[].*[\)\]]/, '').trim();
    }
  } catch (err) {
    console.log(err);
    return title;
  }
};

// Removes year within a set of parentheses or brackets
var removeYear = function (title) {
  try {
    return title.replaceAll(/[\(\[]((19\d{2})|(20\d{2}))[\)\]]/g, "");
  } catch (err) {
    console.log(err);
    return title;
  }
};

var cleanPostTitle = function (title) {
  return removeYear(
    removeText(
      removeAmpersand(
        removeFeatures(title)
      )
    )
  );
};

var splitPostTitle = function (title) {
  try {
    if (/-/.test(title) && /^[^\n\r]+$/.test(title)) {
      var [artist, title] = title.replace(/\s{2,}/, " ").split(/-/, 2);
      return {
        artist: artist.trim(),
        title: title.trim()
      }
    } else {
      return {
        artist: null,
        title: null
      }
    }
  } catch (err) {
    console.log(err);
    return {
      artist: null,
      title: null
    }
  }
};