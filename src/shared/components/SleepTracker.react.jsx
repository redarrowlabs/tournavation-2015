import moment from 'moment';
import React, {PropTypes} from 'react';
import Globalize from 'globalize';
import Immutable from 'immutable';

export default React.createClass({

  contextTypes: { flux: PropTypes.object.isRequired },
  //propTypes: { selectedDate: PropTypes.number.isRequired },

  componentWillMount() {
    const { flux } = this.context;
    flux.getActions('healthBehaviors').fetchHealthBehavior(this.props.selectedDate);
  },

  componentDidMount() {
    const { flux } = this.context;
    flux.getStore('healthBehaviors').listen(this.stateChanged);
  },

  componentWillUnmount() {
    const { flux } = this.context;
    flux.getStore('healthBehaviors').unlisten(this.stateChanged);
  },

  stateChanged(state) {
    this.setState(state.get('currentHealthBehavior'));
  },

  getInitialState() {
    const { flux } = this.context;
    const currentHealthBehavior = flux.getStore('healthBehaviors').getState().get('currentHealthBehavior');
    return {
      currentHealthBehavior
    };
  },

  handleSubmit() {
    const { flux } = this.context;
    const currentHealthBehavior = this.state.currentHealthBehavior;
    
    if (this.state.currentHealthBehavior.get('id')) {
      flux.getActions('healthBehaviors').updateHealthBehavior({
        id: currentHealthBehavior.get('id'),
        start: currentHealthBehavior.get('start'),
        end: currentHealthBehavior.get('end')
      });
    } else {
      flux.getActions('healthBehaviors').submitHealthBehavior({
        start: currentHealthBehavior.get('start'),
        end: currentHealthBehavior.get('end')
      });
    }
  },

  parseTimeString(time) {
    return moment(time, ['HH:mm']);
  },

  updateBedTime(event) {
    let val = event.currentTarget.value;
    let date = this.parseTimeString(val);
    date.subtract(1, 'days');
    const currentHealthBehavior = this.state.currentHealthBehavior;
    
    this.setState({
      currentHealthBehavior: Immutable.Map({
        id: currentHealthBehavior.get('id'),
        start: date,
        end: currentHealthBehavior.get('end')
      })
    });
  },

  updateWakeTime(event) {
    let val = event.currentTarget.value;
    let date = this.parseTimeString(val);
    const currentHealthBehavior = this.state.currentHealthBehavior;
    
    this.setState({
      currentHealthBehavior: Immutable.Map({
        id: currentHealthBehavior.get('id'),
        start: currentHealthBehavior.get('start'),
        end: date
      })
    });
  },

  render() {
    const currentHealthBehavior = this.state.currentHealthBehavior;
    let start = currentHealthBehavior.get('start');
    let end = currentHealthBehavior.get('end');
    let totalHours = (end && start)
      ? moment.duration(end.diff(start)).asHours()
      : null;

    let startDisplay = start ? start.format('HH:mm') : null;
    let endDisplay = end ? end.format('HH:mm') : null;

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

        <input type="submit" value={Globalize.formatMessage('sleeptracker-submit')} onClick={this.handleSubmit} />

      </div>
    );
  }
});