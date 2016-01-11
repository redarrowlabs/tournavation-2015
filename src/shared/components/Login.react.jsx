import React, {PropTypes} from "react";
import { Router, Route, Link } from 'react-router';
import AuthStore from '../stores/AuthStore';

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
        const { flux } = this.context;
        flux.getStore('auth').listen(this.stateChanged);
    },

    stateChanged(state) {

    },

    render() {
        return (
        <div>
            <header id="navigation">
            <nav>
                <label>HealthHeros</label>
                
            </nav>
            </header>
            <div className="login-containter">
                <p>Get Started | Check Progress</p>
                <h1>Sign In Today</h1>
                <br />
                <hr />
                <button className="g-signin2" id="hh-signin2"></button>
                <a href="#" onClick={this.signOut}>Sign out</a>
            </div>
        </div>
        );
    },
    
    onSignIn(googleUser) {
        const { flux } = this.context;
        var idToken = googleUser.getAuthResponse().id_token;
        flux.getActions('auth').setUserLogin(idToken);
        window.location.href = '/track'
    },
    
    signOut() {
        var auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function () {
            console.log('User signed out.');
        });
    }
})