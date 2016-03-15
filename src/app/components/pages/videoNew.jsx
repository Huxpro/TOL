// 单个视频
let React = require('react');
let { FeedsModel, VideosModel, VideoModel, MediaModel } = require('../../dataModel')
let { Link } = require('react-router')

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
  Styles,
  Toggle,
  FontIcon,
  IconButton,
  FloatingActionButton
} = require('material-ui');

let { Colors, Spacing, Typography } = Styles;

let wsCSS = require('../../styles/wscss')

let styles = {
  cardContainer: {
    //display: 'flex',
    alignItems: 'flex-start',
    WebkitAlignItems: 'flex-start',
    maxWidth:'1200',
    margin:'0 auto'
  },
  card: Object.assign({
    verticalAlign: 'top',
    marginRight: 20,
    marginBottom: 20,
    display: 'block',
    position:'relative',
    flex:'1',
    WebkitFlex:'1',
  }, wsCSS.lightShadow),
  cardMedia: {
    position:'absolute',
    right: 0,
    top: 0,
    padding: 20,
    boxSizing:'border-box',
    width: '50%'
  },
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
    margin: 7,
    minWidth: 50,
    fontWeight: '300'
  },
  tagDelete: {
    transform: 'scale(0.6)' ,
    transformOrigin: 'top right',
    position: 'absolute',
    right: '-3',
    top: '-5',
    boxShadow:'none'
  },
  svgContainer: {
    boxSizing:'border-box',
    padding: '7'
  },
  insetText: {
    display:'block',
    marginLeft:16,
    fontSize: 16
  },
  icon:{
    display: 'inline-block',
    width: '1em',
    height: '1em',
    fill: 'currentColor'
  },
  toggle:{
    width: 200,
    margin:'15px 0'
  }
}


let Video = React.createClass({


  getInitialState(){
    return {
      model: {
        video_title: '新建视频',
        video_description: '',
        video_type: '2', // defalut 轻游记
        video_media: '',
        video_private: '0',
        video_location: {
          lat: '',
          lng: '',
          info: ''
        }
      },
      rawModel: {
        video_title: '新建视频'
      },
      mediaReady: false,
    }
  },
  componentDidMount(){
    //this.fetchData(this.props.params.id);
  },

  componentWillReceiveProps(nextProps) {
    let old = this.props.params.id;
    let next = nextProps.params.id;

    if(next && next !== old){
      this.fetchData(next);
    }
  },

  fetchData(id){
    // 0.13.0 API
    VideoModel.get(id,
      (res)=>{
        console.log("GET Video:" );
        console.log(res);

        this.setState({
          model: res,
          rawModel: res
        })

        // 2: 转码, 3: 成功
        if(res.video_media.media_status > 1){
          this.setState({
            mediaReady: true
          })
        }

      },(err)=>{
        console.log(err);
    });
  },

  _handleFileChange(e){
    let _file = e.target.files[0];
    let _data = new FormData();
    _data.append('img', _file)

    VideoModel.postImg(
      this.state.model.video_id,
      _data,
      (res)=>{
        this.fetchData(res.video_id)
        console.log("POST Video Img:" );
        console.log(res);
      },(err)=>{
        console.log(err);
    });

    // read as DataURL
    // let reader = new FileReader();
    // reader.onload = (upload) => {
    //     this.setState({
    //         img_uri: upload.target.result
    //     })
    // }
    // reader.readAsDataURL(file);
  },

  _handleImgClick(e){
    let $el = React.findDOMNode(this.refs.uploadImg);
    console.log($el)
    $el.click();
  },

  // handle form du-dirctional data-binding
  _handleNameChange(e){
    let _new = Object.assign(
      {},
      this.state.model,
      {video_title: e.target.value}
    )
    this.setState({
      model: _new
    })
  },

  _handleDesChange(e){
    let _new = Object.assign(
      {},
      this.state.model,
      {video_description: e.target.value}
    )
    this.setState({
      model: _new
    })
  },

  _handleSourceChange(e){
    let _new = Object.assign(
      {},
      this.state.model,
      {video_source: e.target.value}
    )
    this.setState({
      model: _new
    })
  },

  _locationInfoChange(e){
    let _newlocation = Object.assign({}, this.state.model.video_location, {info: e.target.value})
    let _new = Object.assign({}, this.state.model, {video_location: _newlocation})
    this.setState({
      model: _new
    })
  },

  _locationLngChange(e){
    let _newlocation = Object.assign({}, this.state.model.video_location, {lng: e.target.value})
    let _new = Object.assign({}, this.state.model, {video_location: _newlocation})
    this.setState({
      model: _new
    })
  },

  _locationLatChange(e){
    let _newlocation = Object.assign({}, this.state.model.video_location, {lat: e.target.value})
    let _new = Object.assign({}, this.state.model, {video_location: _newlocation})
    this.setState({
      model: _new
    })
  },

  _isModified(){
    let _now = this.state.model;
    let _raw = this.state.rawModel;
    if(
      _now.video_title == _raw.video_title &&
      _now.video_description == _raw.video_description
    ){
      return false;
    }
    return true;
  },

  _handleCreate(){
    if(!confirm("确定要新建吗？")) return;
    console.log(this.state.model);

    // fetch Media Token
    MediaModel.newMediaToken((res)=>{
      console.log("GET Media Token:");
      console.log(res);

      let _token = res.media_token;
      let _new = Object.assign({}, this.state.model, {video_media: _token});

      this.setState({
        model: _new
      })

      VideosModel.post(
        this.state.model,
        (res)=>{
          console.log("POST VIDEOS, create new video:" );
          console.log(res);
          // Jump to the new Video Detail
          location.hash="videos/"+ res.video_id
        },(err)=>{
          console.log(err);
      });
    },(err)=>{
      console.log(err);
    })
  },

  _handleFeedPush(){
    if(!confirm("Are you sure?")) return;

    FeedsModel.postVideo(
      {video_id: this.state.model.video_id},
      (res)=>{
        console.log("POST to FEED:" );
        console.log(res);
      },(err)=>{
        console.log(err);
    });
  },

  _handleVideoDelete(){
    if(!confirm("确定要删除吗？")) return;

    VideoModel.delete(
      this.state.model.video_id,
      (res)=>{
        console.log("DELETE Video:" );
        console.log(res);
        // Jump back to index
        this.context.router.transitionTo('videolist');
      },(err)=>{
        console.log(err);
        alert(err.message);
    });
  },

  _handleMediaUpload(){
    console.log('upload media');
  },

  _getVideoType(_type){
    let _map = {
      "1": "短视频",
      "2": "轻游记"
    }
    return _map[_type]
  },

  render() {
    let _video = this.state.model;
    let _raw = this.state.rawModel;
    if(!_video) return <div/>;

    // 视频暂无标签列表

    // // 视频列表（目前最多 5 条）
    // let _videos = _node.node_videos.map((video, key) => {
    //     return (
    //         // <Link
    //         //     to="video" params={{id: video.video_id}} >
    //             <Card style={styles.videoCard}>
    //                 <CardMedia >
    //                     <img src={video.video_media.media_image} />
    //                 </CardMedia>
    //                 <p style={styles.videoTitle}>
    //                     {video.video_title}
    //                 </p>
    //             </Card>
    //         //</Link>
    //     )
    // })

    let _video_module = ()=>{
      // 已经有视频
      if(this.state.mediaReady){
        return (
          <FlatButton
            style={styles.cardMedia}
          >
          <video
            controls="controls"
            style={{width:'100%'}}
            src={_video.video_media.media_sdurl} />
          </FlatButton>
        )
      }else{
        return (
          <div style={styles.cardMedia}>
            <p>上传新视频：</p>
            <p>新建后，系统会自动跳转到新建好的视频页，就可以添加视频了</p>
            {/*
              <input
                onChange={this._handleFileChange}
                type="file"
              />
            */}
          </div>
        )
      }
    }();

    // 渲染
    return (
      <div style={styles.cardContainer}>
        <Card style={styles.card}>
          {_video_module}
          <CardTitle
            style={{width:'50%'}}
            title={"视频 - " + _raw.video_title }
            subtitle={this._getVideoType(_video.video_type)}/>
          <TextField
            onChange = {this._handleNameChange}
            floatingLabelText="视频名称"
            style={styles.insetText}
            value={_video.video_title} />
          <TextField
            multiLine
            onChange = {this._handleDesChange}
            floatingLabelText="视频描述"
            style={styles.insetText}
            value={_video.video_description} />
          <List subheader="所属标签" >
            <div style={{padding:'0 12px'}} >
              <FlatButton style={styles.tag} secondary={true} label="暂不支持，请到节点页添加视频" />
            </div>
          </List>
          <List subheader="视频信息" >
            <div style={{margin:'0 20px'}}>
              <TextField
                onChange = {this._locationInfoChange}
                style={{ marginRight:'20px' }}
                floatingLabelText="地理位置"
                value={_video.video_location.info} />
              <TextField
                onChange = {this._locationLatChange}
                style={{ marginRight:'20px' }}
                floatingLabelText="纬度（北纬为正，南纬为负）"
                value={_video.video_location.lat} />
              <TextField
                onChange = {this._locationLngChange}
                style={{ marginRight:'20px' }}
                floatingLabelText="经度（东经为正，西经为负）"
                value={_video.video_location.lng} />
              <TextField
                style={{ marginRight:'20px' }}
                onChange = {this._handleSourceChange}
                floatingLabelText="视频来源（PGC only）"
                value={_video.video_source}  />
              <TextField
                style={{ marginRight:'20px' }}
                floatingLabelText="上传者"
                disabled={true}
                value='wesafari' />
            </div>
          </List>
          <ListDivider />
          <CardActions style={{marginTop:0, textAlign:'left'}}>
            <FlatButton
              label="新建"
              onClick = {this._handleCreate} />
            <FlatButton
              onClick = {this._handleVideoDelete}
              primary={true}
              label="删除" />
          </CardActions>
        </Card>
      </div>
    );
  }
})

// pass down router in context
Video.contextTypes = {
 router: React.PropTypes.func
};

module.exports = Video;
