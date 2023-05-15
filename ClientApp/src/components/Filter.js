import React, { Component, useState } from 'react';
import './Filter.css';
import { event } from 'jquery';

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
      this.state = { selectedFilter: ""}
      this.setParentFilter = this.setParentFilter.bind(this);
      this.handleReset = this.handleReset.bind(this);
    }

    setParentFilter(e) {
        this.setState({selectedFilter: e.target.value});
        this.props.setFilter(e.target.value);
    }
    
    handleReset() {
        this.props.resetFilter();
        this.setState({selectedFilter: ""})
    }

    render() {
        return (
            <>
            <div className='filter'>
                {this.props.crimeTypes.length > 0 ? this.props.crimeTypes.map(function (element) {
                    return <div className='item'>
                        <input 
                            key={element} 
                            type='checkbox'
                            value={element}
                            checked={(this.state.selectedFilter == element)}
                            onChange={this.setParentFilter}
                        
                        /> {element}
                        <div className='colourCode' style={{backgroundColor: this.props.colourMap[element]}}>&nbsp;</div>
                    </div>

                }, this) : <p>Types not found</p>}
            </div>
            <button onClick={this.handleReset}>Reset Filter</button>
            </>
        );
    }
}