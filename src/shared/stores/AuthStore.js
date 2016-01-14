import Immutable from 'immutable';

class AuthStore {
	constructor() {
        this.bindActions(this.alt.getActions('auth'));
        
        this.state = Immutable.Map({
			isAuthenticated: false
		});
	}

    onSetIsAuthenticated(isAuthenticated) {
		this.setState(Immutable.Map({
			isAuthenticated
		}));
	}
};

export default AuthStore;