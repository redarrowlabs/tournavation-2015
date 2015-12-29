import createBrowserHistory from 'history/lib/createBrowserHistory';
import universalRender from '../shared/universal-render';
import createFlux from '../shared/flux/createFlux';

let history = createBrowserHistory();
const flux = createFlux();

console.log("*** Client: " + __CLIENT__);
console.log(process.env.NODE_ENV);
var state = window.__STATE__;

universalRender({flux, history, locale: state.locale});