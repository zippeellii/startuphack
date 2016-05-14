//Initial file
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var morgan = require('morgan');
var http = require('http');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/startuphack');

// configure our app to handle CORS requests
app.use(function(req, res, next) {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, PUT');
	res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type, Authorization');
	next();
});

app.use(morgan('dev'));

app.get('/', function(req, res){
  console.log('Got request');
  res.send('Hello Wordl!');
})

var searchRoute = require('./routes/searchRoutes')(app, express);
app.use('/', searchRoute);


//Start the listening
http.createServer(app).listen(8080, function(){
  console.log('Express server listening on port 8080');
});
