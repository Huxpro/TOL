/**
 *  Dumb Tower
 *  Working Space of TOL
 */

var update = require('react-addons-update');

export default class WorkTower extends React.Component{
  constructor(props){
    super(props);
  }

  onPegClick(index){
    let respondPeg = this.props.model[index]
    let staging    = this.props.model[3];

    // staging area
    if(respondPeg == staging) return;

    // working area
    if(staging.length == 1){
      //console.log('Drop bead');
      this.dropBead(index, staging.slice(-1)[0])
    }else{
      //console.log('Stage bead')
      this.pickBead(index, respondPeg.slice(-1)[0]);
    }
  }

  isPegFull(i){
    let range = [3,2,1];
    return this.props.model[i].length >= range[i];
  }

  showPegWarning(i){
    let pegs = document.querySelectorAll(".work .peg");
    pegs[i].classList.add("warning");
    setTimeout(()=>{
      pegs[i].classList.remove("warning");
    },200)
    setTimeout(()=>{
      pegs[i].classList.add("warning");
    },400)
    setTimeout(()=>{
      pegs[i].classList.remove("warning");
    },600)

    // Count Violation
    __tol__.setState({
      violation: __tol__.state.violation + 1
    })
  }


  dropBead(updateIndex, movingBead){
    // check valid
    if(this.isPegFull(updateIndex)){
      this.showPegWarning(updateIndex);
      return;
    }

    // Count Actual Moves Only
    let _moves = __tol__.state.moves.slice(); // copy
    let _stage = __tol__.props.params.stage
    let _stageMoves = _moves[_stage];

    // init if undefined
    if(!_stageMoves) _moves[_stage] = 0;

    // i++
    _moves[_stage]++

    __tol__.setState({
      moves: _moves
    })

    // new state
    let newModel = this.props.model.map((peg, index)=>{
      if(index == 3) return [];
      if(index !== updateIndex) return peg;
      peg.push(movingBead)
      return peg;
    })

    __tol__.setState({
      workTower: newModel
    })
  }


  pickBead(updateIndex, movingBead){
    // stop record initialTime
    __tol__.setState({
      recordInit: false,
      recordExe: true
    })

    // check valid
    if(this.props.model[updateIndex].length == 0) {
      this.showPegWarning(updateIndex);
      return;
    };

    // new state
    let newModel = this.props.model.map((peg, index)=>{
      if(index == 3) return [movingBead];
      if(index !== updateIndex) return peg;
      peg.pop()
      return peg;
    })

    //console.log(newModel);
    __tol__.setState({
      workTower: newModel
    })
  }


  render(){
    let pegs = this.props.model.map((peg, i) => {
      return (
        <div
          className="peg"
          key={"peg" + i}
          onClick={this.onPegClick.bind(this, i)}
        >
          {peg.map((bead, i) => {
            if (!bead) return null;
            return (
              <div
                key={"wbead" + bead}
                className={"bead bead-" + bead} />
            )
          })}
        </div>
      )
    })

    return (
      <div className="holder work">
        {pegs}
        <p className="intro">Click to pick up and drop</p>
      </div>
    )
  }
}
