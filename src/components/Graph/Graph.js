import React, { Component } from 'react';
import { connect } from 'react-redux';

import { USER_ACTIONS } from '../../redux/actions/userActions';
import { Switch, FormControlLabel } from 'material-ui';
import Card, { CardActions, CardContent } from 'material-ui/Card';
import Info from '@material-ui/icons/Info'
import Icon from 'material-ui/Icon';
import IconButton from 'material-ui/IconButton';
import Button from 'material-ui/Button';
import Drawer from 'material-ui/Drawer';
import AppBar from 'material-ui/AppBar';



import './Graph.css'
import Chart from './Chart.js'
import GraphSelectOptions from './GraphSelectOptions.js'


//connect to redux
const mapStateToProps = state => ({
    state
});

class Graph extends Component {
    constructor(props) {
      super(props) 
      this.timer = null;
      this.state = {
        selectedDevice: '3a0027001647343339383037',
        timeSelection: 12,
        switch: true,
        top: false,
      };
    }

//fetch user info
  componentDidMount() {
    this.props.dispatch({type: USER_ACTIONS.FETCH_USER});
    this.fetchDevices();
    this.fetchSpl(); 
    this.timer = setInterval(this.tick, 500);  //<-- setting interval for reset timer (.5 seconds)
  }
//check user - boot unauthorized user
  componentDidUpdate() {
    if (!this.props.state.user.isLoading && this.props.state.user.userName === null) {
      this.props.history.push('home');
    }
  }

//stop timer when leaving page
componentWillUnmount () {
  clearInterval(this.timer);
}

//function to run every .5 seconds (update spl) IF switch is on
tick = () => {
  if (this.state.switch) {
    this.fetchSpl(); 
  }
}

//GET devices from db
fetchDevices = () => {
  console.log('fetching devices');
  this.props.dispatch({
    type: 'FETCH_DEVICES'
  });
}

//GET most recent SPL data from db
fetchSpl = () => {
  console.log('in fetchSpl');
  this.props.dispatch({
    type:'FETCH_SPL',
    payload: {
      quantity: this.state.timeSelection,
      selectedDevice: this.state.selectedDevice
    }
  })
}

//set query parameter in FETCHSPL to controll amout of data to be shown in chart
handleTimeSelect = (event) => {
  console.log('select time value: ',event.target.value);
  this.setState({
    timeSelection: event.target.value
  });    
  this.fetchSpl(); 
}

handleDeviceSelect = (event) => {
  console.log('select value: ',event.target.value);
  this.setState({
    selectedDevice: event.target.value
  });    
  this.fetchSpl(); 
}

//switch toggles auto update 
handleSwitch = name => event => {
  this.setState({ [name]: event.target.checked });  
};

toggleDrawer = (side, open) => () => {
  this.setState({
    [side]: open,
  });
};




  render() {


  //looping through devices & returning <option> elemnts to populate <select>
  let selectItemsArray = this.props.state.devicesReducer.devicesReducer && this.props.state.devicesReducer.devicesReducer; 
  let selectOptions = selectItemsArray.map((element) => {
      return <GraphSelectOptions key={element.device_id}
                                    element={element}/>
  })


  let drawerContents = (
    <Card position="static" id="graphOptionsDrawer">

    {/* Select time */}
        <select className="graphSelect" onChange={this.handleTimeSelect}>
          <option value="12">1 Minute</option>
          <option value="24">2 Minutes</option>
          <option value="60">5 Minutes</option>
          <option value="120">10 Minutes</option>
          <option value="720">1 Hour</option>
        </select>
      
  {/* Select device */}
        <select className="graphSelect" onChange={this.handleDeviceSelect}>
          {selectOptions}
        </select>

        <select className="graphSelect">
          <option value="12">Small</option>
          <option value="24">Medium</option>
          <option value="60">Large</option>
        </select>

    </Card>

  )

    return (
      <div id="graphContainer">

        <Card id="graphContent">
          <CardContent>

            <div id="graphInfoIcon">
              <IconButton >
                <Info/>
              </IconButton>
            </div>

            <div className="graphChart">
                <Chart/>   
              </div>

            <CardActions>

              <Button onClick={this.toggleDrawer('top', true)}>Options</Button>

               <FormControlLabel
                control={
                  <Switch
                    checked={this.state.switch}
                    onChange={this.handleSwitch('switch')}
                    value="switch"
                  />
                }
                />
            </CardActions>

              

              {/* <Button variant="raised" color="primary" className="buttonWire">See Instant</Button> */}
          </CardContent>
        </Card>



        <Drawer anchor="top" open={this.state.top} onClose={this.toggleDrawer('top', false)}>
          <div
            tabIndex={0}
            role="button"
            // onClick={this.toggleDrawer('top', false)}
            // onKeyDown={this.toggleDrawer('top', false)}
            >
            {drawerContents}
          </div>
        </Drawer>

      </div>

    );
  }
}

// allows us to use <App /> in index.js
export default connect(mapStateToProps)(Graph);
