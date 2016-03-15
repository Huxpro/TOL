let React = require('react');
let Router = require('react-router');
let RouteHandler = Router.RouteHandler;

let Main = require('../main');


let Videos = React.createClass({
  render(){
    return(
      <div>
        <RouteHandler />
      </div>
    )
  }
})

module.exports = Videos;
