import Immutable from 'immutable';
import immutableAlt from 'alt-utils/lib/ImmutableUtil';

@immutableAlt
class AuthStore {
	constructor() {
    this.bindActions(this.alt.getActions('auth'));
    
    this.state = Immutable.Map({
			isAuthenticated: false,
      userName: null
		});
	}

  onSetUser(user) {
    this.setState(this.state
      .set('userName', (user||{}).userName)
      .set('isAuthenticated', (user||{}).isAuthenticated));
  }
};

export default AuthStore;