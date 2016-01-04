import Immutable from 'immutable';

class AuthStore{
	constructor() {
		this.currentUser = Immutable.Map({
			idToken: null,
		});
        this.bindActions(this.alt.getActions('auth'));
	}

    onSetUserLogin(idToken) {
		this.setState({ 
            currentUser: new Immutable.Map({
                idToken: idToken
            })
        });
	}
};

export default AuthStore;