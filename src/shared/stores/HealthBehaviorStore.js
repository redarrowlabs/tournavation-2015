import alt from '../instance-alt';
import Immutable from 'immutable';
import HealthBehaviorActions from '../actions/HealthBehaviorActions'

class HealthBehaviorStore{
	constructor() {
		this.currentHealthBehavior = Immutable.Map({
			id: null,
			start: null,
			end: null
		});
		this.healthBehaviors = new Immutable.List([]);

		let { fetchAllHealthBehaviors, fetchHealthBehavior, submitHealthBehavior, updateHealthBehavior, updateAllHealthBehaviors } = HealthBehaviorActions;
		this.bindListeners({
			handleFetchAllHealthBehaviors: fetchAllHealthBehaviors,
			handleFetchHealthBehavior: fetchHealthBehavior,
			handleSubmitHealthBehavior: submitHealthBehavior,
			handleUpdateHealthBehavior: updateHealthBehavior,
			handleUpdateAllHealthBehaviors: updateAllHealthBehaviors
		});
	}

	handleFetchAllHealthBehaviors() {
		this.setState({ healthBehaviors: new Immutable.List([]) });
	}

	handleFetchHealthBehavior() {
		this.setState({
			currentHealthBehavior: Immutable.Map({
				id: null,
				start: null,
				end: null
			})
		});
	}

	handleSubmitHealthBehavior(payload) {
		this.setState({
			currentHealthBehavior: Immutable.Map({
				id: null,
				start: null,
				end: null
			})
		});
	}

	handleUpdateHealthBehavior(payload) {
		let currentHealthBehavior = Immutable.Map({
			start: payload.start,
			end: payload.end,
			id: payload.id
		});

		this.setState({ currentHealthBehavior });
	}

	handleUpdateAllHealthBehaviors(payload) {
		this.setState({ healthBehaviors: new Immutable.List(payload) });
	}
};

export default alt.createStore(HealthBehaviorStore, 'HealthBehaviorStore');