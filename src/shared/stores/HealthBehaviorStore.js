import Immutable from 'immutable';
var immutableAlt = require('alt-utils/lib/ImmutableUtil');
import _ from 'lodash';

@immutableAlt
class HealthBehaviorStore{
	displayName = 'HealthBehaviorStore'

	constructor() {
		this.bindActions(this.alt.getActions('healthBehaviors'));

		this.state = Immutable.Map({
			healthBehaviors: new Immutable.List([]),
			currentHealthBehavior: Immutable.Map({
				_id: null,
				key: null,
				filter: null,
				data: null
			})
		});
	}

	onFetchAllHealthBehaviors() {
  	this.setState(
  		this.state.set('healthBehaviors',
  			this.state.get('healthBehaviors').clear()));
	}

	onFetchHealthBehavior() {
		this.setState(
  		this.state.set('currentHealthBehavior',
  			this.state.get('currentHealthBehavior').clear()));
	}

	onSubmitHealthBehavior() {
		this.setState(
  		this.state.set('currentHealthBehavior',
  			this.state.get('currentHealthBehavior').clear()));
	}

	onUpdateHealthBehavior() {
		this.setState(
  		this.state.set('currentHealthBehavior',
  			this.state.get('currentHealthBehavior').clear()));
	}

	onUpdateCurrentHealthBehavior(payload) {
		let healthBehavior = payload
			? Immutable.fromJS(payload)
			: Immutable.Map({
					_id: null,
					key: null,
					filter: null,
					data: null
				});

		let index = _.findIndex(this.state.get('healthBehaviors').toArray(), item => {
			return item.get('_id') === healthBehavior.get('_id');
		});
		let healthBehaviors = this.state.get('healthBehaviors')
					.set(index, healthBehavior)

		let state = this.state.set('currentHealthBehavior', healthBehavior);
		state = state.set('healthBehaviors', healthBehaviors);
		this.setState(state);
	}

	onUpdateAllHealthBehaviors(payload) {
		let state = this.state.set('healthBehaviors',
  			Immutable.fromJS(payload));
		this.setState(state);
	}
};

export default HealthBehaviorStore;