import Immutable from 'immutable';
var immutableAlt = require('alt-utils/lib/ImmutableUtil');
import moment from 'moment';

@immutableAlt
class DateStore{
	displayName = 'DateStore';

	constructor() {
		this.bindActions(this.alt.getActions('date'));

		this.state = Immutable.Map({
			selectedDate: moment().startOf('day').valueOf()
		});
	}

	onSetSelectedDate(moment) {
  	this.setState(this.state.set('selectedDate', moment.valueOf()));
	}
};

export default DateStore;