let React = require('react');
let Router = require('react-router');
let RouteHandler = Router.RouteHandler;
let Link = Router.Link;


import DumbTower from './DumbTower.jsx';
import WorkTower from './WorkTower.jsx';

import isEqual from 'lodash.isequal';

// Entry of TOL.
let Main = React.createClass({

  getInitialState(){
    return {
      loading: true,
      user: null,
      dumbTower: [
        ["R"],
        ["G"],
        ["B"]
      ],
      workTower: [
        ["R", "G"],
        ["B"],
        [],
        []
      ],
      isGoalState: false
    }
  },

  componentDidMount(){
    // for some global call need.
    window.__tol__ = this;
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.checkGoal()) console.log("Goal State!")
  },

  checkGoal(){
    let work = this.state.workTower,
        goal = this.state.dumbTower;

    //console.log(work.slice(0,3));
    return isEqual(goal, work.slice(0,3))
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


        <WorkTower model={this.state.workTower} />
        <DumbTower model={this.state.dumbTower} />
      </div>
    );
  }
});


module.exports = Main;
