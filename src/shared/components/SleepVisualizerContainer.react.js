import React from "react";
import SleepVisualizer from './SleepVisualizer.react';
import HealthBehaviorStore from '../stores/HealthBehaviorStore';
import AltContainer from 'alt-container';

// This separates the component displaying the data from the store supplying the data
export default React.createClass({
  render() {
    return (
      <AltContainer 
      		stores={{sleepStore: HealthBehaviorStore}} 
      		transform={function(stores) { return { sleepData: stores.sleepStore.healthBehaviors}}}>
        <SleepVisualizer />
      </AltContainer>
    )
  }
})