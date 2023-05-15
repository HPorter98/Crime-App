import React, { Component } from 'react';
import Map, { Marker } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { data } from 'jquery';
import mapboxgl from 'mapbox-gl';
import { MapComp } from './MapComp';

export class Home extends Component {
  static displayName = Home.name;
  constructor(props) {
    super(props)
    this.state = {
      crimesArr: [],
      lng: 0,
      lat: 0,
      index: 0,
      input: "",
      // TODO: Store a hashmap in state to store crime values
      crimeTypes: null
    }


    this.randomCooridnates = this.randomCooridnates.bind(this);
    this.returnMarkers = this.returnMarkers.bind(this);
  }

  componentDidMount() {
  }

  randomCooridnates(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  returnMarkers() {
    if (this.state.crimesArr.crimes?.length > 0) {
      <Marker longitude={this.state.crimesArr.crimes[6].longitude} latitude={this.state.crimesArr.crimes[6].latitude} anchor='bottom'/> }
      else {
      <Marker longitude={this.state.lng} latitude={this.state.lat} anchor="bottom" /> };
  }

  render() {
    return (
      <>
        <h1>Crime App</h1>
        <MapComp/>
      </>
    );
  }
}
