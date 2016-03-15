let React = require('react');
let { VideosModel } = require('../../dataModel')
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


let VideoIndex = React.createClass({
  render() {
    if(!this.state.model){
      return (<div/>)
    }

    let _videos = this.state.model.list.map((video, key)=>{
      return (
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
      <div style={styles.cardContainer} >
        {_videos}
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
    VideosModel.get(
      {limit: 90},
      (res)=>{
        console.log("GET Videos:" );
        console.log(res);

        this.setState({model: res})
      },(err)=>{
        console.log(err);
    });
  }
})

module.exports = VideoIndex;
