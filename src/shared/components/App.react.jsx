import React, {PropTypes} from 'react';
import { Router, Route, Link } from 'react-router';
import Globalize from 'globalize';

// Class component - can have state
// Can only return a single node
// - Remember that it is ~ return React.createElement('h1', null, 'Hello'); -- can't return two elements!
const App = React.createClass({

  contextTypes: { flux: PropTypes.object.isRequired },

  getInitialState() {
    return {
    };
  },
  
  componentDidMount() {
    const { flux } = this.context;
    flux.getStore('auth').listen(this.authStateChanged);
  },
  
  componentWillUnmount() {
    const { flux } = this.context;
    flux.getStore('auth').unlisten(this.authStateChanged);
  },

  authStateChanged(state) {
    const { flux } = this.context;
    if(state.get('isAuthenticated')) {
      window.location.href = '/track';
    } else {
      window.location.href = '/';
    }
  },

  render() {
    return (
      <div>
        <header id="navigation">
          <nav>
            <ul>
              <li><Link to="/home">{Globalize.formatMessage('home-nav-home')}</Link></li>
              <li><Link to="/track">{Globalize.formatMessage('home-nav-track')}</Link></li>
            </ul>
          </nav>
        </header>

        <div>
          <h1>{Globalize.formatMessage('home-title')}</h1>
          {this.props.children}
        </div>
      </div>
    );
  }
});

// Stateless function component
//const App = () => <h1>Hello there!</h1>;
export default App;