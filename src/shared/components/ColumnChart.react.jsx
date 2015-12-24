import React from 'react';
import scriptLoader from 'react-async-script-loader';

var ColumnChart = React.createClass({
  
	componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
		if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
			if (isScriptLoadSucceed) {
				console.log('ColumnChart componentWillReceiveProps script loaded');
				this.setState({scriptsReady: true});
			}
			else this.props.onError()
		}
	},

	componentDidMount () {
		const { isScriptLoaded, isScriptLoadSucceed } = this.props
		if (isScriptLoaded && isScriptLoadSucceed) {			
			console.log('ColumnChart componentDidMount script loaded');
		    this.setState({scriptsReady: true});
		}
	},

	getInitialState() {
	    return {
    	  scriptsReady: false,
	    };
	},

	buildChart(data) {
		console.log('building chart -- ready:' + this.state.scriptsReady + ', data: ' + data);
		if (!this.state.scriptsReady) { return; }
		
		var chart = AmCharts.makeChart(this.props.chartName, {
            "type": "serial",
            "theme": "black",
            "dataDateFormat": "YYYY-MM-DD",
            "dataProvider": data,
            "valueAxes": [{
                "maximum": 16,
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
  	console.log('rendering column chart, props: ' + this.props);
  	this.buildChart(this.props.chartData);
    return (
    	<div>
        	<div id={this.props.chartName} style={{width: "100%", height: "400px"}}></div>
    	</div>
  	);
  }
});

export default scriptLoader(
  ['/amcharts/amcharts.js','/amcharts/serial.js','/amcharts/themes/black.js']
)(ColumnChart);
