import moment from 'moment';
import React, {PropTypes} from 'react';
import Globalize from 'globalize';
import Immutable from 'immutable';

export default React.createClass({

  contextTypes: { flux: PropTypes.object.isRequired },

  behaviorKey: "sleep-tracker",

  componentWillMount() {
    const { flux } = this.context;
    flux.getActions('healthBehaviors').findHealthBehavior(this.behaviorKey, this.props.selectedDate);
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
    
    //this.setState({selectedDate: state.get('selectedDate')});
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
      && start.isBefore(end);
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

  parseTimeString(time) {
    return time === '' ? null : moment(time, ['HH:mm']);
  },

  getData(healthBehavior) {
    return healthBehavior.get('data') ||
      Immutable.Map({
        start: null,
        end: null
      });
  },

  updateBedTime(event) {
    let val = event.currentTarget.value;
    let date = this.parseTimeString(val);
    if (date.hour() >= 12) {
      date.subtract(1, 'days');
    }
    const currentHealthBehavior = this.state.currentHealthBehavior;
    const data = this.getData(currentHealthBehavior)
      .set('start', date);
    const canSubmit = this._getCanSubmit(data);

    this.setState({
      currentHealthBehavior: currentHealthBehavior.set('data', data),
      canSubmit: canSubmit
    });
    
    const { flux } = this.context;
    flux.getActions('submit').allowSubmit({component: this.behaviorKey, canSubmit: canSubmit});
  },

  updateWakeTime(event) {
    let val = event.currentTarget.value;
    let date = this.parseTimeString(val);
    const currentHealthBehavior = this.state.currentHealthBehavior;
    const data = this.getData(currentHealthBehavior)
      .set('end', date);
    const canSubmit = this._getCanSubmit(data);
    
    this.setState({
      currentHealthBehavior: currentHealthBehavior.set('data', data),
      canSubmit: canSubmit
    });
    
    const { flux } = this.context;
    flux.getActions('submit').allowSubmit({component: this.behaviorKey, canSubmit: canSubmit});
  },

  render() {
    const currentHealthBehavior = this.state.currentHealthBehavior;
    const data = this.getData(currentHealthBehavior);
    
    let start = moment(data.get('start'));
    let end = moment(data.get('end'));
    let totalHours = this.state.canSubmit
      ? moment.duration(end.diff(start)).asHours()
      : null;

    let startDisplay = start.isValid() ? start.format('HH:mm') : null;
    let endDisplay = end.isValid() ? end.format('HH:mm') : null;

    return (
      <div>
        <div>
          <span align="left">1</span>
          <div align="center">
            <span>{Globalize.formatMessage('sleeptracker-time-title')}</span>
            <br/>
            <span>{Globalize.formatMessage('sleeptracker-time-subtitle')}</span>
          </div>
        </div>

        <div align="center">
          <div>
            <span align="left">
              <span>{Globalize.formatMessage('sleeptracker-time-start')}</span>
            </span>
              <input type="time" value={startDisplay} onChange={this.updateBedTime} />
          </div>
          <div>
            <span align="left">
              <span>{Globalize.formatMessage('sleeptracker-time-end')}</span>
            </span>
              <input type="time" value={endDisplay} onChange={this.updateWakeTime} />
          </div>
        </div>

        <div align="right">
          <span>{Globalize.formatMessage('sleeptracker-time-amount')}</span>
          <br/>
          <span>{totalHours}</span>
          <br/>
          <span>{Globalize.formatMessage('sleeptracker-time-unit')}</span>
        </div>
      </div>
    );
  }
});