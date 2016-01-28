import React, {PropTypes} from 'react';
import ObservationChart from './ObservationChartBuilder.react';
import moment from 'moment';

export default React.createClass({
  
  contextTypes: { flux: PropTypes.object.isRequired },

	componentDidMount () {
		const { flux } = this.context;
    flux.getStore('healthBehaviors').listen(this.stateChanged);
	},

	componentWillMount() {
	  const { flux } = this.context;
	  flux.getActions('healthBehaviors').fetchAllHealthBehaviors('sleep-tracker');
	},

	componentWillUnmount() {
		const { flux } = this.context;
		flux.getStore('healthBehaviors').unlisten(this.stateChanged);
	},

	stateChanged(state) {
		this.setState({
			sleepData: state.get('healthBehaviors').get('sleep-tracker')
		});
	},

  getInitialState() {
	  const { flux } = this.context;
	  return {
	    sleepData: flux.getStore('healthBehaviors').getState().get('healthBehaviors').get('sleep-tracker')
	  };
	},

	generateChartData(rawData) {
		var translatedData = [];
		if (rawData) {
			rawData.map(function(dataPoint, idx) {
				let dt = dataPoint.get('filter');
				let start = dataPoint.get('data').get('start');
		    let end = dataPoint.get('data').get('end');
				if (!dt || !end || !start) return;

				let totalTime = this.state.canSubmit
		      ? moment.duration(end.diff(start))
		      : null;
		    let totalHours = totalTime ? totalTime.get('hours') : null;
		    let totalMinutes = totalTime ? totalTime.get('minutes') : null;
		    totalMinutes = totalMinutes != null && totalMinutes < 10 ? '0' + totalMinutes : totalMinutes;
		    let divider = totalTime ? Globalize.formatMessage('sleeptracker-time-unit-divider') : null;
		    let timeValue = totalHours + divider + totalMinutes;
	      		
    		var obsDate = moment(parseInt(dt, 10));
  			var obsDateStr = obsDate.format('YYYY-MM-DD');
  			var color = (totalHours >= 8) ? "#04D215" : "#FCD202";
  			translatedData.push( { "date": obsDateStr, "value": timeValue, "color": color } );
			});
		}
		// chart not happy if data isnt in sorted order
		translatedData.sort(function(a,b) { return (a.date.localeCompare(b.date)); })
		return translatedData;
	},

	render() {
		var transformedData = this.generateChartData(this.state.sleepData);
		return (
			<div>
		    	<ObservationChart chartData={transformedData} chartName='sleep' chartTitle='Total Hours of Sleep' chartType='StepLine'/>
			</div>
		);
	}
});
