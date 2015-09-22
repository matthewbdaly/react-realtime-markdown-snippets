var React = require('react');
var marked = require('marked');

var Editor = React.createClass({
  getInitialState: function () {
    return {value: 'Enter your markdown here'};
  },
  handleChange: function () {
    this.setState({value: React.findDOMNode(this.refs.textarea).value});
  },
  render: function () {
    return (
      <div className="Editor">
        <h3>Input</h3>
        <textarea
          onChange={this.handleChange}
          ref="textarea"
          defaultValue={this.state.value} />
        <h3>Output</h3>
        <div
          className="content"
          dangerouslySetInnerHTML={{
            __html: marked(this.state.value, {sanitize: true})
          }}
        />
      </div>
    );
  }
});

module.exports = Editor;
