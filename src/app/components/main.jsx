let React = require('react');
let Router = require('react-router');
let RouteHandler = Router.RouteHandler;
let Link = Router.Link;


import DumbTower from './DumbTower.jsx';

// Entry of TOL.
let Main = React.createClass({

  getInitialState(){
    return {
      loading: true,
      user: null,
      dumbTowel: [
        ["R", "G"],
        ["B"],
        [null]
      ],
      workTowel: []
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
      <div className="canvas">
        <h1> Towel of London - Stage 1</h1>

        <div className="modal cached">
          <div>
            <p>
              接下来，你会看到两张图。
            </p>
            <p>
              用鼠标拖动左图三根柱子上的小球使小球由起始状变为右图的最终状态。
            </p>
            <p>
              <em>注意：</em>每次只能移动一个小球，且最高的柱子上可以放置三个小球，中间的柱子可以放置两个小球，最矮的柱子只能放置一个小球。
            </p>
            <button> Got it! </button>
          </div>
        </div>

        <div className="holder game">
          <div className="peg" >
            <div className="bead bead-r" />
            <div className="bead bead-g" />
            <div className="bead bead-b" />
          </div>
          <div className="peg" >
            <div className="bead bead-g" />
            <div className="bead bead-b" />
          </div>
          <div className="peg" >
            <div className="bead bead-b" />
          </div>
          <p className="intro"> Click to pick up and drop </p>
        </div>

        <DumbTower />
      </div>
    );
  }
});

// pass down router in context
Main.contextTypes = {
  router: React.PropTypes.func
};

module.exports = Main;
