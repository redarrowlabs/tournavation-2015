import React, {PropTypes} from 'react';
import HealthBehaviorStore from '../stores/HealthBehaviorStore';
import HealthBehaviorAction from '../actions/HealthBehaviorActions';

export default React.createClass({

  propTypes: { selectedDate: PropTypes.number.isRequired },

  componentDidMount() {
    HealthBehaviorStore.listen(this.stateChanged);
    HealthBehaviorAction.fetchHealthBehavior(this.props.selectedDate);
  },

  componentWillUnmount() {
    HealthBehaviorStore.unlisten(this.stateChanged);
  },

  stateChanged(state) {
    this.setState(state.currentHealthBehavior);
  },

  getInitialState() {
    return {
      currentHealthBehavior: HealthBehaviorStore.getState().currentHealthBehavior,
      behaviorDate: new Date(),
    };
	},

  handleSubmit() {
    if (this.state.id) {
      HealthBehaviorAction.updateHealthBehavior({
        id: this.state.id,
        start: this.state.start,
        end: this.state.end,
        date: this.state.behaviorDate,
      });
    } else {
      HealthBehaviorAction.submitHealthBehavior({
        start: this.state.start,
        end: this.state.end,
        date: this.state.behaviorDate,
      });
    }
  },

  updateBedTime(event) {
  	this.setState({ start: event.target.value });
  },

  updateWakeTime(event) {
  	this.setState({ end: event.target.value });
  },

  updateWakeDate(event) {
    this.setState({behaviorDate: new Date(event.target.value)});
  },

  toDateInputValue(date) {
    return date.toJSON().slice(0,10);
  },

  render() {
    return (
    	<div>
    		<span>Track sleep</span>
        <input type="text" placeholder="bedtime" ref="start-input" value={this.state.start} onChange={this.updateBedTime} />
    		<input type="text" placeholder="wake time" ref="end-input"  value={this.state.end} onChange={this.updateWakeTime} />
        <br />
        <span>Wake Date:</span>
        <input type="Date" ref="wakeDate" max={this.toDateInputValue(new Date())} value={this.toDateInputValue(this.state.behaviorDate)} onChange={this.updateWakeDate} />
    	  <input type="submit" value="OK!" onClick={this.handleSubmit} />
    	</div>
  	);
  }
});
