import moment from 'moment';
import React, {PropTypes} from 'react';
import Globalize from 'globalize';
import Immutable from 'immutable';

//import 'react-widgets/lib/less/react-widgets.less';
import { DateTimePicker } from 'react-widgets';

export default React.createClass({

  contextTypes: { flux: PropTypes.object.isRequired },

  behaviorKey: "sleep-tracker",

  componentWillMount() {
    const { flux } = this.context;
    flux.getActions('healthBehaviors').findHealthBehavior(this.behaviorKey, this.state.selectedDate);
    flux.getActions('submit').allowSubmit({component: this.behaviorKey, canSubmit: this.state.canSubmit});
  },

  componentDidMount() {
    const { flux } = this.context;
    flux.getStore('healthBehaviors').listen(this.healthBehaviorStateChanged);
    flux.getStore('date').listen(this.dateStateChanged);
  },

  componentWillUnmount() {
    const { flux } = this.context;
    flux.getStore('healthBehaviors').unlisten(this.healthBehaviorStateChanged);
    flux.getStore('date').unlisten(this.dateStateChanged);
  },

  healthBehaviorStateChanged(state) {
    this.setState(this.getStateFromStore());
  },

  dateStateChanged(state) {
    const { flux } = this.context;
    flux.getActions('healthBehaviors').findHealthBehavior(this.behaviorKey, state.get('selectedDate'));
  },

  getInitialState() {
    return this.getStateFromStore();
  },

  getStateFromStore() {
    const { flux } = this.context;
    const selectedDate = flux.getStore('date').getState().get('selectedDate');
    const currentHealthBehavior = flux.getStore('healthBehaviors').getState().get('currentHealthBehaviors').get(this.behaviorKey)
      || new Immutable.Map({
        _id: null,
        key: this.behaviorKey,
        filter: selectedDate,
        data: new Immutable.Map({
          start: null,
          end: null
        })
      });    

    return {
      currentHealthBehavior: currentHealthBehavior,
      canSubmit: this._getCanSubmit(currentHealthBehavior.get('data')),
      selectedDate: selectedDate
    };
  },

  _getCanSubmit(data) {
    let start = data.get('start');
    let end = data.get('end');
    return start !== null && moment(start).isValid()
      && end !== null && moment(end).isValid()
      && moment(start).isBefore(moment(end));
  },

  canSubmit() {
    return this.state.canSubmit;
  },

  doSubmit() {
    const { flux } = this.context;
    const currentHealthBehavior = this.state.currentHealthBehavior;

    if (currentHealthBehavior.get('_id')) {
      flux.getActions('healthBehaviors').updateHealthBehavior(currentHealthBehavior);
    } else {
      flux.getActions('healthBehaviors').submitHealthBehavior(currentHealthBehavior);
    }

    flux.getActions('submit').didSubmit({component: this.behaviorKey});
  },

  getData(healthBehavior) {
    return healthBehavior.get('data') ||
      Immutable.Map({
        start: null,
        end: null
      });
  },

  updateBedTime(date, dateStr) {
    const start = moment(dateStr, 'hh:mm a');
    const currentHealthBehavior = this.state.currentHealthBehavior;
    let data = this.getData(currentHealthBehavior)
      .set('start', start);
    data = this._adjustTime(data);
    const canSubmit = this._getCanSubmit(data);

    this.setState({
      currentHealthBehavior: currentHealthBehavior.set('data', data),
      canSubmit: canSubmit
    });
    
    const { flux } = this.context;
    flux.getActions('submit').allowSubmit({component: this.behaviorKey, canSubmit: canSubmit});
  },

  updateWakeTime(date, dateStr) {
    let end = moment(dateStr, 'hh:mm a');
    const currentHealthBehavior = this.state.currentHealthBehavior;
    let data = this.getData(currentHealthBehavior)
      .set('end', end);
    data = this._adjustTime(data);
    const canSubmit = this._getCanSubmit(data);
    
    this.setState({
      currentHealthBehavior: currentHealthBehavior.set('data', data),
      canSubmit: canSubmit
    });
    
    const { flux } = this.context;
    flux.getActions('submit').allowSubmit({component: this.behaviorKey, canSubmit: canSubmit});
  },

  _adjustTime(data) {
    let start = moment(data.get('start'));
    let end = moment(data.get('end'));
    let newStart = moment().startOf('day');
    newStart.hour(start.hour());
    newStart.minute(start.minute());

    if (start != null && end != null
      && (start.hour() > end.hour() || (start.hour() === end.hour() && start.minute() > end.minute()))) {
      newStart.subtract(1, 'days');
    }
      start = newStart;

    return data.set('start', start);
  },

  render() {
    const currentHealthBehavior = this.state.currentHealthBehavior;
    const data = this.getData(currentHealthBehavior);
    
    let start = moment(data.get('start'));
    let end = moment(data.get('end'));
    let totalTime = this.state.canSubmit
      ? moment.duration(end.diff(start))
      : null;
    let totalHours = totalTime ? totalTime.get('hours') : null;
    let totalMinutes = totalTime ? totalTime.get('minutes') : null;
    totalMinutes = totalMinutes != null && totalMinutes < 10 ? '0' + totalMinutes : totalMinutes;
    let divider = totalTime ? Globalize.formatMessage('sleeptracker-time-unit-divider') : null;

    return (
      <li className="recordSleep">
          <strong className="numBG">1</strong>
          <div className="headerContainer">
              <h2>{Globalize.formatMessage('sleeptracker-time-title')}</h2>
              <h3>{Globalize.formatMessage('sleeptracker-time-subtitle')}</h3>
          </div>
          <ul>
              <li>
                  <img src="images/eveningWentToBed.png" width="87" height="50" alt="{Globalize.formatMessage('sleeptracker-time-start')}" />
                  <DateTimePicker className="sleepTime" calendar={false} format="hh:mm a" defaultValue={start.isValid() ? start.toDate() : null} onChange={this.updateBedTime} />
              </li>
              <li>
                  <img src="images/morningWokeUp.png" width="87" height="50" alt="{Globalize.formatMessage('sleeptracker-time-end')}" />
                  <DateTimePicker className="sleepTime" calendar={false} format="hh:mm a" defaultValue={end.isValid() ? end.toDate() : null} onChange={this.updateWakeTime} />
              </li>
              <li className="hoursSlept">
                  <p>{Globalize.formatMessage('sleeptracker-time-amount')}</p>
                  <p><strong>{totalHours}{divider}{totalMinutes}</strong>{Globalize.formatMessage('sleeptracker-time-unit')}</p>
              </li>
          </ul>           
      </li>
    );
  }
});