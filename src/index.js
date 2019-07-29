import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import * as serviceWorker from './serviceWorker';

import Login from './components/Login';
import Home from "./components/Home";
import Form from "./components/Form";
import { Route, Link, BrowserRouter as Router } from 'react-router-dom'

const Routing = (
    <Router>
        <Route exact path="/" component={Login} />
        <Route path="/home" component={Home} />
        <Route path="/form/:id" component={Form} />
    </Router>
)

ReactDOM.render(Routing, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
