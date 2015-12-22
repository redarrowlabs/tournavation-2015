import React from 'react';
import scriptLoader from 'react-async-script-loader';
import HealthBehaviorStore from '../stores/HealthBehaviorStore';

var SleepVisualizer = React.createClass({
  
	componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
		if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
			if (isScriptLoadSucceed) {
				console.log('SleepVisualizer componentWillReceiveProps script loaded, storeData: ' + HealthBehaviorStore.getState().healthBehaviors) ;

				// The data may have already have been retrieved before our scripts loaded
				// So update our state to use the current data in the store
				var newChartData = this.generateChartData(HealthBehaviorStore.getState().healthBehaviors);
				this.setState({scriptsReady: true, chartData: newChartData});

				// Now listen for any subsequent updates
				HealthBehaviorStore.listen(this.healthBehaviorDataUpdated);
			}
			else this.props.onError()
		}
	},

	componentDidMount () {
		const { isScriptLoaded, isScriptLoadSucceed } = this.props
		if (isScriptLoaded && isScriptLoadSucceed) {			
			console.log('SleepVisualizer componentDidMount script loaded');

			// The data may have already have been retrieved before our scripts loaded
		    // So update our state to use the current data in the store
		    var newChartData = this.generateChartData(HealthBehaviorStore.getState().healthBehaviors);
		    this.setState({scriptsReady: true, chartData: newChartData});

	    	// Now listen for any subsequent updates
		    HealthBehaviorStore.listen(this.healthBehaviorDataUpdated);
		}
	},

	componentWillUnmount() {
	    HealthBehaviorStore.unlisten(this.healthBehaviorDataUpdated);
	},

	getInitialState() {
	    return {
    	  scriptsReady: false,
	      chartData: []
	    };
	},

	generateChartData(rawData) {
		console.log('generating sleep chart data from ' + rawData);
		var translatedData = [];
		if (rawData) {
			// Until the data is "real", just using some fake data with same number of points as source
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

	healthBehaviorDataUpdated(healthBehaviorStoreData) {
		console.log('SleepVisual health behavior store listener triggered');
		var newChartData = this.generateChartData(healthBehaviorStoreData.healthBehaviors);
		this.setState( { chartData: newChartData } ); // trigger render with updated data
  	},

	buildChart(data) {
		console.log('building sleep chart -- ready:' + this.state.scriptsReady + ', data: ' + data);
		if (!this.state.scriptsReady) { return; }
		
		var chart = AmCharts.makeChart("chartdiv", {
            "type": "serial",
            "theme": "black",
            "dataDateFormat": "YYYY-MM-DD",
            "dataProvider": data,
            "valueAxes": [{
                "maximum": 12,
                "minimum": 0,
                "axisAlpha": 0.2,
                "gridAlpha": 0.7,
            }],
            "graphs": [{
            	"type": "column",
                "valueField": "value",
                "fillAlphas" : 0.9,
                "colorField": "color",
                "topRadius": 1
            }],
            "chartCursor": {
                "cursorAlpha": 0,
                "zoomable":false,
                "valueZoomable":true
            },
            "categoryField": "date",
            "categoryAxis": {
                "parseDates": true
            },
            "depth3D": 50,
            "angle": 30,
            "valueScrollbar":{

            }
        });
  },

  render() {
  	console.log('rendering sleep chart');
  	this.buildChart(this.state.chartData);
    return (
    	<div>
        	Visualize my sleep!
        	<div id="chartdiv" style={{width: "100%", height: "400px"}}></div>
    	</div>
  	);
  }
});

export default scriptLoader(
  ['/amcharts/amcharts.js','/amcharts/serial.js','/amcharts/themes/black.js']
)(SleepVisualizer);
