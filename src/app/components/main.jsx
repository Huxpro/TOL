let React = require('react');
let Router = require('react-router');
let update = require('react-addons-update');
let RouteHandler = Router.RouteHandler;
let Link = Router.Link;


import DumbTower from './DumbTower.jsx';
import WorkTower from './WorkTower.jsx';
import Modal from './Modal.jsx';

import isEqual from 'lodash.isequal';
import {A} from '../stagesModel';


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
      user: {
        name: ""
      }
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
      let currentStage = this.props.params.stage;
      console.log(currentStage + " Goal State! ");

      if(Number(currentStage) == 0){
        this.setState({
          modalType: "testCompleted"
        })
        return;
      }
      if(Number(currentStage) == 10){
        this.setState({
          modalType: "halfCompleted"
        })
        return;
      }
      if(Number(currentStage) == 20){
        this.setState({
          modalType: "gameCompleted"
        })
      }else{
        this.setState({
          modalType: "stageCompleted"
        })
      }
    }
  },

  shouldComponentUpdate(nextProps, nextState) {
    if(nextState.modalType == "instruction1") return true;
    if(nextState.modalType && (
       this.state.modalType == "testCompleted" ||
       this.state.modalType == "stageCompleted" ||
       this.state.modalType == "halfCompleted" ||
       this.state.modalType == "gameCompleted" )) {
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
    console.log("newModalType: " + newModalType);
    this.setState({
      modalType: newModalType
    })
  },

  updateStage(params){
    let stageModel = [];
    let stage = params.stage;

    if(params.group == "A") stageModel = A[stage]

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
    let _stage = Number(this.props.params.stage);

    return (
      <div className="canvas">
        <h1>
          Towel of London -
          Stage { (_stage == 0) ? "TEST" : _stage }
        </h1>
        <div className="score-board">
          <h1>Total Move: </h1>
          <h1>Total Correct: </h1>
          <h1>Total Initial Time:</h1>
          <h1>Total Excutive Time: </h1>
        </div>

        <h2>
          Student - {this.state.user.name}
        </h2>

        <Modal type={this.state.modalType} {...this.props} />
        <WorkTower model={this.state.workTower} />
        <DumbTower model={this.state.dumbTower} />
      </div>
    );
  }
});


module.exports = Main;
