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
    const isAuthenticated = flux.getStore('auth').getState().get('isAuthenticated');
    const userName = flux.getStore('auth').getState().get('userName');
    return {isAuthenticated, userName};
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
    const isAuthenticated = state.get('isAuthenticated');
    const userName = state.get('userName') || '';
    this.setState({isAuthenticated, userName});

    if(isAuthenticated) {
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
        {this.renderHeader()}

        {this.props.children}

        <footer style={{clear:"both"}}>
            <p>
              {Globalize.formatMessage('app-footer-power')}
              <a href="http://www.redarrowlabs.com/">
                <img src="http://www.redarrowlabs.com/Images/ral-logo-notag.png" alt="Red Arrow Labs logo"/>
              </a> 
               <a href="#">{Globalize.formatMessage('app-footer-group')}</a> | <a href="#">{Globalize.formatMessage('app-footer-contact')}</a>
            </p>
        </footer>
      </div>
    );
  },

  renderHeader() {
    const isAuthenticated = this.state.isAuthenticated;
    if (isAuthenticated) {      
      const user = this.state.userName;
      const greeting = user ? Globalize.formatMessage('app-greeting-user', user) : Globalize.formatMessage('app-greeting-welcome');

      return (
        <header>
          <div className="logoExport">
            <h1>{Globalize.formatMessage('app-title')}</h1>
            <ul className="signInInfo">
                <li className="greeting">{greeting}</li>
                <li><a href="#" onClick={this.signOut}>{Globalize.formatMessage('app-signout')}</a></li>
            </ul>
          </div>
          <div className="logoHeaderBG"></div>
        </header>
      );
    }

    return null;
  }
});

// Stateless function component
//const App = () => <h1>Hello there!</h1>;
export default App;