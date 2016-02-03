import moment from 'moment';
import React, {PropTypes} from 'react';
import SleepVisualizer from './SleepVisualizer.react';
import AlertnessVisualizer from './AlertnessVisualizer.react';
import Globalize from 'globalize';

export default React.createClass({

  contextTypes: { flux: PropTypes.object.isRequired },

  getInitialState() {
    return {
    };
  },

  render() {
    return (
      <section className="trackData">
          <strong className="numBG">3</strong>
          <div className="headerContainer">
            <h2>{Globalize.formatMessage('visualize-title')}</h2>
            <h3>{Globalize.formatMessage('visualize-subtitle')}</h3>
          </div>
          <AlertnessVisualizer key="alertness-visualizer" /> 
          <SleepVisualizer key="sleep-visualizer" />      
      </section>
    );
  }
});