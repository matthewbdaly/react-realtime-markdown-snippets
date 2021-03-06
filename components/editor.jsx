var React = require('react');
var marked = require('marked');
var hljs = require('highlight.js');
var $ = require('jquery');

// Get languages
var langs = hljs.listLanguages();

// Create custom renderer
var renderer = new marked.Renderer();
renderer.code = function (code, lang, escaped) {
  if (this.options.highlight) {
    var out = this.options.highlight(code, lang);
    if (out != null && out !== code) {
      escaped = true;
      code = out;
    }
  }

  // Break into lines
  var codeoutput = '';
  var singleline;
  if (code.indexOf('\n') > -1) {
    singleline = false;
    var lines = code.split('\n');
    var linecount = lines.length;
    for (var i = 1; i <= linecount; i++) {
      codeoutput += ('<tr><td class="linenos" data-pseudo-content="' + i + '"></td><td>' + lines[i - 1] + '</td>');
    }
  } else {
    singleline = true;
    codeoutput = code;
  }

  // Trim trailing whitespace
  codeoutput = codeoutput.trimRight();

  if (!lang) {
    return '<pre><code' + (singleline ? ' class="singleline"' : '') + '>' +
      codeoutput + 
      '</code></pre>';
  }

  return '<pre><code class="hljs lang-' + 
    lang +
    (singleline ? ' singleline' : '') +
    '"><table>' +
    codeoutput +
    '</table></code></pre>\n';
};

// Set options
var mdoptions = {
  gfm: true,
  tables: true,
  smartLists: true,
  smartypants: true,
  langPrefix: 'hljs lang-',
  renderer: renderer,
  highlight: function (code, lang) {
    if (typeof lang !== "undefined" && langs.indexOf(lang) > 0) {
      return hljs.highlight(lang, code).value;
    } else {
      return hljs.highlightAuto(code).value;
    }
  }
};
marked.setOptions(mdoptions);

var Editor = React.createClass({
  getInitialState: function () {
    return {value: this.props.value || ''};
  },
  handleChange: function () {
    this.setState({value: React.findDOMNode(this.refs.textarea).value});
  },
  handleSubmit: function (e) {
    e.preventDefault();
    var text = React.findDOMNode(this.refs.textarea).value.trim();
    if (!text) {
      return;
    }
    $.ajax({
      url: '/',
      dataType: 'json',
      type: 'POST',
      data: {text: text},
      success: function (data) {
        history.pushState(null, null, data.id);
      }
    });
  },
  render: function () {
    return (
      <form onSubmit={this.handleSubmit}>
        <div className="Editor form-group">
          <h3>Input</h3>
          <textarea
            onChange={this.handleChange}
            className="form-control"
            ref="textarea"
            placeholder="Enter your markdown here"
            defaultValue={this.state.value} />
          <h3>Output</h3>
          <button className="btn btn-primary">Submit</button>
          <div
            className="content"
            dangerouslySetInnerHTML={{
              __html: marked(this.state.value, {sanitize: true})
            }}
          />
        </div>
      </form>
    );
  }
});

module.exports = Editor;
