let React = require('react');
let Router = require('react-router');
let update = require('react-addons-update');
let RouteHandler = Router.RouteHandler;
let Link = Router.Link;


import DumbTower from './DumbTower.jsx';
import WorkTower from './WorkTower.jsx';
import Modal from './Modal.jsx';

import isEqual from 'lodash.isequal';
import {A, B} from '../stagesModel';


// But, without immutable data structure...
let WORKTOWER_INIT = [
  ["G", "R"],
  ["B"],
  [],
  []
];


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
        ["G", "R"],
        ["B"],
        [],
        []
      ],
      isGoalState: false,
      modalType: null,
      user: null
    }
  },

  componentDidMount(){
    // for some global call need.
    window.__tol__ = this;
    this.updateStage(this.props.params);
    this.showInstruction(this.props.params);
  },

  componentWillReceiveProps(nextProps) {
    this.updateStage(nextProps.params);
    this.showInstruction(nextProps.params);
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.checkGoal()) {
      console.log("Goal State!");
      this.setState({
        modalType: "stageCompleted"
      })
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    if(nextState.modalType &&
       this.state.modalType == "stageCompleted") {
         console.log("preventComponentUpdating");
         return false;
    }
    return true;
  },

  checkGoal(){
    let work = this.state.workTower,
        goal = this.state.dumbTower;

    //console.log(work.slice(0,3));
    return isEqual(goal, work.slice(0,3))
  },

  showInstruction(params){
    console.log(params);
    let newModalType = null;
    if (params.step) {
      newModalType = "instruction" + params.step
    }
    console.log(newModalType);
    this.setState({
      modalType: newModalType
    })
  },

  updateStage(params){
    let stageModel = [];
    let stage = params.stage;

    if(params.group == "A") stageModel = A[stage]
    if(params.group == "B") stageModel = B[stage]

    this.setState({
      workTower: [
        ["G", "R"],
        ["B"],
        [],
        []
      ],
      dumbTower: stageModel,
      modalType: null
    })
  },

  render() {
    let _loading = this.state.loading ? (
      <p>Loading</p>) : null;

    return (
      <div className="canvas">
        <h1>
          Towel of London -
          Group {this.props.params.group} -
          Stage {Number(this.props.params.stage) + 1}
        </h1>

        <h2>
          Student - {this.state.user} 
        </h2>

        <Modal type={this.state.modalType} {...this.props} />
        <WorkTower model={this.state.workTower} />
        <DumbTower model={this.state.dumbTower} />
      </div>
    );
  }
});


module.exports = Main;
