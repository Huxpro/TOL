let React = require('react');
let md5 = require('blueimp-md5');
let Router = require('react-router');
let RouteHandler = Router.RouteHandler;
let Link = Router.Link;

let { UserModel } = require('../dataModel')

let {
  Toolbar,
  LeftNav,
  TextField,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle,
  Mixins,
  Styles,
  Paper,
  LinearProgress,
  Card,
  CardTitle,
  CardActions,
  CardText,
  FlatButton
} = require('material-ui');

let { Colors, Spacing, Typography } = Styles;
let ThemeManager = new Styles.ThemeManager();
let wsCSS = require('../styles/wscss')

// CSS in JS
let styles = {
  toolbarWrapper: Object.assign({
    position: 'fixed',
    width: '100%',
    zIndex: '11',
    height: 58,
  }, wsCSS.borderReplaceShadow),
  toolbar: {
    backgroundColor: '#fff',
    color: '#ccc'
  },
  toolbarGroup: {
    lineHeight: '56px'
  },
  toolbarTitle: {
    color:'#757575',
    fontSize:24,
    lineHeight: '59px',
    marginLeft: '-2px',
    fontWeight: 300,
    fontStyle: 'italic'
  },
  content: {
    position: 'absolute',
    padding: '24px',
    paddingTop: 56 + 24,
    paddingLeft: 170 + 24 + 6,
    width: '94%',
    height: '100%',
  },
  loading: {
    position: 'fixed',
    top: 58,
    zIndex: '99'
  },
  insetText: {
    display:'block',
    marginLeft:16,
    fontSize: 16
  },
  loginCard:{
    width: 334,
    height: 350,
    position: 'absolute',
    paddingLeft:20,
    paddingTop: 28,
    margin: 'auto',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  }
}


let Main = React.createClass({

  childContextTypes: {
    muiTheme: React.PropTypes.object,
  },

  getChildContext() {
    return {
      muiTheme: ThemeManager.getCurrentTheme(),
    };
  },

  componentWillMount() {
    ThemeManager.setPalette({
      accent1Color: Colors.deepOrange500,
    });
  },

  componentDidMount(){
    // _validateToken
  },

  getInitialState(){
    return {
      loading: false
    }
  },

  _handleLogin(e){
    e.preventDefault();
    console.log(e.nativeEvent);
    let account  = e.target[0].value;
    let password = md5(e.target[1].value);

    let _json = {
      access_type: 'super',
      account,
      password
    }
    UserModel.login(
      _json,
      (res) => {
        console.log("User Login:");
        console.log(res);

        // did not directly setState to ROOT;
        // storage TOKEN use localStorage
        // let DataModel(responsible for sync) judge it.
        UserModel.storeToken(res.token);

        this.context.router.transitionTo('root')
      }, (err)=>{
        console.log(err);
      }
    )
   },

  render() {

    let _loading = this.state.loading ? (<LinearProgress mode="indeterminate" style={styles.loading}/>) : null
    return (
      <div>
        <Paper zDepth={1} style={styles.toolbarWrapper}>
          <Toolbar style={styles.toolbar}>
            <img
              src="img/logo.jpg" height="56"
              style={{cursor: 'pointer', float:'left'}} />
            <ToolbarTitle style={styles.toolbarTitle} text="Content Manger" />
          </Toolbar>
        </Paper>
        {_loading}
        <Card style={styles.loginCard}>
          <form onSubmit={this._handleLogin}>
            <CardTitle
              title="登陆"
              subtitle="Welcome to WeSafari Content Manger" />
            <CardText>
              <TextField
                floatingLabelText="管理员账户" />
              <TextField
                type="password"
                floatingLabelText="密码" />
            </CardText>
            <CardActions style={{textAlign: 'right'}}>
              <FlatButton
                secondary={true}
                type="submit"
                label="登陆" />
            </CardActions>
          </form>
        </Card>
      </div>
    );
  }
});

// pass down router in context
Main.contextTypes = {
 router: React.PropTypes.func
};

module.exports = Main;
