import React from 'react';
import scriptLoader from 'react-async-script-loader';

var ObservationChartBuilder = React.createClass({
  
	componentWillReceiveProps ({ isScriptLoaded, isScriptLoadSucceed }) {
		if (isScriptLoaded && !this.props.isScriptLoaded) { // load finished
			if (isScriptLoadSucceed) {
				this.setState({scriptsReady: true});
			}
			else this.props.onError()
		}
	},

	componentDidMount () {
		const { isScriptLoaded, isScriptLoadSucceed } = this.props
		if (isScriptLoaded && isScriptLoadSucceed) {			
			this.setState({scriptsReady: true});
		}
	},

	getInitialState() {
	    return {
    	  scriptsReady: false,
	    };
	},

	buildChart(data) {
		if (!this.state.scriptsReady) { return; }

      var chartSettings = {
        "dataProvider": data,
        "type": "serial",
        "categoryField": "date",
        "dataDateFormat": "YYYY-MM-DD",
        "theme": "light",
        "fontFamily": "Arial,San-serif",
        "color": "#FFFFFF",
        "plotAreaBorderColor": "#FFFFFF",
        "startDuration": 2,
        "autoResize": true,
        "autoDisplay": true,
        "autoMarginOffset": 5,
        "categoryAxis": {
          "parseDates": true,
          "axisColor": "#FFFFFF",
          "gridColor": "#FFFFFF"
        },
        "chartCursor": {
          "enabled": true
        },
        "graphs": [{
          "id": "g1",
          "type": "line",
          "bullet": "round",
          "lineThickness": 2,
          "valueField": "value",
          "balloonText": "<span style='font-size:10x;'>[[hoverText]]</span>"
        }],
        "valueAxes": [{
          "id": "v1",
          "labelFunction": this.props.axisMappings ? this.formatAxisValue : null,
          "axisColor": "#FFFFFF",
          "gridColor": "#FFFFFF"
        }],
        "titles": [ {
          "text": this.props.chartTitle,
          "size": 15
        }],
        "export": {
          "enabled": true
        }
      };

		var chart = AmCharts.makeChart(
            this.props.chartName, chartSettings);
  },

  formatAxisValue(value, formattedValue, valueAxis){
        
        if (!this.props.axisMappings) return value;

        var mappedValue = this.props.axisMappings.find(function(e,i,a) { return (e.value == value)});

        return mappedValue ? mappedValue.label : "";
  },

  render() {
  	this.buildChart(this.props.chartData);
    return (
    	<div>
        	<div id={this.props.chartName} style={{width: "100%"}}></div>
    	</div>
  	);
  }
});

export default scriptLoader(
  '/amcharts/amcharts.js','/amcharts/serial.js','/amcharts/themes/dark.js','/amcharts/themes/light.js','/amcharts/themes/chalk.js'
)(ObservationChartBuilder);
