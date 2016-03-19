let React = require('react');
let Router = require('react-router');
let update = require('react-addons-update');
let RouteHandler = Router.RouteHandler;
let Link = Router.Link;


import DumbTower from './DumbTower.jsx';
import WorkTower from './WorkTower.jsx';
import Modal from './Modal.jsx';

import isEqual from 'lodash.isequal';
import {A, M} from '../stagesModel';


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
      },
      moves: [],
      violation: 0,
      timeViolation: 0,
      initTime: 0,
      exeTime: 0,
      recordInit: false,
      recordExe: false
    }
  },

  componentDidMount(){
    // for some global call need.
    window.__tol__ = this;
    this.updateStage(this.props.params);
    this.showInstruction(this.props.params);

    // half speed to 16ms (60fps)
    this.interval = setInterval(this.tick, 32);

    // Detect Key t(84)
    var $score = document.querySelector('.score-board')
    window.score = $score;
    document.addEventListener('keydown', (e)=>{
      if(e.keyCode == 84){
        if($score.classList.contains('cached')){
          $score.classList.remove('cached')
        }else{
          $score.classList.add('cached')
        }
      }
    })
  },

  componentWillUnmount(){
    clearInterval(this.interval);
  },

  componentWillReceiveProps(nextProps) {
    this.updateStage(nextProps.params);
    this.showInstruction(nextProps.params);
  },

  componentDidUpdate(prevProps, prevState) {
    if (this.checkGoal()) {
      /**
       * get url params
       * if url CHANGE to instruction, early return.
       */
      let currentStage = this.props.params.stage;
      if(!currentStage) return;

      // goal arrived, stop record exeTime.
      __tol__.setState({
        recordExe: false
      })

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
    if(nextState.modalType == "instructionend") return true;
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

  tick(){
    if(this.state.recordInit){
      this.setState({
        initTime: (Number(this.state.initTime) + 0.032).toFixed(2)
      });
    }
    if(this.state.recordExe){
      this.setState({
        exeTime: (Number(this.state.exeTime) + 0.032).toFixed(2)
      });
    }

  },

  checkGoal(){
    let work = this.state.workTower,
        goal = this.state.dumbTower;

    //console.log(work.slice(0,3));
    return isEqual(goal, work.slice(0,3))
  },

  showInstruction(params){
    //console.log(params);
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
    let stage = params.stage
    if(!stage) return;

    let stageModel = A[stage]

    console.log("update stage to " + stage);

    // start recording initial time.
    this.setState({
      recordInit: true
    })

    // reset all data when stage1 init.
    if(stage == 1){
      this.setState({
        violation: 0,
        initTime: 0,
        exeTime: 0
      })
    }

    this.setState({
      workTower: [
        ["G", "R"],
        ["B"],
        [],
        []
      ],
      dumbTower: stageModel,
      modalType: null,
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
        <div className="score-board cached">
          <h1>Total Move: {JSON.stringify(this.state.moves)}</h1>
          <h1>Total Violation: {this.state.violation}</h1>
          <h1>Total Initial Time: {this.state.initTime}</h1>
          <h1>Total Excutive Time: {this.state.exeTime}</h1>
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
