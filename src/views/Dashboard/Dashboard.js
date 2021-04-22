import React, { Component } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Card,
  CardBody, CardHeader,
  CardTitle,
  Col,
  Row,
} from 'reactstrap';
import { CustomTooltips } from '@coreui/coreui-plugin-chartjs-custom-tooltips';

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aircraft: [],
      signal: 0.0,
      total: 0,
      last: 0,
      messages: 0,
      totalAircrafts: [],
      lastMessage: [],
      cpuArray: [],
      readerArray: [],
      networkArray: []
    };
    this.getSignal();
    this.getAircraft();
    this.updateTrackedAircraft();
    this.updateCpuUsage();
    this.updateReaderUsage();
    this.updateNetworkUsage();
    setInterval(this.getAircraft, 5000);
    setInterval(this.getSignal, 60000);
  }

  getSignal = async () => {
    // This function fetches the signal strength from a json file and stores it in this.state.signal
    this.signal = 0.0;
    await fetch(process.env.REACT_APP_DUMP1090_URL + '/dump1090/data/stats.json').then(response => response.json()).then((jsonData => {
      // Signal Strength
      this.signal = jsonData["last1min"]["local"]["signal"];
      this.setState({signal: this.signal});
      // Messages within the last minute
      this.messagesLast1Min = jsonData["last1min"]["messages"];
      this.setState({messagesLast1Min: this.messagesLast1Min});
      // Messages within the last 5 minutes
      this.messagesLast5Min = jsonData["last5min"]["messages"];
      this.setState({messagesLast5Min: this.messagesLast5Min});
      // Messages within the last 15 minutes
      this.messagesLast15Min = jsonData["last5min"]["messages"];
      this.setState({messagesLast15Min: this.messagesLast15Min});

      this.cpuUsage = jsonData["last1min"]["cpu"]["demod"];
      this.setState({cpuUsage: this.cpuUsage});
      this.readerUsage = jsonData["last1min"]["cpu"]["reader"];
      this.setState({readerUsage: this.readerUsage});
      this.networkUsage = jsonData["last1min"]["cpu"]["background"];
      this.setState({networkUsage: this.networkUsage});
      this.updateMessages();
      this.updateCpuUsage();
      this.updateReaderUsage();
      this.updateNetworkUsage();
      }

      ))
        .catch((error) => {
          // handle your errors here
          console.error(error)
        });
  }


  getAircraft = async () => {
    // This function should fetch all of the aircraft from the json file and store it in this.state.aircraft
    this.aircraft = [];
    await fetch(process.env.REACT_APP_DUMP1090_URL + '/dump1090/data/aircraft.json').then(response => response.json()).then((jsonData => {
        for (var i = 0; i < Object.keys(jsonData['aircraft']).length; i++) {
          if (!(typeof jsonData.aircraft[i]['lat'] === 'undefined' || typeof jsonData.aircraft[i]['lon'] === 'undefined')) {
            this.aircraft.push(jsonData['aircraft'][i]);
          }
        }
        this.setState({ aircraft: this.aircraft});
        this.updateTracked();
        this.updateTrackedAircraft();
        // this.updateMessages();
        // console.log(this.aircraft);
      }
    ))
      .catch((error) => {
        // handle your errors here
        console.error(error)
      });
  }

  updateTrackedAircraft = () => {
    this.totalAircrafts = this.state.totalAircrafts.concat(this.state.aircraft.length);
    this.setState({ totalAircrafts: this.totalAircrafts });
  }

  updateTracked = () => {
    // This function updates the total number of planes tracked this session
    this.current = this.state.aircraft.length;
    this.difference = this.current - this.state.last;
    if (this.difference > 0){
      const amount = this.state.total+this.difference
      this.setState({total: amount});
    }
    this.setState({last : this.current});
  }

  currentlyTrackedAircraft = () =>  {

    const aircraftChart = {
      labels: this.totalAircrafts,
      datasets: [
        {
          label: 'Aircrafts',
          data: this.totalAircrafts,
          fill: false,          // Don't fill area under the line
          borderColor: 'white'  // Line color
        }
      ]
    }

    const aircraftChartOpts2 = {
      tooltips: {
        enabled: false,
        custom: CustomTooltips
      },
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              color: 'transparent',
              zeroLineColor: 'transparent',
            },
            ticks: {
              fontSize: 2,
              fontColor: 'transparent',
            },

          }],
        yAxes: [
          {
            display: false,
          }],
      },
      elements: {
        line: {
          tension: 0.00001,
          borderWidth: 2,
        },
        point: {
          radius: 0,
          hitRadius: 10,
          hoverRadius: 4,
        },
      },
    };
    // This function returns the html for the currently tracked aircraft box
    return(
          <Col xs="12" sm="6" lg="6">
            <Card className="text-white bg-primary">
              <CardBody className="pb-0">
                <div className="text-value">{this.state.aircraft.length} </div>
                <div>Currently Tracked Planes</div>
                <small className="text-muted">Live Tracking</small>
              </CardBody>
              <div className="chart-wrapper mx-3" id="chartplane" style={{ height: '70px' }}>
                <Line data={aircraftChart} options={aircraftChartOpts2} height={70} />
              </div>
            </Card>
           </Col>
    )
  }


  signalStrength = () => {
    // This function returns the html for the signal strength bar
    const absSignal = Math.abs(this.state.signal); // positive version of signal
    const number = 100 - absSignal;
    return(
      <Col>
        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i><strong>Signal</strong>
              <div className="card-header-actions">
                <small className="text-muted">Signal updates every 1 minute</small>
              </div>
          </CardHeader>
          <CardBody id="signal">
            <div className="progress">
              <div className="progress-bar" role="progressbar" style={{ width: number+ "%" }} aria-valuenow={number} aria-valuemin="0"
                   aria-valuemax="100">-{absSignal}dB
              </div>
            </div>
          </CardBody>
        </Card>
       </Col>
      )
  }

  totalTracked = () => {
    // This function returns the box showing the total number of planes tracked this session
    return(<Col xs="12" sm="6" lg="6">
            <Card className="text-white bg-primary">
              <CardBody className="pb-0">
                <div className="text-value" id="updateTracked">{this.state.total} </div>
                <div>Total Planes Tracked</div>
                <small className="text-muted">In this session</small>
              </CardBody>
              <div className="chart-wrapper" style={{ height: 30 + 'px', marginTop: 40 + 'px' }} />
            </Card>
          </Col>);
  }

  updateMessages = () => {
    this.lastMessage = this.state.lastMessage.concat(this.messagesLast1Min);
    this.setState({ lastMessage: this.lastMessage });
  }

  updateMessagesGraph = () => {
    const updateMessagesChart = {
        labels: this.lastMessage,
        datasets: [
          {
            label: 'Messages',
            data: this.lastMessage,
            fill: true,          // Don't fill area under the line
            borderColor: '#63c2de'  // Line color
          },
        ]
      }

    const updateMessagesChartOpts = {
      tooltips: {
        enabled: false,
        custom: CustomTooltips
      },
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              color: 'transparent',
              zeroLineColor: 'transparent',
            },
            ticks: {
              fontSize: 2,
              fontColor: 'transparent',
            },

          }],
        yAxes: [
          {
            display: true,
          }],
      },
      elements: {
        line: {
          tension: 0.00001,
          borderWidth: 2,
        },
        point: {
          radius: 2,
          hitRadius: 10,
          hoverRadius: 4,
        },
      },
    };

    return(
      <Row>
        <Col>
          <Card>
            <CardBody>
              <Row>
                <Col sm="5">
                  <CardTitle className="mb-0">Plane Traffic</CardTitle>
                  <small>Data adds every 1 minute</small>
                </Col>
              </Row>
              <div className="chart-wrapper" style={{ height: 300 + 'px', marginTop: 40 + 'px' }}>
                <Line data={updateMessagesChart} options={updateMessagesChartOpts} height={300} />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>)
  }

  updateCpuUsage = () => {
    this.cpuArray = this.state.cpuArray.concat(this.state.cpuUsage);
    this.setState({ cpuArray: this.cpuArray });
  }

  updateReaderUsage = () => {
    this.readerArray = this.state.readerArray.concat(this.state.readerUsage);
    this.setState({ readerArray: this.readerArray });
  }

  updateNetworkUsage = () => {
    this.networkArray = this.state.networkArray.concat(this.state.networkUsage);
    this.setState({ networkArray: this.networkArray });
  }

  updateUsageGraph = () => {

    const updateUsageChart = {
      labels: this.cpuArray,
      datasets: [
        {
          label: 'CPU',
          data: this.cpuArray,
          fill: false,          // Don't fill area under the line
          borderColor: '#63c2de'  // Line color
        },
        {
          label: 'Reader',
          data: this.readerArray,
          fill: false,          // Don't fill area under the line
          borderColor: '#4dbd74'  // Line color
        },
        {
          label: 'Network',
          data: this.networkArray,
          fill: false,          // Don't fill area under the line
          borderColor: '#f86c6b'  // Line color
        }
      ]
    }

    const updateUsageChartOpts = {
      tooltips: {
        enabled: false,
        custom: CustomTooltips
      },
      maintainAspectRatio: false,
      legend: {
        display: false,
      },
      scales: {
        xAxes: [
          {
            gridLines: {
              color: 'transparent',
              zeroLineColor: 'transparent',
            },
            ticks: {
              fontSize: 2,
              fontColor: 'transparent',
            },

          }],
        yAxes: [
          {
            display: true,
          }],
      },
      elements: {
        line: {
          tension: 0.00001,
          borderWidth: 2,
        },
        point: {
          radius: 2,
          hitRadius: 10,
          hoverRadius: 4,
        },
      },
    };

    return(
      <Row>
        <Col>
          <Card>
            <CardBody>
              <Row>
                <Col sm="5">
                  <CardTitle className="mb-0">System Usage</CardTitle>
                  <small>All data shown in milliseconds</small>
                </Col>
              </Row>
              <div className="chart-wrapper" style={{ height: 300 + 'px', marginTop: 40 + 'px' }}>
                <Line data={updateUsageChart} options={updateUsageChartOpts} height={300} />
              </div>
            </CardBody>
          </Card>
        </Col>
      </Row>)
  }

  render() {
    return (
      <div className="animated fadeIn">
        <Row>
          {this.totalTracked()}
          {this.currentlyTrackedAircraft()}
        </Row>
        <Row>
          {this.signalStrength()}
        </Row>
          {this.updateMessagesGraph()}
          {this.updateUsageGraph()}
        </div>
    )
  }
}

export default Dashboard;
