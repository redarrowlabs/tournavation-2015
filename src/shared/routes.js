import React from "react";
import { Router, Route, IndexRoute } from 'react-router'

import App from "./components/App.react";
import Track from "./components/Tracker.react";
import Login from "./components/Login.react";

export default (
    <Route path="/" component={ App }>
        <IndexRoute component={ Login }/>
        <Route path="track" component={ Track }/>
    </Route>
);