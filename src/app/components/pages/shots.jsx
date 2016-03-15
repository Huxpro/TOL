let React = require('react');

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
  Toggle
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
    flex:'1',
    WebkitFlex:'1',
  }, wsCSS.lightShadow),
  cardMedia: {
    float: 'right',
    boxSizing:'border-box',
    padding: 17,
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
    margin: 5,
    minWidth: 50,
    fontWeight: '300'
  },
  toggle:{
    width: 200,
    margin:'15px 0'
  }
}


class Shots extends React.Component {

  render() {

    return (
      <div style={styles.cardContainer}>
        <Card style={styles.card}>
          <CardMedia style={styles.cardMedia} >
            <img src="http://wsdev.m2v.cn/data/imgs/1.jpg"/>
          </CardMedia>
          <CardTitle
            style={{width:'50%'}}
            title="短镜头 - 婚礼" />
          <TextField
            floatingLabelText="视频名称"
            style={{display:'block', marginLeft:16, fontSize: 16}}
            defaultValue="婚礼" />
          <TextField
            multiLine
            floatingLabelText="视频描述"
            style={{display:'block', marginLeft:16, fontSize: 16}}
            defaultValue="这是一个美好的婚礼" />
          <List subheader="所属标签" >
            <div style={{padding:'0 12px'}} >
              <FlatButton style={styles.tag} secondary={true} label="爱情" />
            </div>
          </List>
          <List subheader="视频信息" >
            <div style={{
              margin:'0 20px',
            }}>
              <TextField
                style={{ marginRight:'20px' }}
                hintText="地理位置"
                floatingLabelText="地理位置"
                disabled={true}
                defaultValue="亚洲 - 中国 - 北京" />
              <TextField
                style={{ marginRight:'20px' }}
                floatingLabelText="上传者"
                disabled={true}
                defaultValue="编辑" />
              <TextField
                style={{ marginRight:'20px' }}
                floatingLabelText="视频来源"
                defaultValue="Vimeo" />
              <Toggle
                style={styles.toggle}
                name="featured"
                label="推荐到首页"
                defaultToggled={true}/>
              <Toggle
                style={styles.toggle}
                name="blocked"
                label="屏蔽"
                defaultToggled={false}/>
            </div>
          </List>
          <ListDivider />
          <CardActions style={{marginTop:0, textAlign:'left'}}>
            <FlatButton label="保存" />
            <FlatButton secondary={true} label="存在草稿" />
            <FlatButton primary={true} label="删除" />
          </CardActions>
        </Card>
        <Card style={styles.card} >
          <CardTitle subtitle="用户评论"/>
          <TextField style={{marginLeft:'16'}} hintText="搜索该视频下的评论" />
          <List style={{paddingBottom:'0 !important'}} >
            <ListItem
              leftAvatar={<Avatar src="img/example-128.jpg" />}
              rightIconButton={<FlatButton primary={true} label="删除" />}
              primaryText="Brendan Lim"
              secondaryText={
               <p>
                <span style={{color: Colors.darkBlack}}>Brunch this weekend?</span><br/>
                I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
               </p>
              }
              secondaryTextLines={2} />
            <ListDivider inset={true} />
            <ListItem
              leftAvatar={<Avatar src="img/example-128.jpg" />}
              rightIconButton={<FlatButton primary={true} label="删除" />}
              primaryText="me, Scott, Jennifer"
              secondaryText={
               <p>
                <span style={{color: Colors.darkBlack}}>Summer BBQ</span><br/>
                Wish I could come, but I&apos;m out of town this weekend.
               </p>
              }
              secondaryTextLines={2} />

            <ListDivider inset={true} />
            <ListItem
              leftAvatar={<Avatar src="img/example-128.jpg" />}
              rightIconButton={<FlatButton primary={true} label="删除" />}
              primaryText="Brendan Lim"
              secondaryText={
               <p>
                <span style={{color: Colors.darkBlack}}>Brunch this weekend?</span><br/>
                I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
               </p>
              }
              secondaryTextLines={2} />
            <ListDivider inset={true} />
            <ListItem
              leftAvatar={<Avatar src="img/example-128.jpg" />}
              rightIconButton={<FlatButton primary={true} label="删除" />}
              primaryText="me, Scott, Jennifer"
              secondaryText={
               <p>
                <span style={{color: Colors.darkBlack}}>Summer BBQ</span><br/>
                Wish I could come, but I&apos;m out of town this weekend.
               </p>
              }
              secondaryTextLines={2} />

            <ListDivider inset={true} />
            <ListItem
              leftAvatar={<Avatar src="img/example-128.jpg" />}
              rightIconButton={<FlatButton primary={true} label="删除" />}
              primaryText="Brendan Lim"
              secondaryText={
               <p>
                <span style={{color: Colors.darkBlack}}>Brunch this weekend?</span><br/>
                I&apos;ll be in your neighborhood doing errands this weekend. Do you want to grab brunch?
               </p>
              }
              secondaryTextLines={2} />
            <ListDivider inset={true} />
            <ListItem
              leftAvatar={<Avatar src="img/example-128.jpg" />}
              rightIconButton={<FlatButton primary={true} label="删除" />}
              primaryText="me, Scott, Jennifer"
              secondaryText={
               <p>
                <span style={{color: Colors.darkBlack}}>Summer BBQ</span><br/>
                Wish I could come, but I&apos;m out of town this weekend.
               </p>
              }
              secondaryTextLines={2} />

            <ListDivider />
            <ListItem style={styles.textCenter}
              primaryText="查看更多"
              />
          </List>
        </Card>
      </div>
    );
  }
}

module.exports = Shots;
