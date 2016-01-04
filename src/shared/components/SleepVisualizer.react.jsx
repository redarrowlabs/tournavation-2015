import React, {PropTypes} from 'react';
import ObservationChart from './ObservationChartBuilder.react';

export default React.createClass({
  
  	contextTypes: { flux: PropTypes.object.isRequired },
  	
	componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
		console.log('SleepVisualizer componentWillReceiveProps') ;
	},

	componentDidMount () {		
		console.log('SleepVisualizer componentDidMount');
		const { flux } = this.context;
    	flux.getStore('healthBehaviors').listen(this.stateChanged);
	},

	componentWillMount() {
		console.log('SleepVisualizer componentWillMount');
	    const { flux } = this.context;
	    flux.getActions('healthBehaviors').fetchAllHealthBehaviors();
	},

	componentWillUnmount() {
		console.log('SleepVisualizer componentWillMount');
		const { flux } = this.context;
		flux.getStore('healthBehaviors').unlisten(this.stateChanged);
	},

	stateChanged(state) {
		console.log('SleepVisualizer stateChanged');
		this.setState({
			sleepData: state.get('healthBehaviors')
		});
	},

  	getInitialState() {
	    const { flux } = this.context;
	    return {
	    	sleepData: flux.getStore('healthBehaviors').getState().get('healthBehaviors')
	    };
	},

	generateChartData(rawData) {
		console.log('generating sleep chart data from ' + rawData);
		var translatedData = [];
		if (rawData) {
			// Until the data is "real", just using some fake data with same number of points as source
			// Ultimately this might do some transformation of the source data given the type of chart we want
			// So this will tacitly, but not directly, understand the chart implementation.
			rawData.map(function(dataPoint, idx) {
				var someDate = new Date();
				someDate.setDate(someDate.getDate() + idx); 
				var dateStr = someDate.getDate() < 10 ? '0' + someDate.getDate() : someDate.getDate().toString();
				var monthStr = (someDate.getMonth()) + 1 < 10 ? '0' + (someDate.getMonth() + 1) : (someDate.getMonth() + 1).toString();
				var someDateStr = someDate.getFullYear() + '-' + monthStr + '-' + dateStr;
				console.log(someDateStr + ' ' + idx);
				var color = (idx % 2 === 0) ? "#04D215" : "#FCD202";
				translatedData.push( { "date": someDateStr, "value": idx, "color": color } );
			});
		}
		console.log('generated sleep chart data: ' + translatedData);
		return translatedData;
	},

	render() {
		console.log('rendering sleep chart, ' + this.state.sleepData);
		var transformedData = this.generateChartData(this.state.sleepData);
		return (
			<div>
		    	<ObservationChart chartData={transformedData} chartName='sleep' chartTitle='Total Hours of Sleep' chartType='StepLine'/>
			</div>
		);
	}
});
