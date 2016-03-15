let React = require('react');
let Router = require('react-router');

let {
  Route,
  Redirect,
  DefaultRoute
} = Router

// Here we define all our material-ui ReactComponents.
//let Entry = require('./components/entry');
let Main = require('./components/main');
let Login = require('./components/login');

// Page
let Feeds = require('./components/pages/feeds');
let Search = require('./components/pages/search');

// Node
let Nodes = require('./components/pages/nodes');
let NodeIndex = require('./components/pages/nodeIndex');
let Node = require('./components/pages/node');
let NodeNew = require('./components/pages/nodeNew');

// Video
let Videos = require('./components/pages/videos');
let VideoIndex = require('./components/pages/videoIndex');
let Video = require('./components/pages/video');
let VideoNew = require('./components/pages/videoNew');

// User
let UserNew = require('./components/pages/userNew');

// Unuse now
let Shots = require('./components/pages/shots');

/** Routes: https://github.com/rackt/react-router/blob/master/docs/api/components/Route.md
 *
 * Routes are used to declare your view hierarchy.
 *
 * Say you go to http://material-ui.com/#/components/paper
 * The react router will search for a route named 'paper' and will recursively render its
 * handler and its parent handler like so: Paper > Components > Master
 */

// React Router v0.13 Nice Post: http://undefinedblog.com/react-router-0-13-3/
let AppRoutes = (
  <Route name="entry" >
    <Route name="login" path="/login" handler={Login} />
    <Route name="root" path="/" handler={Main}>
      <Route name="feeds" handler={Feeds} />
      <Route
        name="search"
        handler={Search}
        path="search/:type/:keyword" />
      <Route name="nodes" handler={Nodes}>
        <Route name="nodelist" handler={NodeIndex}/>
        <Route name="nodeNew" path="create" handler={NodeNew}/>
        <Route name="node" path=":id" handler={Node}/>
        <DefaultRoute handler={NodeIndex} />
      </Route>
      <Route name="videos" handler={Videos}>
        <Route name="videolist" handler={VideoIndex}/>
        <Route name="videoNew" path="create" handler={VideoNew}/>
        <Route name="video" path=":id" handler={Video}/>
        <DefaultRoute handler={VideoIndex} />
      </Route>
      <Route name="users" handler={UserNew} />
      <Route name="shots" handler={Shots} />
      <DefaultRoute handler={Feeds}/>
    </Route>
    {/* make no sense, just mark. */}
    <DefaultRoute handler={Login}/>
  </Route>
);

module.exports = AppRoutes;
