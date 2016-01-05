import moment from 'moment';
import React, {PropTypes} from 'react';
import Globalize from 'globalize';
import Immutable from 'immutable';

export default React.createClass({

  contextTypes: { flux: PropTypes.object.isRequired },

  behaviorKey: "alertness",

  componentWillMount() {
    const { flux } = this.context;
    flux.getActions('healthBehaviors').findHealthBehavior('alertness-level', this.state.selectedDate);
  },

  componentDidMount() {
    const { flux } = this.context;
    flux.getStore('healthBehaviors').listen(this.stateChanged);
  },

  componentWillUnmount() {
    const { flux } = this.context;
    flux.getStore('healthBehaviors').unlisten(this.stateChanged);
  },

  stateChanged(state) {
    this.setState(this.getStateFromStore());
  },

  getInitialState() {
    return this.getStateFromStore();
  },

  getStateFromStore() {
    const { flux } = this.context;
    const selectedDate = moment().startOf('day').valueOf();
    const currentHealthBehavior = flux.getStore('healthBehaviors').getState().get('currentHealthBehaviors').get('alertness-level')
      || new Immutable.Map({
        _id: null,
        key: 'alertness-level',
        filter: selectedDate,
        data: new Immutable.Map({
          level: null
        })
      });

    return {
      currentHealthBehavior: currentHealthBehavior,
      selectedDate: selectedDate
    };
  },

  handleSubmit() {
    const { flux } = this.context;
    const currentHealthBehavior = this.state.currentHealthBehavior;
    
    if (currentHealthBehavior.get('id')) {
      flux.getActions('healthBehaviors').updateHealthBehavior(currentHealthBehavior);
    } else {
      flux.getActions('healthBehaviors').submitHealthBehavior(currentHealthBehavior);
    }
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

    this.setState({
      currentHealthBehavior: currentHealthBehavior.set('data', data)
    });
  },

  render() {
    const currentHealthBehavior = this.state.currentHealthBehavior;
    const selectedLevel = this.getData(currentHealthBehavior).get('level');

    return (
      <div>
        <div>
          <span align="left">2</span>
          <div align="center">
            <span>{Globalize.formatMessage('alertnesstracker-level-title')}</span>
            <br/>
            <span>{Globalize.formatMessage('alertnesstracker-level-subtitle')}</span>
          </div>
        </div>
        {JSON.stringify(this.props)}
        <div align="center">
          <div>
            <span align="left">
              <span>{Globalize.formatMessage('alertnesstracker-level')}</span>
            </span>
            <input type="radio" name="level" value="1" onChange={this.updateLevel} checked={selectedLevel==="1"} />1
            <input type="radio" name="level" value="2" onChange={this.updateLevel} checked={selectedLevel==="2"} />2
            <input type="radio" name="level" value="3" onChange={this.updateLevel} checked={selectedLevel==="3"} />3
            <input type="radio" name="level" value="4" onChange={this.updateLevel} checked={selectedLevel==="4"} />4
            <input type="radio" name="level" value="5" onChange={this.updateLevel} checked={selectedLevel==="5"} />5
          </div>
        </div>

        <input type="submit" value={Globalize.formatMessage('alertnesstracker-submit')} onClick={this.handleSubmit} />
        
      </div>
    );
  }
});