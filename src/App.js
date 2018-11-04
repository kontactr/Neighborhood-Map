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
    
    this.cacheButtonObject.compo.addEventListener("keyup" , (event) =>{
        if(event.keyCode === 13 || event.keyCode === 32){
            this.listContainerDisplay(event);          
        }
    });

    window.onkeydown = function(e) {
      let p  = e.originalTarget.getAttribute("name");
      console.log(p);
      if( !["field1" , "field2"].includes(p) ) {
          return !(e.keyCode == 32);
      }
    };
    console.log("All Set");
    
    
    
    
  }

  listContainerDisplay = (e) => {
    if(this.cacheButtonObject.pressed){
      
      this.cacheButtonObject.drawer.style["animation-duration"] = "1s";
      this.cacheButtonObject.drawer.style["animation-name"] = "hamburger-drawer-hide";
      this.cacheButtonObject.drawer.style["animation-fill-mode"] = "forwards";
      
      this.cacheButtonObject.drawer.addEventListener("animationend" , (function rt(event){
        event.preventDefault();
        event.stopPropagation();
        console.log("AnimationEnd - 1");
        event.target.style.display = "none";
        

        event.target.removeEventListener("animationend" , rt);
      }));

      this.cacheButtonObject.pressed = false;
      this.cacheButtonObject.drawer.setAttribute('aria-hidden' , "true");
      
      
    }else{

      this.cacheButtonObject.drawer.style.display = "block";
      this.cacheButtonObject.drawer.style["animation-duration"] = "1s";
      this.cacheButtonObject.drawer.style["animation-name"] = "hamburger-drawer-show";
      this.cacheButtonObject.drawer.style["animation-fill-mode"] = "forwards";
      
      this.cacheButtonObject.drawer.addEventListener("animationend" , (function rt(event){
        event.preventDefault();
        event.stopPropagation();
        console.log("AnimationEnd - 2");
        
        event.target.removeEventListener("animationend" , rt);
      }));
      
      this.cacheButtonObject.pressed = true;
      this.cacheButtonObject.drawer.setAttribute('aria-hidden' , "false");

    }
    
    this.cacheButtonObject.compo.classList.toggle("change");
    
  }

  drawerItemSelectionAction = () => {

      //console.log("YES - 0");
      //console.log(this.cacheButtonObject.compo.classList);
      if(this.cacheButtonObject.compo.classList[0] === ("change")){

          //console.log("YES - 1");

          if(this.cacheButtonObject.pressed){
            
            this.cacheButtonObject.drawer.style["animation-duration"] = "1s";
            this.cacheButtonObject.drawer.style["animation-name"] = "hamburger-drawer-hide";
            this.cacheButtonObject.drawer.style["animation-fill-mode"] = "forwards";
      
      this.cacheButtonObject.drawer.addEventListener("animationend" , (function rt(event){
        event.preventDefault();
        event.stopPropagation();
        console.log("AnimationEnd - 1");
        event.target.style.display = "none";
        

        event.target.removeEventListener("animationend" , rt);
      }));

            this.cacheButtonObject.pressed = false;
            this.cacheButtonObject.drawer.setAttribute('aria-hidden' , "true");
            
            this.cacheButtonObject.compo.classList.toggle("change");

            return true;
          }
          return false;
      }
      return false;
  }

  linkListClickToMapFocus = (restaurant) => {
        if(this.mapChildObject)
          this.mapChildObject.linkListClickToMapMarker(restaurant , true);
  }

  getBackFocusList = () => {
      if(this.listContainerChildObject){
        this.listContainerChildObject.retriveBackFocus();
      }
  }

  drawerItemSelectionActionFocus = () => {
        
        let p = this.drawerItemSelectionAction();
        console.log("drawer-selection-action-focus",p);
        return p;
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
        this.mapChildObject.linkListClickToMapMarker(restaurant , false);
      }
  }



  render() {
    
    
    return (
      <main>
    
       
       <section id="main-section">

       
       <div role='button' tabIndex='0' id="hamburger-button" onClick={this.listContainerDisplay}>
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
            drawerItemSelectionActionFocus = {this.drawerItemSelectionActionFocus}
            linkListClickToMapFocus = {this.linkListClickToMapFocus}
            ref={listContainer => {this.listContainerChildObject = listContainer}}
        ></ListContainer>

        <Map ref={map => {this.mapChildObject = map}}
         getLocations = {this.getLocations}
         getBackFocusList = {this.getBackFocusList}
       ></Map>
       
       
      
      </section>
      </main>
    );
  }
}

export default App;

