import React from "react";
import { Router, Route, IndexRoute } from 'react-router'

import App from "./components/App.react.jsx";
import Home from "./components/Home.react.jsx";
import SleepTracker from "./components/SleepTracker.react.jsx";

export default (  
  <Route path="/" component={ App }>
	  <IndexRoute component={ Home }/>
	  <Route path="track" component={ SleepTracker }/>
  </Route>
);