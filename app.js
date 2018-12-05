// import config from .env file
require('dotenv').config();

//module dependencies
var express = require('express'),
  bodyparser = require('body-parser'),
  helmet = require('helmet'),
  twit = require('twit'),
  app = express();

app.use(helmet());
app.use(bodyparser.urlencoded({ extended: false }));

/* storing API key variables to be accessed via dotenv, as
** specified above
*/
var TwitterAccess = new twit({
  consumer_key: process.env.CONSUMER_KEY,
  consumer_secret: process.env.CONSUMER_SECRET,
  access_token: process.env.ACCESS_TOKEN,
  access_token_secret: process.env.ACCESS_TOKEN_SECRET,
});

app.get('/', function(req, res) {

  var processedInput = processUserInput(req.query);

  function findTweets() {
    TwitterAccess.get(
      'search/tweets',
      { q: ['the', 'a', 'an', processedInput.searchTerm, 'exclude:retweets'], count: processedInput.request_count },
      function(err, data, response) {

        var tweetResults = data.statuses.map(function(tweet) {
          return tweet.text;
        });

        res.setHeader('Content-Type', 'application/json');
        res.json({tweetResults: tweetResults});
      }
    );
  }
  findTweets();
});

function processUserInput(userInput) {

  /* check for a search term in the query, and
  ** if there isn't one, then just substitute
  ** 'awesome sauce'
  */
  var searchTerm = userInput.term || 'awesome sauce';
  if (searchTerm.length > 50) {
    searchTerm = searchTerm.substring(0,50);
  };

  // default to 1 if no count sent with the query
  var request_count = parseInt(userInput.count, 10) || 1;

  // if the count isn't a number, default to 1
  if (isNaN(request_count)) {
    request_count = 1;
  }

  // limit requests to 100 results
  if (request_count > 100) {
    request_count = 100;
  };

  var processedInput = {
    searchTerm:searchTerm,
    request_count: request_count,
  };

  return processedInput;
}

var port = process.env.PORT || 3001;

console.log('app listening at ' + port);
app.listen(port);
