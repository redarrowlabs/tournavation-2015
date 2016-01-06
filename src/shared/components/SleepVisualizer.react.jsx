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
				let start = dataPoint.get('data').get('start');
			    let end = dataPoint.get('data').get('end');
				if (!end || !start) return;

				var startDate = moment(start);
      			var endDate = moment(end);
			    let totalHours = Number(Math.round(moment.duration(endDate.diff(startDate)).asHours()+'e2')+'e-2');
	      		
      			var startDateStr = startDate.format('YYYY-MM-DD');
      			var color = (totalHours >= 8) ? "#04D215" : "#FCD202";
      			translatedData.push( { "date": startDateStr, "value": totalHours, "color": color } );
			});
		}
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
