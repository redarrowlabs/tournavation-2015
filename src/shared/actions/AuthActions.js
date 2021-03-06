import request from 'superagent';
import Immutable from 'immutable';
import UUID from 'node-uuid';

class AuthActions {
  constructor() {
    // Add dispatch only actions
    this.generateActions(
      'setUser'
    );
  }
  
  fetchAuthStatus(id) {
    return (dispatch, alt) =>
      alt.resolve(async () => {
        var data = await alt.api.fetchAll('auth');
        alt.getActions('auth').setUser(data);
      });
  }
  
  submitLogin(googleAuthResponse) {
    return (dispatch, alt) => {
      alt.resolve(async () => {
        let data = await alt.api.create('auth', googleAuthResponse);
        alt.getActions('auth').setUser(data);
      });
    }
  }
  
  submitLogout() {
    return (dispatch, alt) =>
      alt.resolve(async () => {
        let data = request.delete(alt.api.baseUrl + 'auth').end(function(err, res){});
        alt.getActions('auth').setUser(null);
      });
  }
}

export default AuthActions;