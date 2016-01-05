import moment from 'moment';
import React, {PropTypes} from 'react';
import Globalize from 'globalize';
import Immutable from 'immutable';

export default React.createClass({

  contextTypes: { flux: PropTypes.object.isRequired },

  behaviorKey: "alertness",

  componentWillMount() {
    const { flux } = this.context;
    flux.getActions('healthBehaviors').findHealthBehavior('alertness-level', this.props.selectedDate);
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
    this.setState(state.get('currentHealthBehaviors').get('alertness-level'));
  },

  getInitialState() {
    const { flux } = this.context;
    const currentHealthBehavior = flux.getStore('healthBehaviors').getState().get('currentHealthBehaviors').get('alertness-level');
    return {
      currentHealthBehavior
    };
  },

  handleSubmit() {
    const { flux } = this.context;
    const currentHealthBehavior = this.state.currentHealthBehavior;
    
    let updatedBehavior = {  
        date: currentHealthBehavior.get('date'),
        level: currentHealthBehavior.get('level')
    };
    if (this.state.currentHealthBehavior.get('id')) {
      updatedBehavior.id = currentHealthBehavior.get('id');
      flux.getActions('healthBehaviors').updateHealthBehavior(updatedBehavior);
    } else {
      updatedBehavior.key = this.behaviorKey;        
      flux.getActions('healthBehaviors').submitHealthBehavior(updatedBehavior);
    }
  },

  updateLevel(event) {
    let val = event.currentTarget.value;
    const currentHealthBehavior = this.state.currentHealthBehavior;
    
    this.setState({
      currentHealthBehavior: Immutable.Map({
        id: currentHealthBehavior.get('id'),
        date: this.props.selectedDate,
        level: val,
      })
    });
  },

  render() {
    const currentHealthBehavior = this.state.currentHealthBehavior;
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
            <input type="radio" name="level" value="1" onChange={this.updateLevel} />1
            <input type="radio" name="level" value="2" onChange={this.updateLevel} />2
            <input type="radio" name="level" value="3" onChange={this.updateLevel} />3
            <input type="radio" name="level" value="4" onChange={this.updateLevel} />4
            <input type="radio" name="level" value="5" onChange={this.updateLevel} />5
          </div>
        </div>

        <input type="submit" value={Globalize.formatMessage('alertnesstracker-submit')} onClick={this.handleSubmit} />
        
      </div>
    );
  }
});