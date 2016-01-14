import request from 'superagent';
import Immutable from 'immutable';
import UUID from 'node-uuid';

class AuthActions {
  constructor() {
    // Add dispatch only actions
    this.generateActions(
      'setIsAuthenticated'
    );
  }
    
  submitLogin(googleAuthResponse) {
    return (dispatch, alt) => {
      alt.resolve(async () => {
        let data = await alt.api.create('auth', googleAuthResponse);
        alt.getActions('auth').setIsAuthenticated(true);
      });
    }
  }
  
  submitLogout() {
    return (dispatch, alt) =>
      alt.resolve(async () => {
        let data = request.delete(alt.api.baseUrl + 'auth').end(function(err, res){});
        alt.getActions('auth').setIsAuthenticated(false);
      });
  }
}

export default AuthActions;