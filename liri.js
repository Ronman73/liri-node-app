var fs = require("fs");
var cmd = process.argv[2];
var parameter = process.argv[3];
var logHistory = "=====================\nCommand: ";

function executeMyAction(c,p)
{
	switch(c)
	{
		case "my-tweets":
			logHistory = logHistory+" my-tweets\n";
			getTweets();
			break;
		case "spotify-this-song":
			if(p!=null)
			{
				logHistory = logHistory+" spotify-this-song "+p+"\n";
				spotify(p);
			}
			else
			{
				logHistory = logHistory+" spotify-this-song\n";
				spotify("The Sign by Ace of Base");
			}
			break;
		case "movie-this":
			if(p!=null)
			{
				logHistory = logHistory+" movie-this "+p+"\n";
				getMovie(p);
			}
			else
			{
				logHistory = logHistory+" movie-this\n";
				getMovie("Mr Nobody");
			}
			break;
		case "do-what-it-says":
			var fs = require("fs");
			logHistory = logHistory+" do-what-it-says\n";

			fs.readFile("random.txt", "utf8", function(error, data){
				if(error)
				{
					logHistory = logHistory+"Error: "+error+"\n";
					return console.log(error);
				}
				else
				{
					var dataArr = data.split(',');
					if(dataArr[0] !== "do-what-it-says")
					{
						var msgExec = "Executing...\n";
						logHistory = logHistory+msgExec;
						console.log(msgExec);
						executeMyAction(dataArr[0],dataArr[1]);
					}
					else
					{	
						var msgErr ="you can't use do-what-it-says to call do-what-it-says";
						logHistory = logHistory+"Error: "+msgErr+"\n";
						console.log(msgErr);
					}
				}
			});
			break;
		default:
			logHistory = logHistory+c+" is not a valid command.\n";
			console.log("Command not valid");
	}
}

function getTweets()
{
	var keys = require('./keys.js');
	
	var twit = require("twitter");
	var twitter = new twit(keys["twitterKeys"]);

	var params = {
		user_id: "887731352",//keys["userId"],
		q: 20
	};

	twitter.get('statuses/user_timeline', params, gotData);
}
	
function gotData(error, data, response)
{
	if (!error && response.statusCode == 200)
	{
		data.forEach(function(t){
			logHistory = logHistory+t["text"]+"\n"+"Created at: "+t["created_at"]+"\n";
			console.log(t["text"]);
			console.log("Created at: "+t["created_at"]);
		});

		fs.appendFile("log.txt", logHistory, function callback(err) {
			if(err)
			{
				return console.log(err);
			}

			console.log("Appended Successfully");
		});
	}
	else
	{
		console.log(error);
	}
};

function spotify(m)
{
	var spotify = require('spotify');
 
	spotify.search({ type: 'track', query: m }, function(err, data) {
		if( err )
		{
			console.log('Error occurred: ' + err);
			logHistory = logHistory + 'Error occurred: ' + err + "\n";
		}
		else
		{
			if(data.tracks.items.length>0)
			{
				var track = data.tracks.items[0]
				var res = "Artist(s): "+track.artists[0]["name"]+"\n"+"The song's name: "+track.name+"\n"+"A preview link of the song from Spotify: "+track.preview_url+"\n"+"The album that the song is from: "+track.album.name+"\n";
				logHistory = logHistory + res + "\n";
				console.log(res);
			}
			else
			{
				var msg = "There is no data for the requested track";
				logHistory = logHistory + msg + "\n";
				console.log(msg);
			}
		}

		fs.appendFile("log.txt", logHistory, function callback(er) {
			if(er)
			{
				return console.log(er);
			}

			console.log("Appended Successfully");
		});
	});
}

function getMovie(m)
{
	var movieQ = "https://www.omdbapi.com/?t="+m+"&y=&plot=short&tomatoes=true&p&r=json";
	movieQ = movieQ.replace(/\s/g, "+");
	var request = require('request');

	request(movieQ, function (error, response, data) {
		if (!error && response.statusCode == 200)
		{
			var d = JSON.parse(data);
			var result = "Title of the movie: "+d.Title+"\n"+
				"Year the movie came out: "+d.Year+"\n"+
				"IMDB Rating of the movie: "+d.imdbRating+"\n"+
				"Country where the movie was produced: "+d.Country+"\n"+
				"Language of the movie: "+d.Language+"\n"+
				"Plot of the movie: "+d.Plot+"\n"+
				"Actors in the movie: "+d.Actors+"\n"+
				"Rotten Tomatoes Rating: "+d.tomatoRating+"\n"+
				"Rotten Tomatoes URL: "+d.tomatoURL+"\n";
			logHistory = logHistory + result;
			console.log(result);
		}
		else
		{
			logHistory = logHistory+"Error:"+error+"\n";
			console.log(error);
		}

		fs.appendFile("log.txt", logHistory, function callback(err) {
			if(err)
			{
				return console.log(err);
			}

			console.log("Appended Successfully");
		});
	});
}

executeMyAction(cmd,parameter);