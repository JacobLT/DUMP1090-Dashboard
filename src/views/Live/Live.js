import React, { Component } from 'react'

class Table extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aircraft: []
    };
    setInterval(this.getAircraft, 5000);
  }

  getAircraft = async () => {
    // This function should fetch all of the aircraft from the json file and store it in this.positions
    this.aircraft = [];
    await fetch(process.env.REACT_APP_DUMP1090_URL + '/dump1090/data/aircraft.json').then(response => response.json()).then((jsonData => {
        for (var i = 0; i < Object.keys(jsonData['aircraft']).length; i++) {
          if (!(typeof jsonData.aircraft[i]['lat'] === 'undefined' || typeof jsonData.aircraft[i]['lon'] === 'undefined')) {
            this.aircraft.push(jsonData['aircraft'][i]);
          }
        }
        this.setState({ aircraft: this.aircraft});
      }
    ))
      .catch((error) => {
        // handle your errors here
        console.error(error)
      });
  }

  renderTableData() {
    return this.state.aircraft.map((aircraft, index) => {
      const {hex, squawk, flight, lat, lon, altitude, vert_rate, track, speed} = aircraft //destructuring
      return (
        <tr key={hex}>
          <td>{hex}</td>
          <td>{squawk}</td>
          <td>{flight}</td>
          <td>{lat}</td>
          <td>{lon}</td>
          <td>{altitude}</td>
          <td>{vert_rate}</td>
          <td>{track}</td>
          <td>{speed}</td>
        </tr>
      )
    })
  }

  renderTableHeader() {
    let header = ['hex', 'squawk', 'flight', 'latitude', 'longitude', 'altitude', 'vertical rate', 'heading', 'speed'];
    return header.map((key, index) => {
      return <th key={index}>{key.toUpperCase()}</th>
    })
  }

  render() {
    return (
      <div>
        <h1 id='title'>Currently Tracked Aircrafts</h1>
        <table id='aircraft'>
          <tbody>
          <tr>{this.renderTableHeader()}</tr>
          {this.renderTableData()}
          </tbody>
        </table>
      </div>
    )
  }
}
export default Table;
