import React, { Component } from 'react';
import { connect } from 'react-redux';
import moment from 'moment'

var LineChart = require("react-chartjs").Line;



const mapStateToProps = state => ({
  state
});

class Chart extends Component {
render() {

  //breaking apart splReducer array to use for chart data
  let splReducer = this.props.state.splReducer.reverse();

  let splStampMap = splReducer.map((item) => {
      let formatedStamp = moment(item.stamp).format('h:mm:ss');
      return formatedStamp;   
  })
  let splDataMap = splReducer.map((item) => {
      return item.spl; 
  })

//end chart data maps
//data for chart
  let chartData = {
    labels: splStampMap,
    datasets: [
        {
            label: "My First dataset",
            fillColor: "rgba(0,0,255,0.3)",
            strokeColor: "rgba(0,0,255,1)",
            pointColor: "rgba(0,0,255,1)",
            pointStrokeColor: "",
            pointHighlightFill: "",
            pointHighlightStroke: "",
            data: splDataMap,
        }
    ]
};
//end data for chart

let chartOptions = {
        scaleOverride: true, 
        scaleStartValue: 55, 
        scaleStepWidth: 2, 
        scaleSteps: 15,
        bezierCurve : false,
        pointDot : true,
        pointDotStrokeWidth : 0.5,
        datasetFill : false,
}
  

  return (
      <LineChart data={chartData} options={chartOptions} height="450"/>            
  );
}
}

// this allows us to use <App /> in index.js
export default connect(mapStateToProps)(Chart);
