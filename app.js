// import config from .env file
require('dotenv').config();

//module dependencies
const express = require('express'),
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
  // validations on input
  const processedInput = processUserInput(req.query);
  const twitter_response = [];

  function findTweets() {
    TwitterAccess.get(
      'search/tweets',
      {
        q: ['the', 'a', 'an', processedInput.searchTerm, 'exclude:retweets'],
        count: processedInput.request_count,
      },
      function(err, data, response) {
        if (err) {
          twitter_response = err;
        }
        twitter_response = data.statuses.map(function(tweet) {
          return tweet.text;
        });

        res.setHeader('Access-Control-Allow-Origin', 'http://localhost:8080');
        res.setHeader('Content-Type', 'application/json');
        res.json({ tweetResults: twitter_response });
      },
    );
  }
  findTweets();
});

function processUserInput(userInput) {
  /* check for a search term in the query, and
  ** if there isn't one, then just substitute
  ** 'awesome sauce'.
  ** Also keep string to a reasonable length.
  */
  let searchTerm = userInput.term || 'awesome sauce';
  if (searchTerm.length > 50) {
    searchTerm = searchTerm.substring(0, 50);
  }

  // ask for 1 tweet by default if no count sent
  let request_count = parseInt(userInput.count, 10) || 1;

  // ask for 1 tweet if the count is something wacky
  if (isNaN(request_count)) {
    request_count = 1;
  }

  // ask for 100 tweets at most
  if (request_count > 100) {
    request_count = 100;
  }

  const processedInput = {
    searchTerm,
    request_count,
  };

  return processedInput;
}

const port = process.env.PORT || 3001;

console.log('app listening at ' + port);
app.listen(port);
