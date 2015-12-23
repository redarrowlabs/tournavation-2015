import Immutable from 'immutable';

class HealthBehaviorStore{
	constructor() {
		this.bindActions(this.alt.getActions('healthBehaviors'));

		this.currentHealthBehavior = Immutable.Map({
			id: null,
			start: null,
			end: null
		});
		this.healthBehaviors = new Immutable.List([]);
	}

	onFetchAllHealthBehaviors() {
		this.setState({ healthBehaviors: new Immutable.List([]) });
	}

	onFetchHealthBehavior() {
		this.setState({
			currentHealthBehavior: Immutable.Map({
				id: null,
				start: null,
				end: null
			})
		});
	}

	onSubmitHealthBehavior(payload) {
		this.setState({
			currentHealthBehavior: Immutable.Map({
				id: null,
				start: null,
				end: null
			})
		});
	}

	onUpdateHealthBehavior(payload) {
		let currentHealthBehavior = Immutable.Map({
			start: payload.start,
			end: payload.end,
			id: payload.id
		});

		this.setState({ currentHealthBehavior });
	}

	onUpdateAllHealthBehaviors(payload) {
		this.setState({ healthBehaviors: new Immutable.List(payload) });
	}
};

export default HealthBehaviorStore;