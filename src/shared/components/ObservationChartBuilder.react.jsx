import React from 'react';
import scriptLoader from 'react-async-script-loader';

var ObservationChartBuilder = React.createClass({
  
	componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
		if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
			if (isScriptLoadSucceed) {
				console.log('ObservationChartBuilder componentWillReceiveProps script loaded');
				this.setState({scriptsReady: true});
			}
			else this.props.onError()
		}
	},

	componentDidMount () {
		const { isScriptLoaded, isScriptLoadSucceed } = this.props
		if (isScriptLoaded && isScriptLoadSucceed) {			
			console.log('ObservationChartBuilder componentDidMount script loaded');
		    this.setState({scriptsReady: true});
		}
	},

	getInitialState() {
	    return {
    	  scriptsReady: false,
	    };
	},

	buildChart(data) {
		console.log('building chart -- scripts ready:' + this.state.scriptsReady + ', data points: ' + (data ? data.length : 0));
        if (!this.state.scriptsReady) { return; }
		
        var chartSettings = {
            "type": "serial",
            "theme": "dark",
            "titles": [ {
                "text": this.props.chartTitle,
                "size": 15
            }],
            "dataDateFormat": "YYYY-MM-DD",
            "dataProvider": data,
            "valueAxes": [{
                "axisAlpha": 0,
                "gridAlpha": 0.7,
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
            "chartScrollbar": {
            },
            "valueScrollbar":{
            }
        };

        if (this.props.chartType === 'Column') {
            chartSettings.graphs = [{
                "type": "column",
                "valueField": "value",
                "fillAlphas" : 0.9,
                "lineAlpha": 0.2,
                "colorField": "color",
                "topRadius": 1
            }];
        }
        else if (this.props.chartType === 'Line') {
            chartSettings.graphs = [{
                "type": "line",
                "valueField": "value",
                "bullet": "square",
                "bulletBorderAlpha": 1,
                "bulletBorderThickness": 3,
                "colorField": "color"
            }];
        }
        else if (this.props.chartType === 'StepLine') {
            chartSettings.graphs = [{
                "type": "step",
                "valueField": "value",
                "bullet": "square",
                "bulletBorderAlpha": 1,
                "bulletBorderThickness": 1,
                "fillAlphas" : 0.3,
                "lineColorField": "color",
                "fillColorsField": "color",
            }];
        };

		var chart = AmCharts.makeChart(
            this.props.chartName, chartSettings);
  },

  render() {
  	console.log('rendering ObservationChartBuilder');
  	this.buildChart(this.props.chartData);
    return (
    	<div>
        	<div id={this.props.chartName} style={{width: "100%", height: "400px", background: "#3f3f4f", color:"#ffffff"}}></div>
    	</div>
  	);
  }
});

export default scriptLoader(
  '/amcharts/amcharts.js','/amcharts/serial.js','/amcharts/themes/dark.js'
)(ObservationChartBuilder);
