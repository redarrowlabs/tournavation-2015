import Immutable from 'immutable';
var immutableAlt = require('alt-utils/lib/ImmutableUtil');
import _ from 'lodash';

@immutableAlt
class HealthBehaviorStore{
	displayName = 'HealthBehaviorStore'

	constructor() {
		this.bindActions(this.alt.getActions('healthBehaviors'));

		this.state = Immutable.Map({
			healthBehaviors: Immutable.Map(),
			currentHealthBehaviors: Immutable.Map()
		});
		/*this.state = Immutable.Map({
			healthBehaviors: new Immutable.List([]),
			currentHealthBehavior: Immutable.Map({
				_id: null,
				key: null,
				filter: null,
				data: null
			})
		});*/
	}

	/*onFetchAllHealthBehaviors(payload) {
  	this.setState(
  		this.state.set('healthBehaviors',
  			this.state.get('healthBehaviors').clear()));
	}

	onFetchHealthBehavior(payload) {
		this.setState(
  		this.state.set('currentHealthBehavior',
  			this.state.get('currentHealthBehavior').clear()));
	}

	onSubmitHealthBehavior(payload) {
		this.setState(
  		this.state.set('currentHealthBehavior',
  			this.state.get('currentHealthBehavior').clear()));
	}

	onUpdateHealthBehavior(payload) {
		this.setState(
  		this.state.set('currentHealthBehavior',
  			this.state.get('currentHealthBehavior').clear()));
	}*/

	onUpdateCurrentHealthBehavior(payload) {
		if (!payload.data) {
			console.log('*** null payload ***');
			return;
		}

		let healthBehavior = Immutable.fromJS(payload.data);
		let currentHealthBehaviors = this.state.get('currentHealthBehaviors')
		  .set(payload.key, healthBehavior);

		let healthBehaviors = this.state.get('healthBehaviors').get(payload.key);
		if (healthBehaviors) {
			let index = _.findIndex(healthBehaviors.toArray(), item => {
				return item.get('_id') === healthBehavior.get('_id');
			});
		  healthBehaviors = healthBehaviors
				.set(index, healthBehavior);
		} else {
			healthBehaviors	= new Immutable.List([healthBehavior]);
		}

		let state = this.state.set('currentHealthBehavior', currentHealthBehaviors);
		state = state.set('healthBehaviors',
		  this.state.get('healthBehaviors').set(payload.key, healthBehaviors));
		this.setState(state);
	}

	onUpdateAllHealthBehaviors(payload) {
		let state = this.state.set('healthBehaviors',
  			this.state.get('healthBehaviors')
  				.set(payload.key, Immutable.fromJS(payload)));
		this.setState(state);
	}
};

export default HealthBehaviorStore;