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
            <div className="login-containter">
                <h1>Sign In Today</h1>
                <br />
                <hr />
                <button className="g-signin2" id="hh-signin2"></button>
            </div>
        </div>
        );
    },
    
    onSignIn(googleUser) {
        const { flux } = this.context;
        let googleAuthResponse = googleUser.getAuthResponse();
        flux.getActions('auth').submitLogin(googleAuthResponse);
    }
})