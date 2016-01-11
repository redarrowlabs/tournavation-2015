
[![Slack](https://img.shields.io/badge/Slack-Channel-blue.svg)](https://redarrowlabs.slack.com/messages/tournavation-2015/)
[![HuBoard](http://img.shields.io/badge/Hu-Board-7965cc.svg)](https://huboard.com/redarrowlabs/tournavation-2015/)
[![Dependency Status](https://david-dm.org/redarrowlabs/tournavation-2015.svg)](https://david-dm.org/redarrowlabs/tournavation-2015)
[![devDependency Status](https://david-dm.org/redarrowlabs/tournavation-2015/dev-status.svg)](https://david-dm.org/redarrowlabs/tournavation-2015#info=devDependencies)

# Tournavation-2015
MKE Tournavation project for 2015.

## What is Tournavation
Tournavation is a social innovation project led by Red Arrow Labs and Dohmen Foundation.  The goal is to address a social issue voted on by the community, and create a technical solution to help alleviate the problem.  The project is developed by a volunteer team from the community, and gifted back as an open source project.

## The Idea
Health disparities are inextricably linked with poverty (Milwaukee Health Report, 2013). At the core of the issue are three root causes that Health STEMheroes addresses: (1) lack of real-time information for both public servants and citizens, which hinders effective resource allocation to those most in need; (2) disempowerment of those in poverty, particularly adolescents, to understand and improve their own health; and (3) far too few students (especially females and students of color) pursuing studies and careers in science, technology, engineering, math (STEM), especially as such jobs boom in Milwaukee and would provide a path out of economic poverty that negatively affects health outcomes.

## The Solution
The goal of this application is to allow Health Mentors to create experiments for Participants to track Health Behaviors and learn from the results.

## About this project
This is an ES7 Node.js isomorphic/universal project with a RESTfull web API.  [Express](http://expressjs.com/en/index.html) is used for the HTTP server, as well as routing HTTP requests.  [React](https://facebook.github.io/react/) and [Alt](http://alt.js.org/) are leveraged for rendering and handling application flow.

## Getting started
* [Read the wiki]( https://github.com/redarrowlabs/tournavation-2015/wiki) to learn about the project
* Clone the repo with `git clone  https://github.com/redarrowlabs/tournavation-2015.git`
* Using [`nodejs@5.0.1`, `npm@3.5.1`](https://nodejs.org/en/), & [`MongoDB@3.2`](https://www.mongodb.org/)
* Install and start MondoDB on `mongodb://localhost:27017`
* `npm install`
* `npm run dev`
* Open browser to localhost:3000

## Contributing to this project
Anyone and everyone is welcome to contribute. Please take a moment to review the [guidelines for contributing](CONTRIBUTING.md).

* [Bug reports](CONTRIBUTING.md#bugs)
* [Feature requests](CONTRIBUTING.md#features)
* [Pull requests](CONTRIBUTING.md#pull-requests)

## TL;DR
 * [alt ^0.18.1](https://github.com/goatslacker/alt)
 * [express ^4.13.3](https://github.com/strongloop/express)
 * [immutable ^3.7.5](https://github.com/facebook/immutable-js)
 * [jade ^1.11.0](https://github.com/pugjs/jade)
 * [mongoose ^4.3.1](https://github.com/Automattic/mongoose)
 * [react ^0.14.3](https://github.com/facebook/react)
 * [react-dom ^0.14.3](https://github.com/EtienneLem/react-dom)
 * [react-router ^1.0.0](https://github.com/rackt/react-router)
 * [superagent ^1.5.0](https://github.com/visionmedia/superagent)
 * [Globalize ^1.1.0-rc.7](https://github.com/jquery/globalize)
 * [babel.js](https://github.com/babel/babel)
 * [webpack](https://github.com/webpack/webpack)

## Project Breakdown
### API `(src/server/api)`
The boilerplate code for the [Express](http://expressjs.com/en/index.html) server should be pretty much done, so adding a new route should be pretty easy and straight forward.
 * Create a new route under `src/server/api/routes` (the file name should be descriptive of its purpose)
 * Export a function that will depend on an Express router, and add the desired routes to it
 * The routes should contain the business logic needed
 * If data access is needed, create a new Model under `src/server/api/models`
```
 export default function (router) {
  	router.route('/tests').get(function(req, res) {
  	    res.send({ message: 'Test get' });
  	});
  
  	router.route('/tests/:id').get(function(req, res) {
  	    res.send({ message: 'Test get: {_id}' });
  	});
  
  	router.route('/tests').post(function(req, res) {
  	    res.send({ message: 'Test post' });
  	});
  
  	router.route('/tests/:id').put(function(req,res){
  	    res.send({ message: 'Test put: {_id}' });
  	});
  
  	router.route('/tests/:id').delete(function(req, res) {
  	    res.send({ message: 'Test delete: {_id}' });
  	});
  }
``` 
Data access is done through Mongoose to MongoDB.
 * Create a new model under `src/server/api/models` (the file name should be descriptive of its purpose)
 * Define a schema for the model
 * Export the new model
```
  import mongoose from 'mongoose';
  var Schema = mongoose.Schema;
  
  var schema = new Schema({
  	name: String,
    key: String,
    data: Schema.Types.Mixed,
  });
  
  export default mongoose.model('Test', schema);
```

### Web Server / Client
Code for client facing code can be found under `src/shared`.  This is the client side running code and what is rendered server side.  This is built with [React](https://facebook.github.io/react/) and Flux ([Alt](http://alt.js.org/) implementation).  This breaks the code down into actions, stores, and components.

#### Actions
Actions can be defined as the tasks that the application need to perform from user, or even application, events.  Actions are used to dispatch events to stores, as well has make API calls.  These are basic classes, wrapped by Alt.  Actions should be wrapped in the Alt resolver for asynchronous work (and handled for server side rendering).  The result of the work should be dispatched out for notifications.  When a new action class is added, it needs to be registered in `src/shared/actions/index.js`.
```
class TestActions {

  constructor() {
    // Add dispatch only actions
    this.generateActions(
      'updateTests',
    );
  }

    fetchTests() {
      return (dispatch, alt) =>
        alt.resolve(async () => {
          var data = await alt.api.fetchAll('tests');      
          alt.getActions('tests').updateAllTests(data);
        });
    }
}

export default HealthBehaviorActions;
```

### Stores
Stores are what hold (immutable) state for the application.  When an action dispatches, it is the store that is listening to update the state.  Like actions, stores are classes that get wrapped by (immutable) Alt.  This makes it an immutable store, so state needs to be set a little differently then traditional Alt stores.  When binding to a store, a convention is used: store methods need to be named `on<ActionMethodName>`.  For example, if there was and action for `fetchTests`, then the store needs `onFetchTests` to bind for dispatch events.  Similarly with Actions, Stores need to be registered in `src/shared/stores/index.js`.
```
import Immutable from 'immutable';
var immutableAlt = require('alt-utils/lib/ImmutableUtil');

@immutableAlt
class TestStore{
  displayName = 'TestStore'
  constructor() {
    this.bindActions(this.alt.getActions('tests'));
    
    this.state = Immutable.Map({
      tests: new Immutable.List([])
    });
  }

  onFetchTests() {
    this.setState(
      this.state.set('tests',
        this.state.get('tests').clear()));
  }

  onUpdateTests(payload) {
    this.setState(
      this.state.set('tests',
        Immutable.fromJS(payload)));
  }
};

export default TestStore;
```

### Components
Components are React classes that render HTML.  They use stores to get state, and actions to trigger events in the application.  The application component hierarchy is defined by routes (`src/shared/routes.js`), and components can only comprise of one HTML node/element, which can contain child components.  If a component requires any properties, they should be passed in from the parent component.  The state should be set in `getInitialState()`, and updated by listening to the store(s) of interest when the component is mounted.
```
export default React.createClass ({

  // call initial fetch to load data, called on both client and server
  componentWillMount() {
    const { flux } = this.context;
    flux.getActions('tests').fetchAllHealthBehaviors();
  },

  // begin listening to store
  componentDidMount() {
    const { flux } = this.context;
    flux.getStore('tests').listen(this.stateChanged);
  },

  // remove listener when component is unmounted
  componentWillUnmount() {
    onst { flux } = this.context;
    flux.getStore('tests').unlisten(this.stateChanged);
  },

  stateChanged(state) {
    this.setState({
    	tests: state.get('tests')
    });
  },

  getInitialState() {
    const { flux } = this.context;
    return {
    	tests: flux.getStore('tests').getState().get('tests')
    };
  },

  renderListItem(test) {
    return (
      <li key={test.get('id')}>
      	{test.get('start')} - {test.get('end')}
      </li>
    );
  },

  render() {
    const { tests } = this.state;
    return (
      <div>
        <span>Logged data:</span>
    	<ul>{ tests.map(this.renderListItem) }</ul>
      </div>
    );
  }
});
```

### Globalization
[Globalize](https://github.com/jquery/globalize) is used as the globalization engine.  Resource files are one per locale, and are found in `src/shared/globalization`.

### SSL/TLS
The production server runs under HTTPS while development is HTTP only.  To configure SSL, set the environment variables SSL_CERT_PATH and SSL_KEY_PATH to the path of the SSL certificate and key.
[Let's Encrypt](https://letsencrypt.org/) is one trusted Certificate Authority providing free certificates.  A certificate that is signed by an untrusted Certificate Authority or a certificate that is self-signed will display a warning in the browser before the user can proceed.  Production certificates should be signed by a trusted Certificate Authority, as forcing users to bypass this warning allows certain attacks.
For testing purposes, a self-signed certificate is enough and any users will need to bypass the warning.  Using the openssl command below, a self-signed certificate can be created.
```
openssl req -x509 -newkey rsa:2048 -keyout self-signed.key -out self-signed.crt -days XXX -nodes
```
Additionally when using self-signed certificates, set the environment variable NODE_TLS_REJECT_UNAUTHORIZED=0.  This setting bypasses authentication of the SSL certificate on the Node server.  Do not use this setting in production, as it allows many of the attacks that HTTPS was designed to prevent.

## License
[MIT License (MIT)](LICENSE.md)
