let React = require('react');
import { FeedsModel, NodesModel, VideosModel } from '../../dataModel';
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

// enums of search type
const SEARCH_TYPE = {
  ALL: 0,
  TAG: 1,
  VIDEO: 2
}

let Search = React.createClass({
  render() {
    if(
      !this.state.nodesModel &&
      !this.state.videosModel
    ){
      return (
        <div>Loading...</div>
      )
    }

    let _type    = this.props.params.type
    let _nodes   = []
    let _videos  = []


    /**
     * Note: when type encounters ALL, things gonna a little tricky:
     *   	   the both requests, one for Nodes and one for Videos, are racing.
     *   	   But each of them will trigger a state change, where the other one
     *   	   is still pending.
     *   	   So we have to ensure the data in the state exist, otherwise, a
     *   	   Uncaught TypeError will be throwed.
     */

    if(
      _type == SEARCH_TYPE.TAG ||
      _type == SEARCH_TYPE.ALL
    ){
      if(this.state.nodesModel){
        this.state.nodesModel.list.forEach((node, key)=>{
          _nodes.push(
            <Card
              style={styles.card}
              key={'node' + node.node_id}>
              <Link to={"/nodes/" + node.node_id}>
                <CardMedia overlay = {
                  <CardTitle
                    title={node.node_name} subtitle={node.node_description} />
                }>
                  <img src={node.node_image}/>
                </CardMedia>
              </Link>
            </Card>
          )
        })
      }
    }

    if (
      _type == SEARCH_TYPE.VIDEO ||
      _type == SEARCH_TYPE.ALL
    ){
      if(this.state.videosModel){
        this.state.videosModel.list.forEach((video, key)=>{
          _videos.push(
            <Card
              style={styles.card}
              key={'video' + video.video_id}>
              <Link to={"/videos/" + video.video_id}>
                <CardMedia overlay = {
                  <CardTitle
                    title={video.video_title}
                    subtitle={video.video_description} />
                }>
                  <img src={video.video_media.media_image}/>
                </CardMedia>
              </Link>
            </Card>
          )
        })
      }
    }

    let _displayNodes = (_nodes.length == 0) ? null : (
      <div>
        <p style={styles.containerTitle}>
          搜索“{this.props.params.keyword}”节点
        </p>
        <div style={styles.cardContainer} >
          {_nodes}
        </div>
      </div>
    )

    let _displayVideos = (_videos.length == 0) ? null : (
      <div>
        <p style={styles.containerTitle}>
          搜索“{this.props.params.keyword}”视频
        </p>
        <div style={styles.cardContainer} >
          {_videos}
        </div>
      </div>
    )

    return (
      <div>
        {_displayNodes}
        {_displayVideos}
      </div>
    );
  },

  getInitialState(){
    return {
      nodesModel: null,
      videosModel: null
    }
  },

  componentDidMount(){
    console.log(this.props.params);
    this.fetchData(
      this.props.params.type,
      this.props.params.keyword
    );
  },

  componentWillReceiveProps(nextProps) {
    // if keyword of type update
    if(
      nextProps.params.keyword == this.props.params.keyword
      && nextProps.params.type == this.props.params.type
    ) return;

    this.fetchData(
      nextProps.params.type,
      nextProps.params.keyword
    )
  },

  fetchData(_type, _keyword){
    if (
      _type == SEARCH_TYPE.TAG ||
      _type == SEARCH_TYPE.ALL
    ){
      NodesModel.get(
        {
          keyword:_keyword,
          limit: 90
        },
        (res)=>{
          console.log("GET Searched Nodes:" );
          console.log(res);

          this.setState({nodesModel: res})
        },(err)=>{
          console.log(err);
      });
    }

    if (
      _type == SEARCH_TYPE.VIDEO ||
      _type == SEARCH_TYPE.ALL
    ){
      VideosModel.get(
        {
          keyword:_keyword,
          limit: 90
        },
        (res)=>{
          console.log("GET Searched Videos:" );
          console.log(res);

          this.setState({videosModel: res})
        },(err)=>{
          console.log(err);
      });
    }
  }
})

module.exports = Search;
