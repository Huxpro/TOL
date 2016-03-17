/**
 *  App.jsx
 *  Main App of TOL.
 *  @huxpro
 */

// to support many ES6 Object/Array new APIs, use Babel-Polyfill
// Babel-core is mainly transform ES6 Syntax to ES5 but not do shim
// http://babeljs.io/docs/usage/polyfill/
require("babel-core/polyfill")


// import styles.
require('normalize.css')
require('./app.scss')


// React 0.14.x
import React from 'react'
import ReactDOM from 'react-dom'
window.React = React;


// React Router 2.0.0
import { Router, Route, hashHistory } from 'react-router'


// Closure Scope
(function () {

  // define React components
  let Main = require('./components/main')


  // Render app with React-Router
  ReactDOM.render((
    <Router history={hashHistory}>
      <Route path="/" component={Main} />
      <Route path="/:group/:stage" component={Main}/>
    </Router>
  ), document.getElementById('app'))


})();
