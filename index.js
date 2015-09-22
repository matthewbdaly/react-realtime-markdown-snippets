/*jslint node: true */
'use strict';

require('babel/register');

// Declare variables used
var app,
  base_url,
  bodyParser,
  express,
  hbs,
  morgan,
  port,
  React,
  Editor;

// Define values
express = require('express');
app = express();
port = process.env.PORT || 5000;
base_url = process.env.BASE_URL || 'http://localhost:5000';
bodyParser = require('body-parser');
hbs = require('hbs');
morgan = require('morgan');
React = require('react');
Editor = React.createFactory(require('./components/editor.jsx'));

// Set up templating
app.set('views', __dirname + '/views');
app.set('view engine', "hbs");
app.engine('hbs', require('hbs').__express);

// Set up logging
app.use(morgan('combined'));

// Set URL
app.set('base_url', base_url);

// Handle POST data
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
      extended: true
}));

// Serve static files
app.use(express.static(__dirname + '/static'));

// Define index route
app.get('/', function (req, res) {
  res.render('index');
});

// Listen
app.listen(port);
console.log("Listening on port " + port);
