// CONSTANTS
var PORT_NUMBER = 1881;

// express for web app
var express = require('express');

// body parser to parse post data
var bodyParser = require('body-parser');

//Establish MySQL DB
var mysql = require('mysql');
var conn = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'password',
  database : 'youtube_data'
});

conn.connect();

var app = express();
app.use(bodyParser.json());

app.all('*', function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'accept, content-type, x-parse-application-id, x-parse-rest-api-key, x-parse-session-token');
     // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
});

app.get('/loadTags', function(request, response) {
	var sql = "SELECT DISTINCT tag FROM tag_to_video;"
	conn.query(sql, function(error, result) {
		console.log(result);
		response.json(result);
	});

});

app.get('/searchVideos', function(request, response) {
	var arg = request.body.query;
	var sql = "SELECT DISTINCT video_info.video_id, title FROM video_info JOIN tag_to_video " 
			+ "ON video_info.video_id = tag_to_video.video_id AND tag=?;"
	conn.query(sql, [arg], function(error, result) {
		response.json(result);
	});
});

app.listen(PORT_NUMBER);