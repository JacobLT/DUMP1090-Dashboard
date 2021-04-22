import React, { Component } from 'react';
import { Map, InfoWindow, GoogleApiWrapper, Marker } from 'google-maps-react';

export class MapContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      aircraft: [],
      showingInfoWindow: false,  //Hides or the shows the infoWindow
      activeAircraft: {},          //Shows the active marker upon click
      selectedAircraft: {}          //Shows the infoWindow to the selected place upon a marker
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
        this.displayMarkers();
      }
    ))
      .catch((error) => {
        // handle your errors here
        console.error(error)
      });
  }

  onMarkerClick = (props, marker, e) =>
    this.setState({
      selectedAircraft: props,
      activeAircraft: marker,
      showingInfoWindow: true
    });

  onClose = props => {
    if (this.state.showingInfoWindow) {
      this.setState({
        showingInfoWindow: false,
        activeAircraft: null
      });
    }
  };

  // Plots markers onto the map
  displayMarkers = () => {
    return this.state.aircraft.map((aircraft, index) => {
      const icon = {
        path: "M 22.476562 12.984375 L 14.957031 7.148438 C 15.066406 5.160156 15.128906 3.816406 15.128906 3.789062 L 15.128906 3.773438 C 15.128906 2.449219 14.101562 0 12.640625 0 L 12.574219 0 C 11.109375 0 10.082031 2.449219 10.082031 3.773438 L 10.082031 3.789062 C 10.082031 3.816406 10.144531 5.132812 10.253906 7.089844 L 2.59375 12.984375 C 2.40625 13.125 2.21875 13.414062 2.21875 13.683594 L 2.21875 14.34375 C 2.21875 14.648438 2.46875 14.890625 2.785156 14.890625 C 2.835938 14.890625 2.882812 14.886719 2.929688 14.875 L 10.5625 13 C 10.582031 12.996094 10.601562 12.984375 10.621094 12.980469 C 10.652344 13.398438 10.679688 13.820312 10.714844 14.242188 C 10.875 16.398438 11.035156 18.242188 11.199219 19.75 L 8.105469 22.273438 C 7.984375 22.375 7.863281 22.558594 7.863281 22.753906 L 7.863281 23.820312 C 7.863281 24.066406 8.058594 24.261719 8.308594 24.261719 C 8.351562 24.261719 8.390625 24.253906 8.429688 24.242188 L 11.703125 23.351562 C 12.003906 24.847656 12.269531 25 12.574219 25 L 12.640625 25 C 12.9375 25 13.207031 24.851562 13.503906 23.371094 L 16.703125 24.242188 C 16.742188 24.253906 16.785156 24.261719 16.824219 24.261719 C 17.074219 24.261719 17.269531 24.066406 17.269531 23.820312 L 17.269531 22.753906 C 17.269531 22.558594 17.148438 22.375 17.027344 22.273438 L 14.003906 19.808594 C 14.167969 18.289062 14.335938 16.425781 14.5 14.242188 C 14.527344 13.832031 14.558594 13.421875 14.585938 13.011719 L 22.136719 14.875 C 22.183594 14.886719 22.230469 14.890625 22.277344 14.890625 C 22.570312 14.890625 22.78125 14.660156 22.78125 14.34375 L 22.78125 13.683594 C 22.78125 13.46875 22.703125 13.15625 22.476562 12.984375 Z M 22.476562 12.984375 ",
        rotation: aircraft.track,
        scaledSize: new window.google.maps.Size(1, 1),
        anchor: { x: 10, y: 10 }
      };

      // Each markers individual data
      return <Marker
        icon={icon}
        key={index}
        id={index}
        flight_number={aircraft.flight}
        speed={aircraft.speed}
        altitude={aircraft.altitude}
        track={aircraft.track}
        position={
          {
            lat: aircraft.lat,
            lng: aircraft.lon
          }
        }
        onClick={this.onMarkerClick} />
    })
  }

  render() {
    return (
      <Map
        google={this.props.google}
        zoom={8}
        style={{ height: `75%`, width: '95%' }}
        initialCenter={{ lat: 52.056736, lng: 1.148220 }}
      >
        {this.displayMarkers()}

        <InfoWindow
          marker={this.state.activeAircraft}
          visible={this.state.showingInfoWindow}
          onClose={this.onClose}
        >
          <div>
            <h5>{this.state.selectedAircraft.flight_number}</h5>
            <p>Altitude: {this.state.selectedAircraft.altitude}ft</p>
            <p>Speed: {this.state.selectedAircraft.speed}kt</p>
            <p>Track: {this.state.selectedAircraft.track}°</p>
          </div>
        </InfoWindow>
      </Map>
    );
  }
}

export default GoogleApiWrapper({
  apiKey: (process.env.REACT_APP_GOOGLE_API_KEY)
})(MapContainer)
