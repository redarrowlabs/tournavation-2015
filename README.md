
[![Slack](https://img.shields.io/badge/Slack-Channel-blue.svg)](https://redarrowlabs.slack.com/messages/tournavation-2015/)
[![HuBoard](http://img.shields.io/badge/Hu-Board-7965cc.svg)](https://huboard.com/redarrowlabs/tournavation-2015/)
[![Dependency Status](https://david-dm.org/redarrowlabs/tournavation-2015.svg)](https://david-dm.org/redarrowlabs/tournavation-2015)
[![devDependency Status](https://david-dm.org/redarrowlabs/tournavation-2015/dev-status.svg)](https://david-dm.org/redarrowlabs/tournavation-2015#info=devDependencies)

# Tournavation-2015
MKE Tournavation project for 2015.

## What is Tournavation
Tournavation is a social innovation project led by Red Arrow Labs and Dohmen Foundation.  The goal is to address a address a social issue voted on by the community, and create a technical solution to help alleviate the problem.  The project is developed by a volunteer team from the community, and gifted back as an open source project.

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
Actions can be defined as the tasks that the application need to perform from user, or even application, events.  Actions are used to dispatch events to stores, as well has make API calls.  These are basic classes, wrapped by Alt.
```
class Testctions {

  constructor() {
    // Add dispatch only actions
    this.generateActions(
      'updateTests',
    );
  }

    fetchTests() {
      var self = this;
      return dispatch => {
        dispatch();
        request
          .get(config.apiBaseUrl + '/tests')
          .end((err, resp) => {
            self.updateTest(resp.body);
          });
      }
    }
}

export default alt.createActions(HealthBehaviorActions);
```

### Stores
Stores are what hold state for the application.  When an action dispatches, it is the store that is listening to update the state.  Like actions, stores are classes that get wrapped by Alt.
```
class TestStore{
	constructor() {
		this.items = new Immutable.List([]);

		let { fetchTests, updateTests } = HealthBehaviorActions;
		this.bindListeners({
			handleFetchTests: fetchTest,
			handleUpdateTests: updateTest
		});
	}

	handleFetchTests() {
		this.setState({ items: new Immutable.List([]) });
	}

	handleUpdateTests(payload) {
		this.setState({ items: new Immutable.List(payload) });
	}
};

export default alt.createStore(TestStore, 'TestStore');
```

### Components
Components are React classes that render HTML.  They use stores to get state, and actions to trigger events in the application.  The application component hierarchy is defined by routes (`src/shared/routes.js`), and components can only comprise of one HTML node/element, which can contain child components.  If a component requires any properties, they should be passed in from the parent component.  The state should be set in `getInitialState()`, and updated by listening to the store(s) of interest when the component is mounted.
```
export default React.createClass ({

  // begin listening to store, and call initial fetch to load data
	componentDidMount() {
    TestStore.listen(this.stateChanged);
    TestAction.fetchTests();
  },

  // remove listener when component is unmounted
  componentWillUnmount() {
    TestStore.unlisten(this.stateChanged);
  },

  stateChanged(state) {
    this.setState({
    	tests: state.tests
    });
  },

  getInitialState() {
    return {
    	tests: HealthBehaviorStore.getState().tests
    };
	},

	renderListItem(test) {
		return (
      <li>
      	{test.start} - {test.end}
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

## License
[MIT License (MIT)](LICENSE.md)
