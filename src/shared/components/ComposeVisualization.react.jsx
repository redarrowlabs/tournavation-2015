import moment from 'moment';
import React, {PropTypes} from 'react';
import SleepVisualizer from './SleepVisualizer.react';

export default React.createClass({

  contextTypes: { flux: PropTypes.object.isRequired },

  getInitialState() {
    return {
    };
  },

  render() {
    return (
      <div>
        <SleepVisualizer key="sleep-visualizer"  />
      </div>
    );
  }
});