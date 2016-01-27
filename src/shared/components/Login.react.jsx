import React, {PropTypes} from "react";
import { Router, Route, Link } from 'react-router';

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
        <div>
          <section className="mainSignIn">
            <h2 className="mainMessage">Get Healthier With HealthHero!</h2>
            <ul className="signInContainer">
                <li className="signInText">
                    <p>Get Started &#124; Check progress</p>
                    <h2>Sign In Today</h2>
                </li>
                <li className="signInButton">
                  <button className="g-signin2" id="hh-signin2"></button>
                </li>
                <li className="signInNewUser">
                    <strong>New User?</strong>
                    <p>Simply sign in using an existing google account.</p>
                </li>
            </ul>
          </section>
          <section className="stepsStory">
            <h3>HealthHero helps you learn and get healthier in 3 easy steps</h3>
              <p className="subHeading">Add, submit, and track to see what you could do to be healthier!</p>
              <ul className="easySteps">
                <li>
                    <strong className="numBG">1</strong>
                    <img src="images/addData.png" width="165" height="105" alt="Add Data" />
                      <h4>Add Data</h4>
                  </li>
                  <li>
                    <strong className="numBG">2</strong>
                      <img src="images/submitData.png" width="165" height="105" alt="Submit Data" />
                      <h4>Submit Data</h4>
                  </li>
                  <li>
                    <strong className="numBG">3</strong>
                      <img src="images/trackData.png" width="165" height="105" alt="Track Data" />
                      <h4>Track Data</h4>
                  </li>
              </ul>
              <div className="healthHeroStory">
                  <h5>Health Hero Story</h5>
                  <p>Bulit by the community for the community</p>
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