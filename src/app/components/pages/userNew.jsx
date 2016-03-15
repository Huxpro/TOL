// 新建用户
let React = require('react');
let { UserModel } = require('../../dataModel')
let { Link } = require('react-router')
let md5 = require('blueimp-md5');

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
  innerText: {
    display:'block',
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
        node_name: '新建用户',
        node_description: '',
        node_parent: '',
      },
      rawModel: {
        node_name: '新建用户'
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

  },

  _handleCreate(e){
    e.preventDefault();
    console.log(e.nativeEvent);
    let _e = e.nativeEvent;

    if(!confirm("确定要新建吗？")) return;

    let usernick  = e.target[0].value;
    let usermail  = e.target[1].value;
    let password = md5(e.target[2].value);

    let _json = {
      usernick,
      usermail,
      password
    }
    UserModel.signUp(
      _json,
      (res) => {
        console.log("User SignUp:");
        console.log(res);

        alert("用户创建成功！")
        _e.target[0].value = "";
        _e.target[1].value = "";
        _e.target[2].value = "";
      }, (err)=>{
        console.log(err);
      }
    )
  },


  render() {
    let _node = this.state.model;
    let _raw = this.state.rawModel;
    if(!_node) return <div/>;

    // 渲染
    return (
      <div style={styles.cardContainer}>
        <Card style={styles.card}>
          <form onSubmit={this._handleCreate}>
            <CardTitle
              style={{width:'50%'}}
              title={"用户 - " + _raw.node_name } />
            <CardText>
              <TextField
                style={styles.innerText}
                floatingLabelText="内测用户名" />
              <TextField
                style={styles.innerText}
                floatingLabelText="用户邮箱" />
              <TextField
                style={styles.innerText}
                type="password"
                floatingLabelText="密码" />
            </CardText>
            <ListDivider />
            <CardActions style={{marginTop:0, textAlign:'left'}}>
              <FlatButton
                label="新建"
                secondary={true}
                type="submit" />
            </CardActions>
          </form>
        </Card>
      </div>
    );
  }
})

// pass down router in context
Node.contextTypes = {
 router: React.PropTypes.func
};

module.exports = Node;
