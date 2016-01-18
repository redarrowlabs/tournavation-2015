import React, {PropTypes} from 'react';
import { Router, Route, Link } from 'react-router';
import Globalize from 'globalize';

// Class component - can have state
// Can only return a single node
// - Remember that it is ~ return React.createElement('h1', null, 'Hello'); -- can't return two elements!
const App = React.createClass({

  contextTypes: { flux: PropTypes.object.isRequired },

  getInitialState() {
    const { flux } = this.context;
    let isAuthenticated = flux.getStore('auth').getState().isAuthenticated;
    return {
      isAuthenticated
    };
  },
  
  componentWillMount() {
	const { flux } = this.context;
	flux.getActions('auth').fetchAuthStatus();
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
    this.state.isAuthenticated = state.get('isAuthenticated');
    if(this.state.isAuthenticated) {
      if(window.location.pathname == '/') {
        window.location.href = '/track';
      }
    } else if(window.location.pathname != '/') {
      window.location.href = '/';
    }
  },
  
  signOut() {
    const { flux } = this.context;
    // If the google api is already loaded, then just go ahead and sign out
    if(gapi.auth2) {
      this.executeSignOut(gapi.auth2.getAuthInstance(), flux);
    } else {
      // If the google api is not loaded, load it then sign out.  It will not load twice
      let self = this;
      gapi.load('auth2', function() {
        let clientId = document.getElementsByTagName('meta')['google-signin-client_id'].getAttribute('content');
        let auth2 = gapi.auth2.init({
          client_id: clientId,
          scope: 'https://www.googleapis.com/auth/plus.login'
        });
        auth2.then(function() {
          self.executeSignOut(auth2, flux);
        });
      });
    }
  },
  
  executeSignOut(auth2, flux) {
    if(auth2.currentUser.get().isSignedIn()) {
        auth2.signOut().then(function () {
        flux.getActions('auth').submitLogout();
      });
    } else {
      flux.getActions('auth').submitLogout();
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
              <li><a href="#" onClick={this.signOut}>Sign out</a></li>
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