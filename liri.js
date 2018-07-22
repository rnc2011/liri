require("dotenv").config();
var keys = require('./keys.js');
var fs = require("fs");
var request = require("request");
var Spotify = require("node-spotify-api");
var Twitter = require("twitter");

var spotify = new Spotify(keys.spotify);
var client = new Twitter(keys.twitter);

var transaction = process.argv[2];
var input = process.argv[3];

switch (transaction) {
    case "my-tweets":
        grabTweets()
        break;
    case "spotify-this-song":
        grabSpotify()
        break;
    case "movie-this":
        grabMovie()
        break;
    case "do-what-it-says":
        doAsTold()
        break;
}

function grabTweets() {
    var params = {
        screen_name: 'Richard84761414',
        count: 20
    }

    client.get('statuses/user_timeline', params, function (error, tweets, response) {
        if (error) { // if there IS an error
            console.log('Error occurred: ' + error);
        } else { // if there is NO error
            console.log("My 20 Most Recent Tweets");
            console.log("");

            for (var i = 0; i < tweets.length; i++) {
                console.log("( #" + (i + 1) + " )  " + tweets[i].text);
                console.log("Created:  " + tweets[i].created_at);
                console.log("");
            }
        }
    });
}

function grabSpotify() {
    //spotify.getArtist
    if (input === undefined) {
        input = "The Sign"
    }

    spotify.search({ type: 'track', query: input }, function (err, data) {
        if (err) {
            console.log('ERROR: ' + err);
            return;
        } else {
            var songInfo = data.tracks.items[0];
            console.log(" " + " " + "SPOTIFY RESULTS: " + " " + " ")
            console.log("ARTIST:", songInfo.artists[0].name);
            console.log("SONG:", songInfo.name);
            console.log("ALBUM:", songInfo.album.name);
            console.log("PREVIEW:", songInfo.preview_url);
            fs.appendFile("log.txt", "--------------" + "\n" + songInfo.artists[0].name + "\n" + songInfo.name + "\n"+ songInfo.album.name + "\n"+ songInfo.preview_url+ "\n"+ "--------------" + "\n" + "\n", function (err) {
                if (err) {
                    console.log("ERROR")
                }
            });
        };
    });
}

function grabMovie() {
    if (input === undefined) {
        input = "Mr. Nobody"
    }
    request("http://www.omdbapi.com/?apikey=trilogy&t=" + input, function (error, response, body) {

        // If the request was successful...
        if (!error && response.statusCode === 200) {

            // Then log the body from the site!
            var data = JSON.parse(body)
            //console.log(data)
            console.log(data.Title);
            console.log(data.Year)
            console.log(data.imdbRating)
            console.log(data.Ratings[1].Value)
            console.log(data.Country)
            console.log(data.Language)
            console.log(data.Plot)
            console.log(data.Actors)
            fs.appendFile("log.txt", "--------------" + "\n" + data.Title + "\n" + data.Year + "\n"+ data.imdbRating + "\n"+ data.Ratings[1].Value + "\n"+ data.Country + "\n"+ data.Language + "\n"+ data.Plot + "\n"+ data.Actors+ "\n" + "--------------" + "\n" + "\n", function (err) {
                if (err) {
                    console.log("ERROR")
                }
            });
            
        }
    });

}

function doAsTold() {
    var noInput = fs.readFile("./random.txt", "utf8", function (error, data) {
        var dataArr = data.split(",");
        // console.log (noInput);
        //console.log(dataArr);
        transaction = dataArr[0]
        input = dataArr[1]
        switch (transaction) {
            case "my-tweets":
                grabTweets()
                break;
            case "spotify-this-song":
                grabSpotify()
                break;
            case "movie-this":
                grabMovie()
                break;
            case "do-what-it-says":
                doAsTold()
                break;
        }
    });
}