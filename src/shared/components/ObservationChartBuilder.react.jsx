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
            "type": "serial",
            "theme": "light",
            "marginRight": 40,
            "marginLeft": 40,
            "autoMarginOffset": 20,
            "dataDateFormat": "YYYY-MM-DD",
            "categoryField": "date",
            "titles": [ {
                "text": this.props.chartTitle,
                "size": 15
            }],
            "dataProvider": data,
            "valueAxes": [{
                "id": "v1",
                "axisAlpha": 0,
                "position": "left",
                //"ignoreAxisWidth":true, // this causes the custom axis labels to get cut off
                "labelFunction": this.props.axisMappings ? this.formatAxisValue : null,
            }],
            "balloon": {
                "borderThickness": 1,
                "shadowAlpha": 0
            },
            "graphs": [{
                "id": "g1",
                "balloon":{
                  "drop":true,
                  "adjustBorderColor":false,
                  "color":"#ffffff"
                },
                "bullet": "round",
                "bulletBorderAlpha": 1,
                "bulletColor": "#FFFFFF",
                "bulletSize": 5,
                "hideBulletsCount": 50,
                "lineThickness": 2,
                "useLineColorForBulletBorder": true,
                "valueField": "value",
                "balloonText": "<span style='font-size:18px;'>[[hoverText]]</span>"
            }],
            /*"chartScrollbar": {
                "graph": "g1",
                "oppositeAxis":false,
                "offset":30,
                "scrollbarHeight": 80,
                "backgroundAlpha": 0,
                "selectedBackgroundAlpha": 0.1,
                "selectedBackgroundColor": "#888888",
                "graphFillAlpha": 0,
                "graphLineAlpha": 0.5,
                "selectedGraphFillAlpha": 0,
                "selectedGraphLineAlpha": 1,
                "autoGridCount":true,
                "color":"#AAAAAA"
            },*/
            "chartCursor": {
                "pan": true,
                "valueLineEnabled": true,
                "valueLineBalloonEnabled": true,
                "cursorAlpha":1,
                "cursorColor":"#258cbb",
                "limitToGraph":"g1",
                "valueLineAlpha":0.2
            },
            /*"valueScrollbar":{
              "oppositeAxis":false,
              "offset":50,
              "scrollbarHeight":10
            },*/
            "categoryField": "date",
            "categoryAxis": {
                "parseDates": true,
                "dashLength": 1,
                "minorGridEnabled": true
            },
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
        	<div id={this.props.chartName} style={{width: "100%", height: "300px"}}></div>
    	</div>
  	);
  }
});

export default scriptLoader(
  '/amcharts/amcharts.js','/amcharts/serial.js','/amcharts/themes/dark.js'
)(ObservationChartBuilder);
