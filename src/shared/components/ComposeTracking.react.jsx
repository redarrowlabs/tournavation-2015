import moment from 'moment';
import React, {PropTypes} from 'react';
import Globalize from 'globalize';
import SleepTracker from "./SleepTracker.react";
import AlertnessTracker from "./AlertnessTracker.react";

export default React.createClass({

  contextTypes: { flux: PropTypes.object.isRequired },

  componentWillMount() {
    const { flux } = this.context;
  },

  componentDidMount() {
    const { flux } = this.context;
    flux.getStore('submit').listen(this.submitStateChanged);
    flux.getStore('date').listen(this.dateStateChanged);
  },

  componentWillUnmount() {
    const { flux } = this.context;
    flux.getStore('submit').unlisten(this.submitStateChanged);
    flux.getStore('date').unlisten(this.dateStateChanged);
  },

  submitStateChanged(state) {
    this.setState(this.getStateFromSubmitStore());
  },

  dateStateChanged(state) {
    this.setState(this.getStateFromDateStore());
  },

  getInitialState() {
    return {
      canSubmit: this.getStateFromSubmitStore().canSubmit,
      selectedDate: this.getStateFromDateStore().selectedDate
    };
  },

  getStateFromSubmitStore() {
    const { flux } = this.context;

    let components = flux.getStore('submit').getState().get('submittableComponents');
    let canSubmit = false;
    for (let key of components.keys()) {
      if (components.has(key) && components.get(key).get('canSubmit')) {
        canSubmit = true;
        break;
      }
    }

    return {
      canSubmit: canSubmit
    };    
  },

  getStateFromDateStore() {
    const { flux } = this.context;
    let date = flux.getStore('date').getState().get('selectedDate');

    return {
      selectedDate: moment(date)
    };    
  },

  render() {
    let isDisabled = !this.state.canSubmit;
    this.trackers = [];

    let dateDisplay = this.state.selectedDate.format('YYYY-MM-DD');
    let maxDate = moment().startOf('day').format('YYYY-MM-DD');

    return (
      <div>
        <input type="date" value={dateDisplay} max={maxDate} onChange={this.updateDate} />

        <SleepTracker ref={ (ref) => {if (ref !== null ) this.trackers.push(ref);} } />
        <AlertnessTracker ref={ (ref) => {if (ref !== null ) this.trackers.push(ref);} } />

        <input type="submit" value={Globalize.formatMessage('sleeptracker-submit')} onClick={this.handleSubmit} disabled={isDisabled}/>
      </div>
    );
  },

  _parseDateString(date) {
    return date === '' ? moment().startOf('day') : moment(date, ['YYYY-MM-DD']);
  },

  updateDate(event) {
    let val = event.currentTarget.value;
    let moment = this._parseDateString(val);

    const { flux } = this.context;
    flux.getActions('date').setSelectedDate(moment);
  },

  handleSubmit() {
    if (!this.state.canSubmit) { return; }

    for (let tracker of this.trackers) {
      if (tracker.canSubmit()) {
        tracker.doSubmit();
      }
    }
  }
});