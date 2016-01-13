import Immutable from 'immutable';

class AuthStore {
	constructor() {
        this.bindActions(this.alt.getActions('auth'));
	}

    onSetLogin(payload) {
		this.setState(Immutable.fromJS(payload));
	}
};

export default AuthStore;