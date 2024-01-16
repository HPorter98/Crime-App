import { Component } from "react";
import "./styles/SearchBar.css";
import "./ErrorComp";
import ErrorComp from "./ErrorComp";


export class SearchBar extends Component {
    static displayName = SearchBar.name;
    constructor(props) {
        super(props)
        this.state = {}
    }

    render() {
        return(
            <>
            <div className="searchBar">
                <div style={{display: "inline-block"}}>
                    <input type='text' placeholder='Enter Location' onChange={(e) => this.props.handleInput("input", e)}></input>
                    <label>Select Radius (km)</label>
                    <select onChange={(e) => this.props.handleRadiusChange("radius", e)} placeholder='Select Radius'>
                        <option value={0.25}>0.25</option>
                        <option value={0.50}>0.50</option>
                        <option value={1}>1</option>
                        <option value={1.5}>1.5</option>
                        <option value={2}>2</option>
                    </select>
                    <button onClick={this.props.getLocation}>Find Crimes</button>
                </div>
                {this.props.error ? <ErrorComp message = {this.props.errorMessage}/> : <></>}
            </div>
            
            </>
        )
    }
}