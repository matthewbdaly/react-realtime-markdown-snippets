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
  shortid,
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
shortid = require('shortid');

// Set up connection to Redis
var client;
if (process.env.REDIS_URL) {
  client = require('redis').createClient(process.env.REDIS_URL);
} else {
  client = require('redis').createClient();
}

// Set up templating
app.set('views', __dirname + '/views');
app.set('view engine', "hbs");
app.engine('hbs', require('hbs').__express);

// Register partials
hbs.registerPartials(__dirname + '/views/partials');

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
  var markup = React.renderToString(Editor());
  res.render('index', {
    markup: markup,
    state: "Just testing"
  });
});

// Define submit route
app.post('/', function (req, res) {
  // Declare variables
  var text, id;

  // Get text
  text = req.body.text;

  // Create a hash
  id = shortid.generate();

  // Store them in Redis
  client.set(id, text, function () {
    // Send response
    res.json('', {id: id});
  });
});

// Define item route
app.route('/:id').all(function (req, res) {
  // Get ID
  var id = req.params.id.trim();

  // Look up the item
  client.get(id, function (err, reply) {
    if (!err && reply) {
      // Render page
      var markup = React.renderToString(Editor({ text: reply }));
      res.render('index', {
        markup: markup,
        state: reply
      });
    } else {
      // Confirm no such link in database
      res.status(404);
      res.render('error');
    }
  });
});

// Listen
app.listen(port);
console.log("Listening on port " + port);
