import createBrowserHistory from 'history/lib/createBrowserHistory';
import universalRender from '../shared/universal-render';
import createFlux from '../shared/flux/createFlux';

let history = createBrowserHistory();
//const client = new ApiClient();
const flux = createFlux();

console.log("*** Client");
console.log(process.env.NODE_ENV);
console.log(process.env.BROWSER);

universalRender({flux, history});