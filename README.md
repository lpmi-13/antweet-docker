# Antweet

This is an attempt to target the specific EFL learner need of
being able to revise articles (a/an/the) in writing. It uses
real-time data from the Twitter Search API, stripping the
articles and asking the user to select the original article.

## Running

Clone the repo and create a file named `.env` in the same
directory. Put your Twitter credentials in this file in the
following format, substituting the values you get after you
sign up [here](https://developer.twitter.com):

```
CONSUMER_KEY=thisistheconsumerkey
CONSUMER_SECRET=thisistheconsumersecret
ACCESS_TOKEN=thisistheaccesstoken
ACCESS_TOKEN_SECRET=thisisthesupersecretaccesstoken
```

You'll also need to ensure that Docker is installed on your
machine, as well as Docker Compose.
[This site](https://docs.docker.com/compose/install/) has some
instructions on how to do that. Just google if you get stuck.

(Note: I decided to go with Docker Compose, mostly to enable
the easy inclusion of the `.env` file instead of needing to
pass the credentials to the container at run time from the
command line.)

Once that's all sorted, just run

```
docker-compose up
```

and you should see a bunch of console output, ending in:

```
antweet_1  |
antweet_1  | > antweet@0.0.2 start /app
antweet_1  | > node app.js
antweet_1  |
antweet_1  | app listening at 3001
```

to test it, either go to `localhost:3001/?term=docker` in your
system browser, or `curl localhost:3001/?term=rocks`

the output is a simple JSON structure as follows:
```
{
    "tweetResults": [
        "@channingwalton @YuvalItzchakov @Storakatten @pedrofurla I understand that people are still attracted to the JVM, b\u2026 https://t.co/JDFGYiG77p",
        "@hasssaaannn @AzureDevOps @SQLServer If the database is simple you can use https://t.co/iIPfSspX2Y. Otherwise docke\u2026 https://t.co/cIPigIgNB0",
        "@nrambeck I only use Docker these days. I have a docker-compose.yml with an .env file that lets me easily setup a n\u2026 https://t.co/9jW3JpbIil",
        "Are you interested in the architectural design of Kata Containers, an easy installation using a Docker runtime envi\u2026 https://t.co/0vAFXuMatt",
        "@alecthegeek I\u2019m a docker noob :-) That is, I\u2019ve used it to the extent of following guides and figuring things out\u2026 https://t.co/BHOxQBTS3K"
    ]
}
```
