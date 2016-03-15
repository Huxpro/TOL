let React = require('react');
let Router = require('react-router');
let RouteHandler = Router.RouteHandler;
let Link = Router.Link;
let { UserModel } = require('../dataModel');

let {
  Avatar,
  Toolbar,
  LeftNav,
  List,
  ListItem,
  TextField,
  ToolbarGroup,
  ToolbarSeparator,
  ToolbarTitle,
  Mixins,
  Styles,
  DropDownMenu,
  Paper,
  LinearProgress,
  FloatingActionButton,
  FontIcon,
  IconButton
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
  leftNav: Object.assign({
    width: '170px',
    position: 'fixed',
    top: '56px',
    height: '100%',
    //boxShadow: 'none'
  }, wsCSS.borderReplaceShadow),
  leftNavHeader: {
    paddingTop: '20'
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
    backgroundColor: "#FEDA49",
    zIndex: '99'
  },
  FAB:{
    position: 'fixed',
    zIndex: '9999',
    right: 23,
    bottom: 23
  },
  FABup:{
    position: 'fixed',
    zIndex: '9999',
    right: 23,
    bottom: 100
  }
}

// enums of search type
const SEARCH_TYPE = {
  ALL: 0,
  TAG: 1,
  VIDEO: 2
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

  _onNavChange(e, index, item){
    this.context.router.transitionTo(item.route);
  },

  _handleLogoTouchTap(e){
    this.context.router.transitionTo('root');
  },

  _handleSearchTypeChange(e, selectedIndex, menuItem){
    console.log(menuItem);
    this.setState({
      searchType: SEARCH_TYPE[menuItem.payload]
    })
  },

  _handleSearch(e){
    console.log(e.nativeEvent);
    e.preventDefault()

    if(e.nativeEvent.target[0].value == "") return;

    this.context.router.transitionTo(
      'search', {
        type: this.state.searchType,
        keyword: e.nativeEvent.target[0].value
      }
    );
    e.nativeEvent.target[0].value = ""
  },

  getInitialState(){
    return {
      searchType: SEARCH_TYPE.ALL,
      loading: true,
      progress: null,
      user: null
    }
  },

  componentDidMount(){
    // for some global call need.
    window.__wsApp__ = this;

    let token = UserModel.fetchToken();
    if(!token){
      this.context.router.transitionTo('login');
    }else{
      UserModel.getMe((res)=>{
        console.log('GET current user:');
        console.log(res);

        // set user to state.
        this.setState({
          user: res
        })
      }, (err)=>{
        this.context.router.transitionTo('login');
      })
    }
  },

  render() {
    let _header = (
      <List style={styles.leftNavHeader} >
        <ListItem
          style={{color:'rgba(0, 0, 0, 0.54)'}}
          leftAvatar={
            <Avatar src="img/example-128.jpg" />}
          primaryText="管理员" />
      </List>
    )

    let navItems = [
      { route: 'feeds', text: '首页'},
      { route: 'nodes', text: '节点管理'},
      { route: 'videos', text: '视频管理'},
      { route: 'users', text: '用户管理'},
      //{ route: 'shots', text: '短镜头管理'},
      //{ route: 'movies', text: '轻游记管理'},
      { route: 'feeds', text: '信息流管理',  disabled: true},
      { route: 'invite', text: '邀请码管理', disabled: true},
      { route: 'feedback', text: '举报管理', disabled: true}
    ];

    let searchType = [
       { payload: 'ALL', text: '搜索全部' },
       { payload: 'TAG', text: '搜索标签' },
       { payload: 'VIDEO', text: '搜索短镜头' },
      //  { payload: 'UNDEFINED', text: '搜索轻游记' }
    ];

    let _loading = this.state.loading ? (
      <LinearProgress mode="indeterminate" style={styles.loading}/>) : null;

    let _progress = this.state.progress ? (
      <LinearProgress mode="determinate"
        style={styles.loading}
        value={this.state.progress}
      />) : null;

    return (
      <div>
        <Paper zDepth={1} style={styles.toolbarWrapper}>
          <Toolbar style={styles.toolbar}>
            <img
              src="img/logo.jpg" height="56"
              onTouchTap = {this._handleLogoTouchTap}
              style={{cursor: 'pointer', float:'left'}} />
            <ToolbarTitle style={styles.toolbarTitle} text="CMS" />
            <ToolbarGroup
              style={styles.toolbarGroup}
              key={1} float="right">
              <DropDownMenu
                menuItems={searchType}
                onChange={this._handleSearchTypeChange}
                style={{width:'122', marginRight:'0'}}
                underlineStyle={{display:'none'}}
                />
              <form
                style={{display: 'inline-block'}}
                onSubmit={this._handleSearch} >
                <TextField hintText="搜索" />
              </form>
            </ToolbarGroup>
          </Toolbar>
        </Paper>

        {_loading}
        {_progress}

        <LeftNav
          docked
          header={_header}
          style={styles.leftNav}
          menuItems={navItems}
          onChange={this._onNavChange}
        />
        <div style={styles.content}>
          <RouteHandler />
        </div>
        <Link to="videoNew" >
          <FloatingActionButton
            backgroundColor="#FF5722"
            style={styles.FAB}
            value="新建视频">
            <FontIcon className="material-icons">videocam</FontIcon>
          </FloatingActionButton>
        </Link>
        <Link to="nodeNew" >
          <FloatingActionButton
            backgroundColor="#FF5722"
            style={styles.FABup}
            value="新建节点" >
              <FontIcon className="material-icons">bookmark</FontIcon>
          </FloatingActionButton>
        </Link>
      </div>
    );
  }
});

// pass down router in context
Main.contextTypes = {
  router: React.PropTypes.func
};

module.exports = Main;
