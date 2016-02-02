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

    const dateDisplay = this.state.selectedDate.format('YYYY-MM-DD');
    const maxDate = moment().startOf('day').format('YYYY-MM-DD');

    const bedtimeDisplay = moment(this.state.selectedDate).subtract(1, 'days').format("ddd MMM D");
    const waketimeDisplay = this.state.selectedDate.format("ddd MMM D");
    const sleepTrackerSubtitle = Globalize.formatMessage('sleeptracker-time-subtitle', bedtimeDisplay, waketimeDisplay);
    const titleHtml = {__html: sleepTrackerSubtitle};

    return (
      <aside className="sleepAlertness">
        <ul>
          <li className="alertnessLevel">
            <strong className="numBG">1</strong>
            <div className="headerContainer">
                <h2>{Globalize.formatMessage('alertnesstracker-level-title')}</h2>
                <h3>{Globalize.formatMessage('app-day-header')} <input type="date" value={dateDisplay} max={maxDate} onChange={this.updateDate} /></h3>
            </div>
            <AlertnessTracker ref={ (ref) => {if (ref !== null ) this.trackers.push(ref);} } />
          </li>
          <li className="recordSleep">
              <strong className="numBG">2</strong>
              <div className="headerContainer">
                  <h2>{Globalize.formatMessage('sleeptracker-time-title')}</h2>
                  <h3  dangerouslySetInnerHTML={titleHtml}></h3>
              </div>
              <SleepTracker ref={ (ref) => {if (ref !== null ) this.trackers.push(ref);} } />
          </li>
          <li>
            <div>
              <button className="graphData" onClick={this.handleSubmit} disabled={isDisabled}>{Globalize.formatMessage('app-submit')}</button>
            </div>
          </li>            
        </ul>
      </aside>
    );
  },

  _parseDateString(date) {
    return date === '' ? moment().startOf('day') : moment(date, ['YYYY-MM-DD']);
  },

  updateDate(event) {
    let val = event.currentTarget.value;
    let selectedDate = this._parseDateString(val);
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