import moment from 'moment';
import React, {PropTypes} from 'react';
import Tracking from "./ComposeTracking.react";
import Visualization from "./ComposeVisualization.react";

export default React.createClass({

  contextTypes: { flux: PropTypes.object.isRequired },

  getInitialState() {
    return {
    };
  },

  render() {
    return (
      <div id="mainContainer">
        <Tracking />
        <Visualization />
      </div>
    );
  }
});