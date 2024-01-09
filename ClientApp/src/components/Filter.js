import React, { Component } from 'react';
import { Row, Col, Collapse, NavbarToggler } from 'reactstrap';
import './Filter.css';

// export function Filter(props) {
//     const [hasReset, updateReset] = useState(false);

//     const handleReset = _ => {
//         props.resetFilter();
//         updateReset(!hasReset);
//     }
//     const setParentFilter = (e) => {
//         props.setFilter(e.target.value)
//     }
//     return (
//         <>
//         <div className='filter'>
//             {console.log(props)}
//             {props.crimeTypes.length > 0 ? props.crimeTypes.map(function (element, id = 0) {
//                 id++;
//                 return <div className='item'>
//                     <input 
//                         key={element} 
//                         type='checkbox'
//                         value={element}
//                         onChange={setParentFilter}
                    
//                     /> {element}
//                 </div>

//             }, this) : <p>Types not found</p>}
//         </div>
//         <button onClick={handleReset}>Reset Filter</button>
//         </>
//     );
// }

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