import moment from 'moment';
import React, {PropTypes} from 'react';
import Globalize from 'globalize';
import SleepTracker from "./SleepTracker.react";
import AlertnessTracker from "./AlertnessTracker.react";
import DateTimePicker from 'react-widgets/lib/DateTimePicker';

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
    let canSubmit = true;
    for (let key of components.keys()) {
      if (!components.has(key) || !components.get(key).get('canSubmit')) {
        canSubmit = false;
        break;
      }
    }

    return {
      canSubmit: canSubmit
    };    
  },

  getStateFromDateStore() {
    const { flux } = this.context;
    const date = flux.getStore('date').getState().get('selectedDate');

    return {
      selectedDate: moment(date)
    };    
  },

  render() {
    const isDisabled = !this.state.canSubmit;
    this.trackers = [];

    const date = this.state.selectedDate;
    const maxDate = moment().startOf('day').toDate();
    const dateFormat = date.isSame(maxDate, 'days') ? '[today]' : 'ddd MMM D';

    let bedtimeDisplay = moment(this.state.selectedDate).subtract(1, 'days').format("ddd");
    bedtimeDisplay = Globalize.formatMessage('sleeptracker-time-bed', bedtimeDisplay);

    let waketimeDisplay = moment(this.state.selectedDate).format("ddd");
    waketimeDisplay = Globalize.formatMessage('sleeptracker-time-wake', waketimeDisplay);

    return (
      <aside className="sleepAlertness">
        <ul>
          <li className="alertnessLevel">
            <strong className="numBG">1</strong>
            <div className="headerContainer">
                <h2>{Globalize.formatMessage('alertnesstracker-level-title')}</h2>
                <div className="calenderContainer"><p><strong>{Globalize.formatMessage('tracker-day-header')}</strong></p> <DateTimePicker time={false} format={dateFormat} value={date.toDate()} max={maxDate} onChange={this.updateDate} /></div>
            </div>
            <AlertnessTracker ref={ (ref) => {if (ref !== null ) this.trackers.push(ref);} } />
          </li>
          <li className="recordSleep">
              <strong className="numBG">2</strong>
              <div className="headerContainer">
                  <h2>{Globalize.formatMessage('sleeptracker-time-title')}</h2>
                  <ul className="sleepTime">
                    <li className="bedtime">{bedtimeDisplay}</li>
                    <li className="wakeup">{waketimeDisplay}</li>
                  </ul>
              </div>
              <SleepTracker ref={ (ref) => {if (ref !== null ) this.trackers.push(ref);} } />
          </li>
          <li className="graph">
            <div>
              <button className="graphData" onClick={this.handleSubmit} disabled={isDisabled}>{Globalize.formatMessage('tracker-submit')}</button>
            </div>
          </li>            
        </ul>
      </aside>
    );
  },

  _parseDateString(date) {
    return date === '' ? moment().startOf('day') : moment(date, ['YYYY-MM-DD']);
  },

  updateDate(date, dateStr) {
    let selectedDate = moment(date);
    if (selectedDate.isAfter(moment().startOf('day'))) {
      selectedDate = moment().startOf('day');
    }

    const { flux } = this.context;
    flux.getActions('date').setSelectedDate(selectedDate);
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