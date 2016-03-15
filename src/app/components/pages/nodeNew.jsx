// 单个节点
let React = require('react');
let { NodesModel, NodeModel } = require('../../dataModel')
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
  }
}


let Node = React.createClass({


  getInitialState(){
    return {
      model: {
        node_name: '新建节点',
        node_description: '',
        node_parent: '',
      },
      rawModel: {
        node_name: '新建节点'
      },
      mediaReady: false,
      media: null,
      preview_uri: '',
    }
  },
  componentDidMount(){
    //this.fetchData(this.props.params.id);
  },

  componentWillReceiveProps(nextProps) {
    let old = this.props.params.id;
    let next = nextProps.params.id;

    if(next && next !== old){
      //this.fetchData(next);
    }
  },

  fetchData(id){
    // 0.13.0 API
    NodeModel.get(id,
      (res)=>{
        console.log("GET Node:" );
        console.log(res);

        this.setState({
          model: res,
          rawModel: res
        })
      },(err)=>{
        console.log(err);
    });
  },
  _handleFileChange(e){
    let _file = e.target.files[0];

    this.state.media = _file;

    // wait for Node Create.
    //let _data = new FormData();
    //_data.append('img', _file)

    // NodeModel.postImg(
    //     this.state.model.node_id,
    //     _data,
    //     (res)=>{
    //         this.fetchData(res.node_id)
    //         console.log("POST Node Img:" );
    //         console.log(res);
    //     },(err)=>{
    //         console.log(err);
    // });

    //read as DataURL
    let reader = new FileReader();
    reader.readAsDataURL(_file);
    reader.onload = (e) => {
      console.log(e);
      this.setState({
        preview_uri: e.target.result
      })
    }

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
      {node_name: e.target.value}
    )
    this.setState({
      model: _new
    })
  },

  _handleDesChange(e){
    let _new = Object.assign(
      {},
      this.state.model,
      {node_description: e.target.value}
    )
    this.setState({
      model: _new
    })
  },

  _isModified(){
    let _now = this.state.model;
    let _raw = this.state.rawModel;
    if(
      _now.node_name == _raw.node_name &&
      _now.node_description == _raw.node_description
    ){
      return false;
    }
    return true;
  },

  _handleCreate(){
    if(!confirm("确定要新建吗？")) return;

    let _new = {
      node_name: this.state.model.node_name,
      node_description: this.state.model.node_description,
      node_parent: (this.state.model.node_parent) && "0"
    }

    NodesModel.post(
      _new,
      (res)=>{
        console.log("POST Nodes/ Create new node:" );
        console.log(res);
        //this.fetchData(res.node_id)
        // jump to created Node Detail
        location.hash = "nodes/" + res.node_id;
      },(err)=>{
        console.log(err);
    });
  },

  _handleNodeDelete(){
    if(!confirm("确定要删除吗？")) return;

    NodeModel.delete(
      this.state.model.node_id,
      (res)=>{
        console.log("DELETE Node:" );
        console.log(res);
        // Jump to the new Node Detail
        location.hash="nodes/"+ res.node_id
      },(err)=>{
        alert(err.message);
    });
  },

  render() {
    let _node = this.state.model;
    let _raw = this.state.rawModel;
    console.log(_node);
    if(!_node) return <div/>;

    // 父标签
    let _parent = (_node.node_parent)?(
      <div style={{display:'inline-block', position:'relative'}}>
        <Link
          key={_node.node_parent.node_id}
          to="node" params={{id: _node.node_parent.node_id}} >
          <FlatButton
            style={styles.tag}
            secondary={true}
            label={_node.node_parent.node_name} />
        </Link>
        <FloatingActionButton mini={true} style={styles.tagDelete} iconStyle={styles.svgContainer}>
          <svg viewBox="0 0 24 24"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>
        </FloatingActionButton>
      </div>
    ):(
      <FlatButton style={styles.tag} primary={true} label="设置"/>
    )

    // 视频列表（目前最多 5 条）
    let _videos = (_node.node_videos) && _node.node_videos.map((video, key) => {
      return (
        <Link
          to="video" params={{id: video.video_id}} >
          <Card style={styles.videoCard}>
            <CardMedia >
              <img style={{width:'100%'}} src={video.video_media.media_image} />
            </CardMedia>
            <p style={styles.videoTitle}>
              {video.video_title}
            </p>
          </Card>
        </Link>
      )
    })

    // 图片上传
    let _image_module = ()=>{
      console.log(this.state.preview_uri);
      // 已经有图片
      if(this.state.mediaReady){
        return (
          <FlatButton
            onClick={this._handleImgClick}
            style={styles.cardMedia}>
            <input
              onChange={this._handleFileChange}
              ref="uploadImg"
              type="file"
              hidden />
            <img style={{width:'100%'}} src={_node.node_image} />
          </FlatButton>
        )
      }else{
        return (
          <div style={styles.cardMedia}>
            <p>上传新图片：</p>
            <p>新建后，系统会自动跳转到新建好的节点页，就可以更换图片了</p>
            {/*
              <input
                onChange={this._handleFileChange}
                type="file" />
              { (this.state.preview_uri) && <img src={this.state.preview_uri} /> }
            */}
          </div>
        )
      }
    }();

    // 渲染
    return (
      <div style={styles.cardContainer}>
        <Card style={styles.card}>
          {_image_module}
          <CardTitle
            style={{width:'50%'}}
            title={"节点 - " + _raw.node_name } />
          <TextField
            onChange = {this._handleNameChange}
            floatingLabelText="节点名称"
            style={styles.insetText}
            value={_node.node_name} />
          <TextField
            multiLine
            onChange = {this._handleDesChange}
            floatingLabelText="节点描述"
            style={styles.insetText}
            value={_node.node_description} />
          <List subheader="父标签" >
            <div style={{padding:'0 12px'}} >
              {_parent}
            </div>
          </List>
          <ListDivider />
          <CardActions style={{marginTop:0, textAlign:'left'}}>
            <FlatButton
              label="新建"
              onClick = {this._handleCreate}
              disabled = {!this._isModified()} />
            <FlatButton
              onClick = {this._handleNodeDelete}
              primary={true}
              label="删除" />
          </CardActions>
        </Card>
        {/*
        <Card style={styles.card} >
          <CardTitle subtitle="该标签下的视频"/>
          <TextField style={{marginLeft:'16'}} hintText="搜索该标签下的视频" />
          <RaisedButton style={{marginLeft:16}} primary={true} label="新增视频" />
          <List style={{paddingBottom:'0 !important'}} >
            <ListDivider />
            <div style={{paddingLeft:16,paddingRight: 6,paddingTop: 16}}>
              {_videos}
            </div>
            <ListDivider />
            <ListItem style={styles.textCenter}
              primaryText="查看更多" />
          </List>
        </Card>
        */}
      </div>
    );
  }
})

// pass down router in context
Node.contextTypes = {
 router: React.PropTypes.func
};

module.exports = Node;
