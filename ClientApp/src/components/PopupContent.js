import React, { Component } from 'react';
import './PopupContent.css';

export class PopupContent extends Component {
  static displayName = PopupContent.name;
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
    let crime = this.props.crime;
    return (
      <>
      <h4>{crime.location}</h4>
        <p>ID: {crime.crimeID}</p>
        <p>Crime: {crime.crimeType}</p>
        <p>Date: {crime.month}</p>
        
      </>
    );
  }
}