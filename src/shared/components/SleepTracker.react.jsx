import moment from 'moment';
import React, {PropTypes} from 'react';

var DateTimePicker = require('react-widgets/lib/DateTimePicker');

export default React.createClass({

  contextTypes: { flux: PropTypes.object.isRequired },
  //propTypes: { selectedDate: PropTypes.number.isRequired },

  componentDidMount() {
    const { flux } = this.context;
    flux.getStore('healthBehaviors').listen(this.stateChanged);
    flux.getActions('healthBehaviors').fetchHealthBehavior(this.props.selectedDate);
  },

  componentWillUnmount() {
    const { flux } = this.context;
    flux.getStore('healthBehaviors').unlisten(this.stateChanged);
  },

  stateChanged(state) {
    this.setState(state.currentHealthBehavior);
  },

  getInitialState() {
    const { flux } = this.context;
    return {
      currentHealthBehavior: flux.getStore('healthBehaviors').getState().currentHealthBehavior
    };
  },

  handleSubmit() {
    const { flux } = this.context;
    
    if (this.state.id) {
      flux.getActions('healthBehaviors').updateHealthBehavior({
        id: this.state.id,
        start: this.state.start,
        end: this.state.end
      });
    } else {
      flux.getActions('healthBehaviors').submitHealthBehavior({
        start: this.state.start,
        end: this.state.end
      });
    }
  },

  updateBedTime(date, dateStr) {
    this.setState({ start: moment(date) });
  },

  updateWakeTime(date, dateStr) {
    this.setState({ end: moment(date) });
  },

  render() {
    let totalHours = (this.state.end && this.state.start)
      ? moment.duration(this.state.end.diff(this.state.start)).asHours()
      : null;

    return (
      <div>
        <span>Track sleep</span>
        <DateTimePicker calendar={false}
          timeFormate={"h:mm tt"}
          value={this.state.start}
          onChange={this.updateBedTime} />
        <DateTimePicker calendar={false}
          timeFormate={"h:mm tt"}
          value={this.state.end}
          onChange={this.updateWakeTime} />
        <input type="submit" value="OK!" onClick={this.handleSubmit} />
        <span>{totalHours}</span>
      </div>
    );
  }
});