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
  var searchTerm = req.query.term;

  function findTweets() {
    TwitterAccess.get(
      'search/tweets',
      { q: ['the', 'a', 'an', searchTerm, 'exclude:retweets'], count: 5 },
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

var port = process.env.PORT || 3001;

console.log('app listening at ' + port);
app.listen(port);
