import React, { Component } from 'react';
import './MarkerPopup.css';

export class MarkerPopup extends Component {
  static displayName = MarkerPopup.name;
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  render() {
    let crime = this.props.crime;
    return (
      <div className='pop'>
        <ul>
          <li>{crime.crimeID}</li>
          <li>{crime.crimeType}</li>
          <li>{crime.month}</li>
          <li>{crime.reportedBy}</li>
        </ul>
        
      </div>
    );
  }
}