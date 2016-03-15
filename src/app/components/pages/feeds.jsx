let React = require('react');
let {FeedsModel} = require('../../dataModel')
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
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    WebkitAlignItems: 'flex-start',
    flexWrap:'wrap',
    maxWidth:'1200',
    margin:'0 auto'
  },
  containerTitle:{
    maxWidth:'1200',
    marginLeft:'auto',
    marginRight:'auto',
    fontSize: 13,
    color:'#838283'
  },
  card: Object.assign({
    verticalAlign: 'top',
    display: 'block',
    marginBottom:20,
    flex:'0 0 32%'
  }, wsCSS.lightShadow),
  videoCard: {
    display: 'inline-block',
    boxSizing: 'border-box',
    width: '20%',
    paddingRight: 10,
    boxShadow: 'none',
    marginBottom: 10,
    cursor: 'pointer'
  },
  videoTitle: {
    marginTop: 4,
    fontSize: 13,
    color: '#757575',
    height: 40
  },
  textCenter: {
    textAlign: "center"
  },
  tag:{
    border: '1px solid',
    borderRadius: '4px',
    lineHeight: '28px',
    margin: 5,
    minWidth: 50,
    fontWeight: '300'
  }
}


let Feeds = React.createClass({
  render() {
    if(!this.state.model){
      return (
        <div>Loading...</div>
      )
    }

    let _nodes = [];
    this.state.model.nodes.forEach((node, key)=>{
      _nodes.push(
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

    let _videos = [];
    this.state.model.videos.forEach((video, key)=>{
      _videos.push(
        <Card style={styles.card} key={'video' + video.video_id}>
          <Link to={"/videos/" + video.video_id}>
            <CardMedia
              overlay = {<CardTitle title={video.video_title} subtitle={video.video_description} />}>
              <img src={video.video_media.media_image}/>
            </CardMedia>
          </Link>
        </Card>
      )
    })

    return (
      <div>
        <p style={styles.containerTitle}> 节点 </p>
        <div style={styles.cardContainer} >
          {_nodes}
        </div>
        <p style={styles.containerTitle}> 视频 </p>
        <div style={styles.cardContainer} >
          {_videos}
        </div>
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
    FeedsModel.get((res)=>{
      console.log("GET Feeds:" );
      console.log(res);

      if(this.isMounted()){
        this.setState({model: res})
      }
    },(err)=>{
      console.log(err);
    });
  }

})

module.exports = Feeds;
