import React, { Component } from 'react';
import Map, { Marker } from 'react-map-gl';
import { CrimeInfo } from './CrimeInfo';
import { Filter } from './Filter';
import { SearchBar} from './SearchBar';

import "./SearchBar.css";

export class MapComp extends Component {
    static displayName = MapComp.name;
    constructor(props) {
        super(props)
        this.state = {
            lng: -2.587910,
            lat: 51.454514,
            input: "",
            city:"",
            county:"",
            crime: [],
            crimeTypes: [],
            colourMap: null,
            filter: "",
            radius: 0.25,
            hasSearched: false
        }

        this.mapRef = React.createRef(null);
        this.inputRef = React.createRef(this.state.input);
        this.lngRef = React.createRef({ lng: 0 });
        this.latRef = React.createRef({ lat: 0 });
        this.radiusRef = React.createRef({radius : 0});

        this.handleInput = this.handleInput.bind(this);
        this.handleCityInput = this.handleCityInput.bind(this);
        this.handleCountyInput = this.handleCountyInput.bind(this);
        this.changeLocation = this.changeLocation.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.renderMap = this.renderMap.bind(this);
        this.returnMarkers = this.returnMarkers.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.resetFilter = this.resetFilter.bind(this);
    }

    componentDidMount() {
        this.populateCrimeType();
    }

    handleInput(stateToChange, event) {
        this.setState({[stateToChange] : event.target.value});
    }

    handleCityInput(e) {
        this.setState({ city: e.target.value });
    }
    handleCountyInput(e) {
        this.setState({ county: e.target.value });
    }

    changeLocation(lng, lat) {
        this.mapRef.current.flyTo({
            center: [lng, lat], zoom: 14,
            essential: true
        });
    }

    returnMarkers() {
        const colours = this.state.crimeTypes;
        if (this.state.crime.crimes?.length > 0) {
            this.state.crime.crimes.map(function (element) {
                return <Marker key={element.crimeID} color={colours[element.crimeType]} longitude={element.longitude} latitude={element.latitude} anchor='bottom' onClick={() => { console.log(element.crimeType) }} />
            })
        } else {
            return <></>;
        }
    }

    setFilter(filter) {
        this.setState({ filter: filter});
        // this.setState({ filter: [...this.state.filter, someVal]});
    }

    resetFilter() {
        this.setState({ filter : ""})
    }

    renderMap() {
        const colours = this.state.colourMap;
        return (
            <Map
                initialViewState={{
                    longitude: -2.587910,
                    latitude: 51.454514,
                    zoom: 14
                }}
                style={{ width: 1100, height: 400 }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken='pk.eyJ1IjoiaGFycnlwb3J0ZXI5OCIsImEiOiJja3pkMmdsbWIwMzdjMnFucm5sd3ZieWZ4In0.aXsRiKXTFdjc7X4XBFcXOw'
                ref={this.mapRef}>

                <Marker color={'#FF0000'} longitude={this.state.lng} latitude={this.state.lat} anchor="bottom" />
                {this.state.crime.crimes?.length > 0 ? this.state.crime.crimes.map((element) => {
                    if(this.state.filter === element.crimeType) {
                        return <Marker key={element.crimeID}
                        color={colours[element.crimeType]}
                        longitude={element.longitude}
                        latitude={element.latitude}
                        anchor='bottom'
                        onClick={() => { console.log(element.crimeType) }}
                        />
                    } else if (this.state.filter === ""){
                        return <Marker key={element.crimeID}
                        color={colours[element.crimeType]}
                        longitude={element.longitude}
                        latitude={element.latitude}
                        anchor='bottom'
                        onClick={() => { console.log(element.crimeType) }}
                        />
                    }
                }, this) : <></>}
            </Map>
        )
    };

    async populateCrimeType() {
        const response = await fetch(`crime/distinctValues`);
        const data = await response.json();

        const typeMap = new Object();
        const colourArr = ["#F9A739", "#B9F939", "#65F939", "#734F05", "#177305",
            "#05734B", "#6B8C80", "#B6B6B6", "#944CF6", "#0A0A0A",
            "#770000", "#B5802F", "#1BBD62"];

        for (let index = 0; index < data.types.length; index++) {
            typeMap[data.types[index]] = colourArr[index];
        }

        console.log(typeMap);

        this.setState({crimeTypes: data.types, colourMap: typeMap });
    }

    async populateCrimeData() {
        const response = await fetch(`crime?lng=${this.lngRef.lng}&lat=${this.latRef.lat}&radius=${this.radiusRef.radius}`);
        const data = await response.json();
        console.log(data.crimes.length);
        this.setState({
            crime: data,
            hasSearched: true
        });
    }

    async getLocation() {
        if(this.state.radius != 0) {
            const userInput = this.state.input + " " + this.state.city + " " + this.state.county;
            const accessToken = "pk.eyJ1IjoiaGFycnlwb3J0ZXI5OCIsImEiOiJja3pkMmdsbWIwMzdjMnFucm5sd3ZieWZ4In0.aXsRiKXTFdjc7X4XBFcXOw";
    
            const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${userInput}.json?access_token=${accessToken}`);
            const data = await response.json();
            console.log("getLocation: " + this.state.input);
    
            console.log(data);
    
            this.lngRef = { lng: data.features[0].center[0] };
            this.latRef = { lat: data.features[0].center[1] };
            this.radiusRef = {radius: this.state.radius};
    
            this.setState({ lng: data.features[0].center[0], lat: data.features[0].center[1] });
    
            await this.populateCrimeData();
    
            this.changeLocation(data.features[0].center[0], data.features[0].center[1]);
        } else {
            alert("Radius is empty");
        }
    }

    render() {
        return (
            <>
                <h1> Map! </h1>
                {this.renderMap()}
                <SearchBar handleInput={this.handleInput} getLocation={this.getLocation}/>
                <h4>Refine Your Search</h4>
                <input type='text' placeholder='City' onChange={this.handleCityInput}></input>
                <input type='text' placeholder='County' onChange={this.handleCountyInput}></input>

                {this.state.crime.crimes?.length > 0 ? 
                        <CrimeInfo crimes={this.state.crime.crimes} filter={<Filter crimeTypes={this.state.crimeTypes} setFilter={this.setFilter} resetFilter={this.resetFilter} colourMap={this.state.colourMap}/>}/>
                        : <p>Data not found</p>}
            </>
        )
    };
};