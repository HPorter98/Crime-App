import React, { Component } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { Filter } from './Filter';
import { SearchBar} from './SearchBar';

import "./SearchBar.css";
import "./MapComp.css";
import 'mapbox-gl/dist/mapbox-gl.css';
import { PopupContent } from './PopupContent';

export class MapComp extends Component {
    static displayName = MapComp.name;
    constructor(props) {
        super(props)
        this.state = {
            lng: -2.587910,
            lat: 51.454514,
            input: "",
            crime: [],
            crimeTypes: [],
            colourMap: null,
            filter: "",
            radius: 0.25,
            error: false,
            errorMessage: "",
            selectedCrime: null
        }

        this.mapRef = React.createRef(null);
        this.inputRef = React.createRef(this.state.input);
        this.lngRef = React.createRef({ lng: 0 });
        this.latRef = React.createRef({ lat: 0 });
        this.radiusRef = React.createRef({radius : 0});

        this.handleInput = this.handleInput.bind(this);
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
                return <Marker key={element.crimeID} color={colours[element.crimeType]} longitude={element.longitude} latitude={element.latitude} anchor='bottom' onClick={() => { <PopupContent />}} />
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
                style={{ width: 'auto', height: 400 }}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken= {process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                ref={this.mapRef}>

                <Marker color={'#FF0000'} longitude={this.state.lng} latitude={this.state.lat} anchor="bottom" />
                {this.state.crime.crimes?.length > 0 ? this.state.crime.crimes.map((element) => {
                    if(this.state.filter === element.crimeType) {
                        // return <Popup longitude={element.longitude} latitude={element.latitude}>
                        // Pop Up!
                        // </Popup>
                        return <Marker key={element.crimeID}
                        color={colours[element.crimeType]}
                        longitude={element.longitude}
                        latitude={element.latitude}
                        anchor="bottom-right"
                        onClick={(e) => {
                            console.log("Click");
                            e.originalEvent.stopPropagation();
                            this.setState({selectedCrime: element})
                        }}
                        />
                    } else if (this.state.filter === ""){
                        return <Marker key={element.crimeID}
                        color={colours[element.crimeType]}
                        longitude={element.longitude}
                        latitude={element.latitude}
                        anchor='bottom'
                        onClick={(e) => {
                            console.log("Click");
                            e.originalEvent.stopPropagation();
                            this.setState({selectedCrime: element})
                        }}
                        />
                    } else {return 0}
                }, this) : <></>}
                {this.state.selectedCrime && (<Popup
                anchor='bottom'
                offset={50}
                longitude={this.state.selectedCrime.longitude}
                latitude={this.state.selectedCrime.latitude}
                onClose={() => this.setState({crimeElement: null})}
                style={{width: "100px"}}>
                    {
                    <PopupContent crime={this.state.selectedCrime}/>}
                </Popup>)}
            </Map>
        )
    };

    async populateCrimeType() {
        const response = await fetch(`crime/distinctValues`);
        if(response.status !== 200) {
            this.setState({error: true, errorMessage: response.status}); 
        } else {
            const data = await response.json();
            console.log(data);
            const typeMap = {}

            const colourArr = ["#F9A739", "#B9F939", "#65F939", "#734F05", "#177305",
                "#05734B", "#6B8C80", "#B6B6B6", "#944CF6", "#0A0A0A",
                "#770000", "#B5802F", "#1BBD62"];
    
            for (let index = 0; index < data.types.length; index++) {
                typeMap[data.types[index]] = colourArr[index];
            }
    
            console.log(typeMap);
    
            this.setState({crimeTypes: data.types, colourMap: typeMap }); 
        }
    }

    async populateCrimeData() {
        const response = await fetch(`crime?lng=${this.lngRef.lng}&lat=${this.latRef.lat}&radius=${this.radiusRef.radius}`);
        if(response.status !== 200) {
            console.log("Error: " + response.status)
            this.setState({
                error: true,
                errorMessage: response.status
            });
        } else {
            const data = await response.json();
            this.setState({
                crime: data,
                error: false,
                errorMessage: ""
            });
        }
    }

    async getLocation() {
        if(this.state.input !== "") {
            const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
    
            const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.state.input}.json?access_token=${accessToken}`);
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
            this.setState({error: true, errorMessage: "Input field is empty"});
        }
    }

    render() {
        return (
            <>
                <h1> Avon and Somerset Crime Locator</h1>
                <SearchBar handleInput={this.handleInput} getLocation={this.getLocation}/>
                <div className='MainBody'>
                    <div className='mapBody'>
                        <div className='map'>
                            {this.renderMap()}
                        </div>
                    
                        {this.state.error ? <p>Error: {this.state.errorMessage}</p> : <></>}
                        <Filter crimeTypes={this.state.crimeTypes} setFilter={this.setFilter} resetFilter={this.resetFilter} colourMap={this.state.colourMap}/>
                    </div>
                </div>
            </>
        )
    };
};