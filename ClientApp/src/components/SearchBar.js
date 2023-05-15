import { Component } from "react";
import "./SearchBar.css";


export class SearchBar extends Component {
    static displayName = SearchBar.name;
    constructor(props) {
        super(props)
        this.state = {

        }
    }

    // Use an arrow function to pass event and parameter. From here only use the props
    // function passed to the component. LESS CODE.

    render() {
        return(
            <div className="searchBar">
                <input type='text' placeholder='Enter Location' onChange={(e) => this.props.handleInput("input", e)}></input>
                <label>Select Radius (km)</label>
                <select onChange={(e) => this.props.handleInput("radius", e)} placeholder='Select Radius'>
                    <option value={0.25}>0.25</option>
                    <option value={0.50}>0.50</option>
                    <option value={1}>1</option>
                    <option value={1.5}>1.5</option>
                    <option value={2}>2</option>
                </select>
                <button onClick={this.props.getLocation}>Find Crimes</button>
            </div>
        )
    }
}