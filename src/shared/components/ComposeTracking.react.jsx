import moment from 'moment';
import React, {PropTypes} from 'react';
import Globalize from 'globalize';
import SleepTracker from "./SleepTracker.react";
import AlertnessTracker from "./AlertnessTracker.react";

export default React.createClass({

  contextTypes: { flux: PropTypes.object.isRequired },

  componentDidMount() {
    const { flux } = this.context;
    flux.getStore('submit').listen(this.submitStateChanged);
  },

  componentWillUnmount() {
    const { flux } = this.context;
    flux.getStore('submit').unlisten(this.submitStateChanged);
  },

  submitStateChanged(state) {
    this.setState(this.getStateFromStores());
  },

  getInitialState() {
    return this.getStateFromStores();
  },

  getStateFromStores() {
    const { flux } = this.context;
    let components = flux.getStore('submit').getState().get('submittableComponents');
    let canSubmit = false;
    for (let key of components.keys()) {
      if (components.has(key) && components.get(key).get('canSubmit')) {
        canSubmit = true;
        break;
      }
    }

    return {
      canSubmit: canSubmit,
      selectedDate: moment().startOf('day').valueOf()
    };    
  },

  render() {
    let isDisabled = !this.state.canSubmit;
    this.trackers = [];

    return (
      <div>
        <SleepTracker ref={ (ref) => {if (ref !== null ) this.trackers.push(ref);} } selectedDate={this.state.selectedDate} />
        <AlertnessTracker ref={ (ref) => {if (ref !== null ) this.trackers.push(ref);} } selectedDate={this.state.selectedDate} />

        <input type="submit" value={Globalize.formatMessage('sleeptracker-submit')} onClick={this.handleSubmit} disabled={isDisabled}/>
      </div>
    );
  },

  handleSubmit() {
    if (!this.state.canSubmit) { return; }

    for (let tracker of this.trackers) {
      if (tracker.canSubmit()) {
        tracker.doSubmit();
      }
    }
  }
});