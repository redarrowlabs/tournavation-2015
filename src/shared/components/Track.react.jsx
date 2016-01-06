import moment from 'moment';
import React, {PropTypes} from 'react';
import SleepTracker from "./SleepTracker.react";
import AlertnessTracker from "./AlertnessTracker.react";

const Track = React.createClass({

  contextTypes: { flux: PropTypes.object.isRequired },

  getInitialState() {
    return {
      selectedDate: moment().format('YYYY-MM-DD'),
    };
  },

  render() {
    return (
        <div>
            <SleepTracker selectedDate={this.state.selectedDate} />
            <AlertnessTracker selectedDate={this.state.selectedDate} />
        </div>
    );
  }
});

export default Track;