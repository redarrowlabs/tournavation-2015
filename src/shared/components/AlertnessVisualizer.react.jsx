import React, {PropTypes} from 'react';
import ObservationChart from './ObservationChartBuilder.react';
import moment from 'moment';
import Globalize from 'globalize';

export default React.createClass({
  
  alertnessLabelMappings() {
  	return [
	  	{
	  		value: 1,
	  		label: Globalize.formatMessage('alertnesstracker-level-1')
	  	},
	  	{
	  		value: 2,
	  		label: Globalize.formatMessage('alertnesstracker-level-2')
	  	},
	  	{
	  		value: 3,
	  		label: Globalize.formatMessage('alertnesstracker-level-3')
	  	},
	  	{
	  		value: 4,
	  		label: Globalize.formatMessage('alertnesstracker-level-4')
	  	},
	  	{
	  		value: 5,
	  		label: Globalize.formatMessage('alertnesstracker-level-5')
	  	}
		];
  },
		
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
		var vis = this;
		if (rawData) {
			rawData.map(function(dataPoint, idx) {
				let dt = dataPoint.get('filter');
			    let alertness = dataPoint.get('data').get('level');

				if (!dt || !alertness) return;

				var obsDate = moment(parseInt(dt,10));
  			var obsDateStr = obsDate.format('YYYY-MM-DD');

  			var color = (alertness >= 4) ? "#04D215" : "#FCD202";

  			var alertnessMapping = vis.alertnessLabelMappings().find(function(e,i,a) { return (e.value == alertness)});
    		var hoverText = alertnessMapping ? alertnessMapping.label : "";

  			translatedData.push( { "date": obsDateStr, "value": alertness, "color": color, "hoverText": hoverText } );
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
		    	<ObservationChart chartData={transformedData} chartName='alertness-chart' chartTitle={Globalize.formatMessage('alertnessvisualizer-title')} axisMappings={this.alertnessLabelMappings()}/>
			</div>
		);
	}
});
