import React from "react";
import HealthBehaviorStore from '../stores/HealthBehaviorStore';
import HealthBehaviorAction from '../actions/HealthBehaviorActions';

//export default class Home extends React.Component {
export default React.createClass ({

	componentDidMount() {
    HealthBehaviorStore.listen(this.stateChanged);
    HealthBehaviorAction.fetchAllHealthBehaviors();
  },

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
    	</div>
  	);
  }
});