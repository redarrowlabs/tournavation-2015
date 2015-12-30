import React, {PropTypes} from 'react';

export default React.createClass ({

  contextTypes: { flux: PropTypes.object.isRequired },

  // begin listening to store, and call initial fetch to load data
	componentDidMount() {
    const { flux } = this.context;
    flux.getStore('healthBehaviors').listen(this.stateChanged);
    flux.getActions('healthBehaviors').fetchAllHealthBehaviors();
  },

  // remove listener when component is unmounted
  componentWillUnmount() {
    const { flux } = this.context;
    flux.getStore('healthBehaviors').unlisten(this.stateChanged);
  },

  stateChanged(state) {
    this.setState({
    	healthBehaviors: state.healthBehaviors
    });
  },

  getInitialState() {
    const { flux } = this.context;
    return {
    	healthBehaviors: flux.getStore('healthBehaviors').getState().healthBehaviors
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