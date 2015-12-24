import React from 'react';
import ColumnChart from './ColumnChart.react';

export default React.createClass({
  
	componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
		console.log('SleepVisualizer componentWillReceiveProps script loaded, storeData: ' + this.props.healthBehaviors) ;
		console.log(this.props);
	},

	componentDidMount () {		
		console.log('SleepVisualizer componentDidMount script loaded');
		console.log(this.props);
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
				var color = idx >= 4 ? "#04D215" : "#FCD202";
				translatedData.push( { "date": someDateStr, "value": idx, "color": color } );
			});
		}
		console.log('generated sleep chart data: ' + translatedData);
		return translatedData;
	},

	render() {
		console.log('rendering sleep chart, props: ' + this.props.healthBehaviors);
		var transformedData = this.generateChartData(this.props.healthBehaviors);
		return (
			<div>
		    	Visualize my sleep!
		    	<ColumnChart chartData={transformedData} chartName='sleep'/>
			</div>
		);
	}
});
