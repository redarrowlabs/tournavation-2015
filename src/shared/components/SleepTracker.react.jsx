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
      currentHealthBehavior: HealthBehaviorStore.getState().currentHealthBehavior
    };
	},

  handleSubmit() {
    if (this.state.id) {
      HealthBehaviorAction.updateHealthBehavior({
        id: this.state.id,
        start: this.state.start,
        end: this.state.end
      });
    } else {
      HealthBehaviorAction.submitHealthBehavior({
        start: this.state.start,
        end: this.state.end
      });
    }
  },

  updateBedTime(event) {
  	this.setState({ start: event.target.value });
  },

  updateWakeTime(event) {
  	this.setState({ end: event.target.value });
  },

  render() {
    return (
    	<div>
    		<span>Track sleep</span>
    		<input type="text" placeholder="bedtime" ref="start-input" value={this.state.start} onChange={this.updateBedTime} />
    		<input type="text" placeholder="wake time" ref="end-input"  value={this.state.end} onChange={this.updateWakeTime} />
        <input type="submit" value="OK!" onClick={this.handleSubmit} />
    	</div>
  	);
  }
});