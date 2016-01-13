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
	  	flux.getActions('healthBehaviors').fetchAllHealthBehaviors('alertness-level');
	},

	componentWillUnmount() {
		const { flux } = this.context;
		flux.getStore('healthBehaviors').unlisten(this.stateChanged);
	},

	stateChanged(state) {
		this.setState({
			alertnessData: state.get('healthBehaviors').get('alertness-level')
		});
	},

  getInitialState() {
	  	const { flux } = this.context;
	  	return {
	    	alertnessData: flux.getStore('healthBehaviors').getState().get('healthBehaviors').get('alertness-level')
	  	};
	},

	generateChartData(rawData) {
		var translatedData = [];
		if (rawData) {
			rawData.map(function(dataPoint, idx) {
				let dt = dataPoint.get('filter');
			    let alertness = dataPoint.get('data').get('level');

				if (!dt || !alertness) return;

				var obsDate = moment(parseInt(dt,10));
      			var obsDateStr = obsDate.format('YYYY-MM-DD');

      			var color = (alertness >= 4) ? "#04D215" : "#FCD202";
      			translatedData.push( { "date": obsDateStr, "value": alertness, "color": color } );
			});
		}
		// chart not happy if data isnt in sorted order
		translatedData.sort(function(a,b) { return (a.date.localeCompare(b.date)); })
		return translatedData;
	},

	render() {
		var transformedData = this.generateChartData(this.state.alertnessData);
		return (
			<div>
		    	<ObservationChart chartData={transformedData} chartName='alertness' chartTitle='Alertness Level' chartType='StepLine'/>
			</div>
		);
	}
});
