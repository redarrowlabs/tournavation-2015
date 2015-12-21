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
				var someDateStr = someDate.getFullYear() + '-' + (someDate.getMonth() + 1) + '-' + someDate.getDate();
				translatedData.push( { "date": someDateStr, "value": idx } );
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
            "theme": "dark",
            "dataDateFormat": "YYYY-MM-DD",
            "dataProvider": data,
            "valueAxes": [{
                "maximum": 140,
                "minimum": 0,
                "axisAlpha": 0,
                "guides": [{
                    "fillAlpha": 0.1,
                    "fillColor": "#CC0000",
                    "lineAlpha": 0,
                    "toValue": 120,
                    "value": 0
                }, {
                    "fillAlpha": 0.1,
                    "fillColor": "#0000cc",
                    "lineAlpha": 0,
                    "toValue": 200,
                    "value": 120
                }]
            }],
            "graphs": [{
                "bullet": "round",
                "dashLength": 4,
                "valueField": "value"
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
  ['/amcharts/amcharts.js','/amcharts/serial.js']
)(SleepVisualizer);
