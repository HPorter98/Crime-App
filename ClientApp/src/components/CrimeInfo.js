import React, { Component } from 'react';

export class CrimeInfo extends Component {
    static displayName = CrimeInfo.name;
    constructor(props) {
      super(props)
      this.state = {

      }
    }

    render() {
        return (
            <>
                <p>Crime Statistics</p>
                {console.log(this.props.crimes)}
                {this.props.filter}
            </>
        );
    }
}