import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Map from './Map';
import ListContainer from './ListContainer';


function getOneOnject(){
  return {
    "venue": {
     "categories": [{"id": "4bf58dd8d48988d150941735", "name": "Spanish Restaurant"}],
     "id": 'abcd',
     "location": {
          "lat": 18.517027817210945,
         	"lng": 73.85484481593303,
         "formattedAddress" :["Appa Balwant Chowk","Pune 411001","Mahārāshtra","India", ]
        },
   "name": "New Poona Bakery"
     }
   }
}

class App extends Component {

  state = {
    locations: [getOneOnject()]
  }

  cacheButtonObject = {
    compo: null,
    pressed: null,
    drawer: null,
    header: null
  }

  setDrawerButton(){
    this.cacheButtonObject.compo = document.getElementById("hamburger-button");
    this.cacheButtonObject.pressed = false;
    this.cacheButtonObject.drawer = document.getElementById("list-container");

  }

  componentDidMount(){
    //this.mapChildObject.callMethod();
    this.setDrawerButton();
    
  }

  listContainerDisplay = (e) => {
    if(this.cacheButtonObject.pressed){
      this.cacheButtonObject.drawer.style.left = "-400px";
      this.cacheButtonObject.pressed = false;

      
    }else{
      this.cacheButtonObject.drawer.style.left = "0px";
      this.cacheButtonObject.pressed = true;

    }
    this.cacheButtonObject.compo.classList.toggle("change");
    
  }

  drawerItemSelectionAction = () => {

      //console.log("YES - 0");
      //console.log(this.cacheButtonObject.compo.classList);
      if(this.cacheButtonObject.compo.classList[0] === ("change")){

          //console.log("YES - 1");

          if(this.cacheButtonObject.pressed){
            this.cacheButtonObject.drawer.style.left = "-400px";
            this.cacheButtonObject.pressed = false;
            this.cacheButtonObject.compo.classList.toggle("change");
          }
      }
  }
  
  
  placesFoundByFourSquare = (event , placename) => {

    event.preventDefault();

    let url = new URL("https://api.foursquare.com/v2/venues/explore");
    let params = {
      
                
      query: 'café,food-truck,restaurant',
      near: placename,
      limit: 50,
      radius: 100,
      client_id: "VVZNTZCTW20DLYBQBYD20ZMW5WWEYIM5V4FNL0041WCG4U3Q",
      client_secret: "UZRNMMDE0IEPBJ2XIOURKNGBKVWOHUFUY14LTRQNIOPDSWFB",
      v: "20181101"
    };

    url.search = new URLSearchParams(params);

    let  resaturantArraysObject = [];

    fetch(url).then((response) => {
        return response.json();
    }).then((response)=>{
      //console.log(response);
      if(response.meta.code === 200){
        
        resaturantArraysObject = 
          response.response.groups[0].items ;

        console.log(resaturantArraysObject);

        resaturantArraysObject.msg = true;
        
      }else{
        resaturantArraysObject.msg = false;
      }
    }).catch((error) => {
      
      resaturantArraysObject.msg = false;

    }).then(() => {

      this.setState({
        locations: resaturantArraysObject
      });
  
      
      this.listContainerChildObject.notifyUpdateLocations();
      this.mapChildObject.notifyUpdateLocations();
    
    });
    
  }

  getFilteredMarker = (filteredLocation) => {
    //console.log(filteredLocation);
//        console.log(this);
    if(this.mapChildObject){
      this.mapChildObject.getFilterMarker(filteredLocation);
    }
    
};

    //this.mapChildObject.getFilterMarker(filteredLocation) };



  getLocations = () => {
//    console.log(this.state.locations);
    return this.state.locations;
  } 

  linkListClickToMap = (restaurant) => {
      if(this.mapChildObject){
        this.mapChildObject.linkListClickToMapMarker(restaurant);
      }
  }



  render() {
    
    
    return (
      <main>
    
       
       <section id="main-section">

       
       <div id="hamburger-button" onClick={this.listContainerDisplay}>
          <div className='bar1'></div>
          <div className='bar2'></div>
          <div className='bar3'></div>
       </div>

       <ListContainer
            formSubmitEvent = {this.placesFoundByFourSquare}
            getLocations = {this.getLocations}
            getFilteredMarker = {(this.getFilteredMarker)}
            linkListClickToMap = {this.linkListClickToMap}
            drawerItemSelectionAction = {this.drawerItemSelectionAction}
            ref={listContainer => {this.listContainerChildObject = listContainer}}
        ></ListContainer>

       <Map ref={map => {this.mapChildObject = map}}
       getLocations = {this.getLocations}
       ></Map>
       
      
      </section>
      </main>
    );
  }
}

export default App;

