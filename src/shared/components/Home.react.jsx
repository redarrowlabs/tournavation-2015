import React, {PropTypes} from 'react';

export default React.createClass ({

  contextTypes: { flux: PropTypes.object.isRequired },

  // begin listening to store, and call initial fetch to load data
	componentWillMount() {
    const { flux } = this.context;
  },

  componentDidMount() {
    const { flux } = this.context;
    flux.getStore('healthBehaviors').listen(this.stateChanged);
  },

  // remove listener when component is unmounted
  componentWillUnmount() {
    const { flux } = this.context;
    flux.getStore('healthBehaviors').unlisten(this.stateChanged);
  },

  stateChanged(state) {
    this.setState({});
  },

  getInitialState() {
    const { flux } = this.context;
    return {};
	},

  render() {
  	const { healthBehaviors } = this.state;
    return (
    	<div>
    		<span>Welcome to HealthHeroes! This is all the logged data:</span>
    	</div>
  	);
  }
});