import request from 'superagent';
import Immutable from 'immutable';
import UUID from 'node-uuid';
import config from '../../config'

class AuthActions {

  constructor() {
    // Add dispatch only actions
    this.generateActions(
      'setIdToken'
    );
  }

    setUserLogin(idToken) {
        return (dispatch, alt) => alt.getActions('auth').setIdToken(idToken);
    }
}

/* If your actions are as simple as just dispatching passed values, you can use a slightly different (and more concise) API for such use case:
 * export default alt.generateActions('changeContent', 'clearForm');
 */
export default AuthActions;