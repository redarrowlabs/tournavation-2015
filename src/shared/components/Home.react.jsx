import React from "react";
import HealthBehaviorStore from '../stores/HealthBehaviorStore';
import HealthBehaviorAction from '../actions/HealthBehaviorActions';
import SleepVisualizerContainer from './SleepVisualizerContainer.react';

export default React.createClass ({

  // begin listening to store, and call initial fetch to load data
	componentDidMount() {
    HealthBehaviorStore.listen(this.stateChanged);
    HealthBehaviorAction.fetchAllHealthBehaviors();
  },

  // remove listener when component is unmounted
  componentWillUnmount() {
    HealthBehaviorStore.unlisten(this.stateChanged);
  },

  stateChanged(state) {
    this.setState({
    	healthBehaviors: state.healthBehaviors
    });
  },

  getInitialState() {
    return {
    	healthBehaviors: HealthBehaviorStore.getState().healthBehaviors
    };
	},

	renderListItem(behavior) {
		return (
      <li>
      	{behavior.data.start} - {behavior.data.end}
      </li>
    );
	},

  render() {
  	const { healthBehaviors } = this.state;
    return (
    	<div>
    		<span>Welcome to HealthHeroes! This is all the logged data:</span>
    		<ul>{ healthBehaviors.map(this.renderListItem) }</ul>
        <SleepVisualizerContainer />
    	</div>
  	);
  }
});