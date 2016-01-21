import moment from 'moment';
import React, {PropTypes} from 'react';
import Globalize from 'globalize';
import Immutable from 'immutable';

export default React.createClass({

  contextTypes: { flux: PropTypes.object.isRequired },

  behaviorKey: "alertness-level",

  componentWillMount() {
    const { flux } = this.context;
    flux.getActions('healthBehaviors').findHealthBehavior(this.behaviorKey, this.state.selectedDate);
    flux.getActions('submit').allowSubmit({component: this.behaviorKey, canSubmit: this.state.canSubmit});
  },

  componentDidMount() {
    const { flux } = this.context;
    flux.getStore('healthBehaviors').listen(this.healthBehaviorStateChanged);
    flux.getStore('date').listen(this.dateStateChanged);
  },

  componentWillUnmount() {
    const { flux } = this.context;
    flux.getStore('healthBehaviors').unlisten(this.healthBehaviorStateChanged);
    flux.getStore('date').unlisten(this.dateStateChanged);
  },

  healthBehaviorStateChanged(state) {
    this.setState(this.getStateFromStore());
  },

  dateStateChanged(state) {
    const { flux } = this.context;
    flux.getActions('healthBehaviors').findHealthBehavior(this.behaviorKey, state.get('selectedDate'));

    //this.setState({selectedDate: state.get('selectedDate')});
  },

  getInitialState() {
    return this.getStateFromStore();
  },

  getStateFromStore() {
    const { flux } = this.context;
    const selectedDate = flux.getStore('date').getState().get('selectedDate');
    const currentHealthBehavior = flux.getStore('healthBehaviors').getState().get('currentHealthBehaviors').get(this.behaviorKey)
      || new Immutable.Map({
        _id: null,
        key: this.behaviorKey,
        filter: selectedDate,
        data: new Immutable.Map({
          level: null
        })
      });

    return {
      currentHealthBehavior: currentHealthBehavior,
      canSubmit: this._getCanSubmit(currentHealthBehavior.get('data')),
      selectedDate: selectedDate
    };
  },

  _getCanSubmit(data) {
    const selectedLevel = data.get('level');
    return selectedLevel !== null && selectedLevel !== undefined;
  },

  canSubmit() {
    return this.state.canSubmit;
  },

  doSubmit() {
    const { flux } = this.context;
    const currentHealthBehavior = this.state.currentHealthBehavior;
    
    if (currentHealthBehavior.get('_id')) {
      flux.getActions('healthBehaviors').updateHealthBehavior(currentHealthBehavior);
    } else {
      flux.getActions('healthBehaviors').submitHealthBehavior(currentHealthBehavior);
    }

    flux.getActions('submit').didSubmit({component: this.behaviorKey});
  },

  getData(healthBehavior) {
    return healthBehavior.get('data') ||
      Immutable.Map({
        start: null,
        end: null
      });
  },

  updateLevel(event) {
    let val = event.currentTarget.value;
    const currentHealthBehavior = this.state.currentHealthBehavior;
    const data = this.getData(currentHealthBehavior)
      .set('level', val);
    const canSubmit = this._getCanSubmit(data);

    this.setState({
      currentHealthBehavior: currentHealthBehavior.set('data', data),
      canSubmit: canSubmit
    });
    const { flux } = this.context;
    flux.getActions('submit').allowSubmit({component: this.behaviorKey, canSubmit: canSubmit});
  },

  render() {
    const currentHealthBehavior = this.state.currentHealthBehavior;
    const selectedLevel = this.getData(currentHealthBehavior).get('level');

            /*<input type="radio" name="level" value="1" onChange={this.updateLevel} checked={selectedLevel==="1"} />1
            <input type="radio" name="level" value="2" onChange={this.updateLevel} checked={selectedLevel==="2"} />2
            <input type="radio" name="level" value="3" onChange={this.updateLevel} checked={selectedLevel==="3"} />3
            <input type="radio" name="level" value="4" onChange={this.updateLevel} checked={selectedLevel==="4"} />4
            <input type="radio" name="level" value="5" onChange={this.updateLevel} checked={selectedLevel==="5"} />5*/
    return (
      <li className="alertnessLevel">
        <strong className="numBG">2</strong>
          <h2>{Globalize.formatMessage('alertnesstracker-level-title')}</h2>
          <strong>{Globalize.formatMessage('alertnesstracker-level-subtitle')}</strong>
          <div id="carousel">
            <a href="#" title="Ready to Go"><img src="images/readyToGo.png" id="item-1" onClick={this.updateLevel} data-value="1" /></a>
            <a href="#" title="Tired"><img src="images/tired.png" id="item-2" onClick={this.updateLevel} data-value="2" /></a>
            <a href="#" title="Ok"><img src="images/ok.png" id="item-3" onClick={this.updateLevel} data-value="3" /></a>
           </div>
      </li>
    );
  }
});