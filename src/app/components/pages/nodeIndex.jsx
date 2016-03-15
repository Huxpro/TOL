let React = require('react');
let { NodesModel } = require('../../dataModel')
let { Link } = require('react-router');

let {
  Paper,
  RaisedButton,
  FlatButton,
  TextField,
  Card,
  Avatar,
  CardTitle,
  CardHeader,
  CardMedia,
  CardText,
  CardActions,
  List,
  ListItem,
  ListDivider,
  Styles
} = require('material-ui');

let { Colors, Spacing, Typography } = Styles;
let wsCSS = require('../../styles/wscss')

let styles = {
  cardContainer: {
    display: 'flex',
    alignItems: 'flex-start',
    WebkitAlignItems: 'flex-start',
    flexWrap:'wrap',
    maxWidth:'1200',
    margin:'0 auto'
  },
  card: Object.assign({
    verticalAlign: 'top',
    marginRight: 20,
    marginBottom: 20,
    display: 'block',
    flex:'1',
    WebkitFlex:'1',
    minWidth:300,
  }, wsCSS.lightShadow),
}


let NodeIndex = React.createClass({
  render() {
    if(!this.state.model){
      return (<div/>)
    }

    let _nodes = this.state.model.list.map((node, key)=>{
      return (
        <Card style={styles.card} key={'node' + node.node_id}>
          <Link to={"/nodes/" + node.node_id}>
            <CardMedia
              overlay = {<CardTitle title={node.node_name} subtitle={node.node_description} />}>
              <img src={node.node_image}/>
            </CardMedia>
          </Link>
        </Card>
      )
    })

    return (
      <div style={styles.cardContainer} >
        {_nodes}
      </div>
    );
  },

  getInitialState(){
    return {
      model: null
    }
  },

  componentDidMount(){
    this.fetchData();
  },

  fetchData(){
    NodesModel.get(
      {limit: 90},
      (res)=>{
        console.log("GET Nodes:" );
        console.log(res);

        this.setState({model: res})
      },(err)=>{
        console.log(err);
    });
  }
})

module.exports = NodeIndex;
