import React from "react";
import { Router, Route, IndexRoute } from 'react-router'

import App from "./components/App.react";
import Home from "./components/Home.react";
import SleepTracker from "./components/SleepTracker.react";
import Login from "./components/Login.react";

export default (
    <Route path="/" component={ App }>
        <IndexRoute component={ Login }/>
        <Route path="home" component={ Home }/>
        <Route path="track" component={ SleepTracker }/>
    </Route>
);