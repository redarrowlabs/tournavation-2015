import moment from 'moment';
import React, {PropTypes} from 'react';
import SleepVisualizer from './SleepVisualizer.react';
import AlertnessVisualizer from './AlertnessVisualizer.react';

export default React.createClass({

  contextTypes: { flux: PropTypes.object.isRequired },

  getInitialState() {
    return {
    };
  },

  render() {
    return (
      <section className="trackData">
          <div className="headerContainer">
            <h2>Track Your Data</h2>
            <h3>View your data over time to see how you can improve!</h3>
          </div>
          <SleepVisualizer key="sleep-visualizer" />
          <AlertnessVisualizer key="alertness-visualizer" />       
      </section>
    );
  }
});