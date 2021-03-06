import React from 'react';
import ListView from './ListView';

export default class ListContainer extends React.Component{

    state = {

        locationQuery: "",
        placesQuery: "",
        

        newLocations: (() => {
            let arr = this.props.getLocations();
            arr.msg = true;
            return arr;
        })()


    }

    //Aria-Live here.

    retriveBackFocus = () =>{
        this.listViewdObject.retriveBackFocus();
    }

    notifyUpdateLocations = () => {
        this.setState({
            newLocations: this.props.getLocations(),
        });
        //this.listViewdObject.notifyUpdateLocations(this.state.newLocations);
    }

    locationQueryOnChange = (event) =>{
        
        this.setState({
            locationQuery: event.target.value
        });
    }

    placesQueryonChange = (event) =>{
        
        this.setState({
            placesQuery: event.target.value
        });
        //this.listViewdObject.notifyUpdatePlaces(this.state.placesQuery);

    }

    getnewLocations = () => {
        return this.state.newLocations; 
    }

    getNewPlaceQuery = () => {
        return this.state.placesQuery;
    }

    getLocationQuery = () => {
        return this.state.locationQuery;
    }
    

    render(){
       return ( <section id="list-container"  >

            
       <header id="list-container-header">
              <h1>Food Search</h1>
                
       </header>            

            <div id="main-input-container">
            
            <section id="form-style">
            <h2 id="filter-result-header">Filter Result</h2>

            <form onSubmit={ (event) => { this.setState({placesQuery: ""}); this.props.formSubmitEvent(event,this.state.locationQuery);} }>

                <input type="text" value={this.state.locationQuery} onChange={this.locationQueryOnChange}
                name="field1" placeholder="Enter Your Location" aria-label='Enter Your Location' 
                aria-describedby='set-location-describe'
                />
                <p id='set-location-describe'>Enter Your Location Like Chicago,IL or similar</p>

                
                <input id="submit-button" 
                 type="submit" value="Set Food Location" />

                <input type="text" value={this.state.placesQuery} onChange={this.placesQueryonChange}
                name="field2" placeholder="Filter Result By Name Or Type" aria-label='Filter Your Result'
                aria-describedby='filter-places-describe'
                />
                <p id='filter-places-describe'>Filter Your Results By Name Or Type Of Places</p>
                

                
            
            </form>
            </section>

            <ListView
            getnewLocations = {this.getnewLocations}
            getNewPlaceQuery = {this.getNewPlaceQuery}
            getLocationQuery = {this.getLocationQuery}
            getFilteredMarker = {this.props.getFilteredMarker}
            linkListClickToMap = {this.props.linkListClickToMap}
            linkListClickToMapFocus = {this.props.linkListClickToMapFocus}
            drawerItemSelectionAction = {this.props.drawerItemSelectionAction}
            drawerItemSelectionActionFocus = {this.props.drawerItemSelectionActionFocus}

            ref={listView => {this.listViewdObject = listView}}
            ></ListView>

            </div>


    </section> )
    }





}