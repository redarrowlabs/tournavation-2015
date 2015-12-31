import Immutable from 'immutable';
var immutableAlt = require('alt-utils/lib/ImmutableUtil');

@immutableAlt
class HealthBehaviorStore{
	displayName = 'HealthBehaviorStore'

	constructor() {
		this.bindActions(this.alt.getActions('healthBehaviors'));

		this.state = Immutable.Map({
			healthBehaviors: new Immutable.List([]),
			currentHealthBehavior: Immutable.Map({
				id: null,
				start: null,
				end: null
			})
		});
	}

	onFetchAllHealthBehaviors() {
  	this.setState(
  		this.state.set('healthBehaviors',
  			this.state.get('healthBehaviors').clear()));
		//this.setState({ healthBehaviors: new Immutable.List([]) });
	}

	onFetchHealthBehavior() {
		this.setState(
  		this.state.set('currentHealthBehavior',
  			this.state.get('currentHealthBehavior').clear()));
		/*this.setState({
			currentHealthBehavior: Immutable.Map({
				id: null,
				start: null,
				end: null
			})
		});*/
	}

	onSubmitHealthBehavior(payload) {
		this.setState(
  		this.state.set('currentHealthBehavior',
  			this.state.get('currentHealthBehavior').clear()));
		/*this.setState({
			currentHealthBehavior: Immutable.Map({
				id: null,
				start: null,
				end: null
			})
		});*/
	}

	onUpdateHealthBehavior(payload) {
		this.setState(
  		this.state.set('currentHealthBehavior',
  			Immutable.fromJS(payload)));
		/*let currentHealthBehavior = Immutable.Map({
			start: payload.start,
			end: payload.end,
			id: payload.id
		});

		this.setState({ currentHealthBehavior });*/
	}

	onUpdateAllHealthBehaviors(payload) {
		this.setState(
  		this.state.set('healthBehaviors',
  			Immutable.fromJS(payload)));
		//this.setState({ healthBehaviors: new Immutable.List(payload) });
	}
};

export default HealthBehaviorStore;