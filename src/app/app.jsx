/**
 *  App.jsx
 *
 */

// to support many ES6 Object/Array new APIs, use Babel-Polyfill
// Babel-core is mainly transform ES6 Syntax to ES5 but not do shim
// http://babeljs.io/docs/usage/polyfill/
require("babel-core/polyfill");

// import styles.
require('normalize.css');
require('./app.scss');


// Closure Scope
(function () {
  let React = require('react'),
    ReactDOM = require('react-dom');
    Router = require('react-router'),
    AppRoutes = require('./app-routes.jsx'),
    injectTapEventPlugin = require('react-tap-event-plugin');

  //Needed for React Developer Tools
  window.React = React;

  //Needed for onTouchTap
  //Can go away when react 1.0 release
  //Check this repo:
  //https://github.com/zilverline/react-tap-event-plugin
  injectTapEventPlugin();

  // Render the main app react component into the document body.
  // For more details see: https://facebook.github.io/react/docs/top-level-api.html#react.render
  //React.render(<Main />, document.body);

  /** Render the main app component. You can read more about the react-router here:
   *  https://github.com/rackt/react-router/blob/master/docs/guides/overview.md
   */
  Router
    // Runs the router, similiar to the Router.run method. You can think of it as an
    // initializer/constructor method.
    .create({
      routes: AppRoutes,
      scrollBehavior: Router.ScrollToTopBehavior,
    })
    // This is our callback function, whenever the url changes it will be called again.
    // Handler: The ReactComponent class that will be rendered
    .run(function (Handler) {
      ReactDOM.render(<Handler/>, document.body);
    });

})();
