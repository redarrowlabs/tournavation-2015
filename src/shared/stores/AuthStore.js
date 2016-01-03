import Immutable from 'immutable';
import AuthActions from '../actions/AuthActions'

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