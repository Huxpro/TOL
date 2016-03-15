// 单个视频
let React = require('react');
let {
  FeedsModel,
  VideoModel,
  NodeModel,
  NodesModel,
  MediaModel
} = require('../../dataModel')
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
  Dialog,
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
  },
  _cardContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    WebkitAlignItems: 'flex-start',
    flexWrap:'wrap',
    maxWidth:'1200',
    margin:'0 auto'
  },
  _card: Object.assign({
    verticalAlign: 'top',
    cursor:'pointer',
    display: 'block',
    marginBottom:20,
    flex:'0 0 32%'
  }, wsCSS.lightShadow)
}


let Video = React.createClass({


  getInitialState(){
    return {
      model: null,
      rawModel: null,
      searchNodeModel: null,
      mediaReady: 0,  // 未上传
    }
  },
  componentDidMount(){
    this.fetchData(this.props.params.id);
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

        // 0: 未上传,
        // 2: 转码中
        // 3: 成功
        this.setState({
          mediaReady: res.video_media.media_status
        })

      },(err)=>{
        console.log(err);
    });
  },

  // 处理视频上传
  _handleFileChange(e){
    // 获取文件
    let _file = e.target.files[0];

    // 已有 media_token, 请求 up_token
    // POST /media/:media_token
    MediaModel.getUpTokenByMediaToken(
      this.state.model.video_media.media_token,
      (res)=>{
        console.log("GET UP_TOKEN");
        console.log(res);
        let up_token = res.up_token;

        // Up_Token ready, POST 七牛
        let _data = new FormData();
        _data.append('file', _file)
        _data.append('token', up_token)

        MediaModel.uploadToQiniu(
          _data,
          (res) => {
            console.log("Upload Qiniu SUCCESS");
            console.log(res);

            alert('上传成功！')
            this.fetchData(this.state.model.video_id)
          },(err)=>{
            alert('上传失败！')
            console.log(err);
          }
        )

      },(err)=>{
        console.log(err);
      }
    )


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


  _isModified(){
    let _now = this.state.model;
    let _raw = this.state.rawModel;
    if(
      _now.video_title == _raw.video_title &&
      _now.video_description == _raw.video_description &&
      _now.video_source == _raw.video_source
    ){
      return false;
    }
    return true;
  },

  _handleSave(){
    if(!confirm("确定要保存吗？")) return;

    let _update = {
      video_title: this.state.model.video_title,
      video_description: this.state.model.video_description,
      video_source: this.state.model.video_source,
      video_parent: this.state.model.video_parent
    }

    VideoModel.post(
      this.state.model.video_id,
      _update,
      (res)=>{
        console.log("POST Video:" );
        console.log(res);
        this.fetchData(res.video_id)
      },(err)=>{
        console.log(err);
        alert(err.message);
    });
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

  // General Search Fn
  _handleNodeSearch(e){
    e.preventDefault();
    let _search = e.target[0].value;

    console.log("search "+_search+" .....");

    NodesModel.get(
      {
        keyword:_search,
        limit: 90
      },
      (res)=>{
        console.log("GET Searched Nodes:" );
        console.log(res);

        this.setState({searchNodeModel: res})
      },(err)=>{
        console.log(err);
    });
  },

  /**
   * Methods to handle children
   */
  _showChildDialog(){
    this.refs.addChildDialog.show();
  },

  _handleDialogCancel(){
    this.refs.addChildDialog.dismiss();
  },

  _handleNodeSet(nodeId){
    console.log(nodeId);
    if(!confirm('确定要在该节点中添加当前视频吗')) return;

    NodeModel.postVideo(
      nodeId,
      {video_id: this.state.model.video_id},
      (res)=>{
        alert('添加成功！')
        console.log("POST Video to Node:" );
        console.log(res);
        this.fetchData(res.video_id)
      },(err)=>{
        alert('添加失败……')
        console.log(err);
    });
  },

  _getChildDialog(){
    let _search_childNodes
    = (this.state.searchNodeModel) && this.state.searchNodeModel.list.map((node, key)=>{
      return (
        <Card
          onClick={this._handleNodeSet.bind(null, node.node_id)}
          style={styles._card}
          key={'searchNode' + node.node_id}>
          <CardMedia overlay = {
            <CardTitle
              title={node.node_name} subtitle={node.node_description} />
          }>
            <img src={node.node_image}/>
          </CardMedia>
        </Card>
      )
    })

    return (
      <Dialog
        ref="addChildDialog"
        title="节点列表（添加所属标签）"
        autoDetectWindowHeight={true}
        autoScrollBodyContent={true}
        actions={[
          <FlatButton
            label="Cancel"
            secondary={true}
            onTouchTap={this._handleDialogCancel} />
        ]}>
          <div>
            <form onSubmit={this._handleNodeSearch}>
              <TextField hintText="搜索节点（搜索结果将被保留）" />
            </form>
            <div style={styles._cardContainer} >
              {_search_childNodes}
            </div>
          </div>
      </Dialog>
    )
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
      if(this.state.mediaReady == 3){
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
      // 转码中
      }else if(this.state.mediaReady == 2){
        return (
          <div
            style={styles.cardMedia}
          >
            <img
              style={{width:'100%'}}
              src={_video.video_media.media_image} />
          </div>
        )
      }else{
        return (
          <div style={styles.cardMedia}>
            <p>上传新视频：</p>
            <input
              onChange={this._handleFileChange}
              type="file"
            />
          </div>
        )
      }
    }();

    // TODO: comment
    let _comments = _video.video_comments.list.map((comment) => {
      return (
        <div>
          <ListItem
            leftAvatar={<Avatar src={comment.comment_user.usericon} />}
            rightIconButton={
              <IconButton tooltip="删除">
                <FontIcon
                  color="#FF5722"
                  className="material-icons">delete
                </FontIcon>
              </IconButton>
            }
            primaryText={comment.comment_user.usernick}
            secondaryText={comment.comment_text}
            secondaryTextLines={2} />
          <ListDivider inset={true} />
        </div>
      )
    })

    // Tags (Nodes)
    let _nodes = _video.video_nodes.map((node) => {
      return (
        <Link to="node" params={{id: node.node_id}} >
          <FlatButton
            style={styles.tag}
            secondary={true}
            label={node.node_name} />
        </Link>
      )
    })


    // 渲染
    return (
      <div style={styles.cardContainer}>

        {this._getChildDialog()}

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
              <FlatButton
                onClick = {this._showChildDialog}
                style={styles.tag}
                primary={true}
                label="添加" />
              {_nodes}
            </div>
          </List>
          <List subheader="视频信息" >
            <div style={{margin:'0 20px'}}>
              <TextField
                style={{ marginRight:'20px' }}
                floatingLabelText="地理位置"
                disabled
                value={_video.video_location} />
              <TextField
                onChange = {this._locationLatChange}
                style={{ marginRight:'20px' }}
                floatingLabelText="纬度（北纬为正，南纬为负）"
                disabled
                value={(_video.video_locations.length !== 0) ? _video.video_locations[0].lat : '暂无'} />
              <TextField
                onChange = {this._locationLngChange}
                style={{ marginRight:'20px' }}
                floatingLabelText="经度（东经为正，西经为负）"
                disabled
                value={(_video.video_locations.length !== 0) ? _video.video_locations[0].lng : '暂无'} />
              <TextField
                onChange={this._handleSourceChange}
                style={{ marginRight:'20px' }}
                floatingLabelText="视频来源（PGC only）"
                disabled = {_video.video_type == 1}
                value={_video.video_source}  />
              <TextField
                style={{ marginRight:'20px' }}
                floatingLabelText="上传者"
                disabled={true}
                value={_video.video_user.usernick} />
              <Avatar
                style={{marginLeft: -65}}
                src={_video.video_user.usericon} />
              <Toggle
                style={styles.toggle}
                name="blocked"
                label="屏蔽"
                disabled
                defaultToggled={false}/>
            </div>
          </List>
          <ListDivider />
          <CardActions style={{marginTop:0, textAlign:'left'}}>
            <FlatButton
              label="保存"
              onClick = {this._handleSave}
              disabled = {!this._isModified()} />
            <FlatButton
              secondary={true}
              onClick = {this._handleFeedPush}
              label="推送上首页" />
            <FlatButton
              onClick = {this._handleVideoDelete}
              primary={true}
              label="删除" />
          </CardActions>
        </Card>

        <Card style={styles.card} >
          <CardTitle subtitle="用户评论"/>
          <TextField style={{marginLeft:'16'}} hintText="搜索该视频下的评论" />
          <List style={{paddingBottom:'0 !important'}} >
            {_comments}
            <ListDivider />
            <ListItem style={styles.textCenter}
              primaryText="查看更多"
              />
          </List>
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
