var React = require('react');
var $ = jQuery = require('jquery');
var Editor = require('./editor.jsx');

var initialState = document.getElementById('initial-state').innerHTML;

React.render(
  <Editor value={initialState} />,
  document.getElementById('view')
);
