import React from "react";
import ReactDOM from 'react-dom';
import { Router, Route } from 'react-router';
import createBrowserHistory from 'history/lib/createBrowserHistory';
import routes from "../shared/routes";

let history = createBrowserHistory();
var mountNode = document.getElementById('react-main-mount');

ReactDOM.render(<Router history={history}>{routes}</Router>, mountNode);

console.log("Client started.");

window.onLoad = () => {
	console.log("window loaded.");
}