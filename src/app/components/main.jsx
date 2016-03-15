let React = require('react');
let Router = require('react-router');
let RouteHandler = Router.RouteHandler;
let Link = Router.Link;


// Entry of TOL.
let Main = React.createClass({

  getInitialState(){
    return {
      loading: true,
      user: null
    }
  },

  componentDidMount(){
    // for some global call need.
    window.__tol__ = this;
  },

  render() {
    let _loading = this.state.loading ? (
      <p>Loading</p>) : null;

    return (
      <div>
        <h1>Towel of London</h1>
        <a>Test a </a>
      </div>
    );
  }
});

// pass down router in context
Main.contextTypes = {
  router: React.PropTypes.func
};

module.exports = Main;
