import React, { Component } from 'react';
import { Row } from 'reactstrap';
import './styles/Filter.css';

export class Filter extends Component {
    static displayName = Filter.name;
    constructor(props) {
      super(props)
      this.state = { selectedFilter: "", collapsed: true}
      this.setParentFilter = this.setParentFilter.bind(this);
      this.handleReset = this.handleReset.bind(this);
      this.toggleFitler = this.toggleFitler.bind(this);
    }

    setParentFilter(e) {
        this.setState({selectedFilter: e.target.value});
        this.props.setFilter(e.target.value);
    }
    
    handleReset() {
        this.props.resetFilter();
        this.setState({selectedFilter: ""})
    }

    toggleFitler() {
        this.setState({
            collapsed: !this.state.collapsed
        });
    }

    render() {
        return (
                <div className='filterContainer'>
                    <h3>Filter</h3>
                    <div style={{margin: "inherit"}}> 
                        {this.props.crimeTypes.length > 0 ? this.props.crimeTypes.map(function (element) {
                            return <Row style={{margin: "inherit", paddingLeft: 0}}>
                                <div className='form-check'>
                                    <input className='form-check-input'
                                        key={element} 
                                        type='checkbox'
                                        value={element}
                                        checked={(this.state.selectedFilter === element)}
                                        onChange={this.setParentFilter}
                                        id='flexCheckDefault'
                                    />
                                    <label className='form-check-label' for="flexCheckDefault">
                                        {element}
                                    </label>
                                    <div className='colourCode' style={{backgroundColor: this.props.colourMap[element]}}>&nbsp;</div>
                                </div>
                                
                            </Row>

                        }, this) : <p>Types not found</p>}
                    </div>
                    <button onClick={this.handleReset} className='resetButton'>Reset Filter</button>
                </div>
        );
    }
}