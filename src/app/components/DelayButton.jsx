/**
 *  Delay Button
 */

export default class DelayButton extends React.Component{
  constructor(props){
    super(props)
  }

  state = {
    timeToShow: false
  }

  componentDidMount(){
    setTimeout(()=>{
      this.setState({
        timeToShow: true
      })
    }, this.props.delay)
  }
  render(){
    if(!this.state.timeToShow) return null;

    return (
      <button>{this.props.children}</button>
    )
  }
}
