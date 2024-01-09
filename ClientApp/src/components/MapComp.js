import React, { Component } from 'react';
import Map, { Marker, Popup } from 'react-map-gl';
import { Filter } from './Filter';
import { SearchBar} from './SearchBar';
import { Row, Col } from 'reactstrap';

import "./SearchBar.css";
import "./MapComp.css";
import "mapbox-gl/dist/mapbox-gl.css";
import { PopupContent } from './PopupContent';

export class MapComp extends Component {
    static displayName = MapComp.name;
    constructor(props) {
        super(props)
        this.state = {
            lng: -2.587910,
            lat: 51.454514,
            maxLng: 0,
            minLng: 0,
            maxLat: 0,
            minLat: 0,
            input: "",
            crime: [],
            crimeTypes: [],
            colourMap: null,
            filter: "",
            radius: 0.25,
            error: false,
            errorMessage: "",
            selectedCrime: null,
            hasSearched: false
        }

        this.mapRef = React.createRef(null);
        this.inputRef = React.createRef(this.state.input);
        this.lngRef = React.createRef({ lng: 0 });
        this.latRef = React.createRef({ lat: 0 });
        this.radiusRef = React.createRef({radius : 0});

        this.handleInput = this.handleInput.bind(this);
        this.changeLocation = this.changeLocation.bind(this);
        this.withinRange = this.withinRange.bind(this);
        this.getLocation = this.getLocation.bind(this);
        this.renderMap = this.renderMap.bind(this);
        this.returnMarkers = this.returnMarkers.bind(this);
        this.setFilter = this.setFilter.bind(this);
        this.resetFilter = this.resetFilter.bind(this);
        this.handleRadiusChange = this.handleRadiusChange.bind(this);
    }

    componentDidMount() {
        this.populateCrimeType();
        this.getRadiusBoundaries();
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

    handleRadiusChange(stateToChange, event) {
        this.setState({[stateToChange] : event.target.value},
             () => {
                if (this.state.hasSearched) {
                    this.getLocation();
                }
             });
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
                style={{ width: 'inherit', height: 400, borderRadius: 10}}
                mapStyle="mapbox://styles/mapbox/streets-v12"
                mapboxAccessToken= {process.env.REACT_APP_MAPBOX_ACCESS_TOKEN}
                ref={this.mapRef}>

                <Marker color={'#FF0000'} longitude={this.state.lng} latitude={this.state.lat} anchor="bottom" />
                <Marker color={'#00018B'} longitude={-3.621494} latitude={51.076515} anchor="bottom" />
                <Marker color={'#00008B'} longitude={-2.070337} latitude={51.898127} anchor="bottom" />
                <Marker color={'#00008B'} longitude={-2.424529} latitude={50.549723} anchor="bottom" />
                <Marker color={'#00008B'} longitude={-2.070337} latitude={51.898127} anchor="bottom" />
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
                    }
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

    async getRadiusBoundaries(){
        const response = await fetch(`crime/radiusBoundaries`);
        if(response.status !== 200) {
            this.setState({error: true, errorMessage: response.status}); 
        } else {
            const data = await response.json();
            console.log(data);

            // The boundaries array has a structure of [minLng, maxLng, minLat, maxLat]
            this.setState({
                minLng: parseFloat(data.bounds[0]),
                maxLng: parseFloat(data.bounds[1]),
                minLat: parseFloat(data.bounds[2]),
                maxLat: parseFloat(data.bounds[3])
            });
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

    withinRange(x, min, max) {
        return x >= min && x <= max;
    }

    async getLocation() {
        
        if(this.state.input !== "") {
            const accessToken = process.env.REACT_APP_MAPBOX_ACCESS_TOKEN;
    
            // Retrieve data from backend
            const response = await fetch(`https://api.mapbox.com/geocoding/v5/mapbox.places/${this.state.input}.json?access_token=${accessToken}`);
            const data = await response.json();

            console.log(data);
            
            // Set longtitude, latitude and radius ref points
            this.lngRef = { lng: data.features[0].center[0] };
            this.latRef = { lat: data.features[0].center[1] };
            this.radiusRef = {radius: this.state.radius};

            console.log(this.withinRange(0.5, 0, 1));
            console.log("Boundaries lat-lng",this.state.minLat, this.state.maxLat, this.state.minLng, this.state.maxLng);
            console.log("target", parseFloat(this.lngRef.lng), parseFloat(this.latRef.lat));

            console.log(this.withinRange(parseFloat(this.lngRef.lng), this.state.minLng, this.state.maxLng));
            console.log(this.withinRange(parseFloat(this.latRef.lat), this.state.minLat, this.state.maxLat));


            if (this.withinRange(parseFloat(this.lngRef.lng), this.state.minLng, this.state.maxLng) && this.withinRange(parseFloat(this.latRef.lat), this.state.minLat, this.state.maxLat)) {
                console.log("Within Bounds!");
                
                // Set longtitude, latitude and hasSearched in state
                this.setState({ lng: data.features[0].center[0], lat: data.features[0].center[1], hasSearched: true});
        
                // Set crime data in state
                await this.populateCrimeData();
                
                // Change location on the map
                this.changeLocation(data.features[0].center[0], data.features[0].center[1]);
            } else {console.log("Out of bounds!");}
        } else {
            this.setState({error: true, errorMessage: "Input field is empty"});
        }
    }

    render() {
        return (
            <div className='contentContainer'>
                <h1> Avon and Somerset Crime Locator</h1>
                <Row style={{paddingBottom: "10px"}}>
                    <SearchBar handleInput={this.handleInput} handleRadiusChange={this.handleRadiusChange} getLocation={this.getLocation}/>
                </Row>
                
                {/* <SearchBar handleInput={this.handleInput} getLocation={this.getLocation}/> */}
                <Row>
                    <Col md="3">
                        <Filter crimeTypes={this.state.crimeTypes} setFilter={this.setFilter} resetFilter={this.resetFilter} colourMap={this.state.colourMap}/>
                    </Col>
                    <Col>
                        <div className='MainBody'>
                            <div className='mapBody'>
                                <div className='map'>
                                    {this.renderMap()}
                                </div>
                            
                                {this.state.error ? <p>Error: {this.state.errorMessage}</p> : <></>}
                            </div>
                        </div>
                    </Col>
                </Row>
            </div>
        )
    };
};