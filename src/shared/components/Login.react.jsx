import React, {PropTypes} from "react";
import { Router, Route, Link } from 'react-router';
import Globalize from 'globalize';

// Class component - can have state
// Can only return a single node
// - Remember that it is ~ return React.createElement('h1', null, 'Hello'); -- can't return two elements!
export default React.createClass({
    
    contextTypes: { flux: PropTypes.object.isRequired },
    
    componentDidMount: function() {
        gapi.signin2.render('hh-signin2', {
            'scope': 'https://www.googleapis.com/auth/plus.login',
            'width': 200,
            'height': 50,
            'longtitle': true,
            'theme': 'dark',
            'onsuccess': this.onSignIn
        });
    },
    
    render() {
      return (
        <div id="mainContainer">
          <section className="mainSignIn">
            <h2 className="mainMessage">{Globalize.formatMessage('login-main-message')}</h2>
            <ul className="signInContainer">
              <li className="signInText">
                  <p>{Globalize.formatMessage('login-get-started')}</p>
                  <h2>{Globalize.formatMessage('login-signin')}</h2>
                </li>
                <li className="signInButton">
                  <button className="g-signin2" id="hh-signin2" height="38" width="200" alt="Sign in with Google"></button>
                </li>
                <li className="signInNewUser">
                  <strong>{Globalize.formatMessage('login-new-user')}</strong>
                    <p>{Globalize.formatMessage('login-new-user-message')}</p>
                </li>
            </ul>
          </section>
          <section className="stepsStory">
            <h3>{Globalize.formatMessage('login-steps-main')}</h3>
              <p className="subHeading">{Globalize.formatMessage('login-steps-sub')}</p>
              <ul className="easySteps">
                <li>
                    <strong className="numBG">1</strong>
                    <img src="images/addData.png" width="165" height="105" alt="Add Data" />
                      <h4>{Globalize.formatMessage('login-steps-add')}</h4>
                  </li>
                  <li>
                    <strong className="numBG">2</strong>
                      <img src="images/submitData.png" width="165" height="105" alt="Submit Data" />
                      <h4>{Globalize.formatMessage('login-steps-submit')}</h4>
                  </li>
                  <li>
                    <strong className="numBG">3</strong>
                      <img src="images/trackData.png" width="165" height="105" alt="Track Data" />
                      <h4>{Globalize.formatMessage('login-steps-track')}</h4>
                  </li>
              </ul>
              <div className="healthHeroStory">
                  <h5>{Globalize.formatMessage('login-story-main')}</h5>
                  <p>{Globalize.formatMessage('login-story-sub')}</p>
              </div>
          </section>
        </div>
      );
    },
    
    onSignIn(googleUser) {
        const { flux } = this.context;
        let googleAuthResponse = googleUser.getAuthResponse();
        flux.getActions('auth').submitLogin(googleAuthResponse);
    }
})