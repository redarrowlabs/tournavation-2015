import Immutable from 'immutable';
var immutableAlt = require('alt-utils/lib/ImmutableUtil');

@immutableAlt
class SubmitStore{
	displayName = 'SubmitStore';

	constructor() {
		this.bindActions(this.alt.getActions('submit'));

		this.state = Immutable.Map({
			submittableComponents: Immutable.Map(),
			doSubmit: false
		});
	}

	submitStateFor(component) {
		return this.state.get('submittableComponents').get(component) ||
			Immutable.Map({
				canSubmit: false,
				isSubmitted: true,
			});
	}

	onAllowSubmit(payload) {
		let componentState = this.submitStateFor(payload.component)
			.set('canSubmit', payload.canSubmit);

  	this.setState(this.state.set('submittableComponents',
  		this.state.get('submittableComponents')
  			.set(payload.component, componentState)));
	}

	onDidSubmit(payload) {
  	let components = this.state.get('submittableComponents');
		components = components.set(payload.component,
			components.get(payload.component)
				.set('isSubmitted', true));

		let doSubmit = false;
		for (let key of components.keys()) {
			if (!components.get(key).get('isSubmitted')) {
				doSubmit = true;
				break;
			}
		}

		this.setState(this.state
			.set('submittableComponents', components)
  		.set('doSubmit', doSubmit));
	}
};

export default SubmitStore;