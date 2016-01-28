import Immutable from 'immutable';
import immutableAlt from 'alt-utils/lib/ImmutableUtil';
import _ from 'lodash';

@immutableAlt
class HealthBehaviorStore{
	displayName = 'HealthBehaviorStore';

	constructor() {
		this.bindActions(this.alt.getActions('healthBehaviors'));

		this.state = Immutable.Map({
			healthBehaviors: Immutable.Map(),
			currentHealthBehaviors: Immutable.Map()
		});
	}

	onUpdateCurrentHealthBehavior(payload) {
		if (!payload.data) {
			this.setState(this.state.set('currentHealthBehaviors',
				this.state.get('currentHealthBehaviors').set(payload.key, null)));
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
			if (index > -1) {
		  		healthBehaviors = healthBehaviors.set(index, healthBehavior);
	  	}
	  	else {
	  		healthBehaviors = healthBehaviors.push(healthBehavior);
	  	}
		} else {
			healthBehaviors	= new Immutable.List([healthBehavior]);
		}

		let state = this.state.set('currentHealthBehaviors', currentHealthBehaviors);
		state = state.set('healthBehaviors',
		  this.state.get('healthBehaviors').set(payload.key, healthBehaviors));
		this.setState(state);
	}

	onUpdateAllHealthBehaviors(payload) {
		let state = this.state.set('healthBehaviors',
  			this.state.get('healthBehaviors')
  				.set(payload.key, Immutable.fromJS(payload.data)));
		this.setState(state);
	}
};

export default HealthBehaviorStore;