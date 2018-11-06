import React from 'react';
import getMapOnject from './getIniMap';

class Map extends React.Component{

promiseResolve = null;
bounds: [];

 state = {
     map: null,
     markers: [],
     largeInfowindow: null,
     
 }

 callMethod = () => {
     console.log(this);
 }

 setMarkerAnimationBounceAndOff = (markerToNullAnimate) => {
    markerToNullAnimate.setAnimation(window.google.maps.Animation.BOUNCE);
    setTimeout(markerToNullAnimate.setAnimation.bind(markerToNullAnimate) , 5000 , null);
 }

 linkListClickToMapMarker = (restaurant , focusable=false) => {
    
    if(this.state.largeInfowindow){
        let returnMarker = this.getFilterMarkerFromRestaurant(restaurant);
            if(returnMarker){

           
                        this.bounds =  this.state.map.getBounds();
           

                    let bound = new window.google.maps.LatLngBounds();
                    bound.extend(new window.google.maps.LatLng(returnMarker.position.lat(),
                            returnMarker.position.lng()
                    ));
                    returnMarker.getMap().fitBounds(bound);
                    returnMarker.getMap().panToBounds(bound);
                    this.populateInfoWindow(returnMarker , focusable);
                    
                    this.setMarkerAnimationBounceAndOff(returnMarker);
                   // returnMarker.setAnimation(window.google.maps.Animation.BOUNCE);
                   // setTimeout(this.setMarkerAnimationBounceOff  , 5000 , returnMarker);
                }

    }else{
        this.promiseResolve.then(() => {
            if(this.state.largeInfowindow){
                let returnMarker = this.getFilterMarkerFromRestaurant(restaurant);
                if(returnMarker){
                    let bound = new window.google.maps.LatLngBounds();
                    bound.extend(new window.google.maps.LatLng(returnMarker.position.lat(),
                            returnMarker.position.lng()
                    ));
                    returnMarker.getMap().fitBounds(bound);
                    returnMarker.getMap().panToBounds(bound);
                    this.populateInfoWindow(returnMarker , focusable);
                    this.setMarkerAnimationBounceAndOff(returnMarker);
                   // returnMarker.setAnimation(window.google.maps.Animation.BOUNCE);
                   // setTimeout(this.setMarkerAnimationBounceOff , 5000 , returnMarker);
                }
            }
        });
    }

 }

 getFilterMarkerFromRestaurant = (restaurant) => {

    for(let index = 0 ; index < this.state.markers.length ; index++){
        if(this.state.markers[index].appMarkerId === restaurant.venue.id){
            return this.state.markers[index];
        }
    }

 }


getMakeImageUrl = (markerResId , temp) => {

    let url = new URL("https://api.foursquare.com/v2/venues/"+markerResId+"/photos?");
    let params = {
      
      
      
      limit: 5,
      client_id: "VVZNTZCTW20DLYBQBYD20ZMW5WWEYIM5V4FNL0041WCG4U3Q",
      client_secret: "UZRNMMDE0IEPBJ2XIOURKNGBKVWOHUFUY14LTRQNIOPDSWFB",
      v: "20181101"
    };

    url.search = new URLSearchParams(params);
    //console.log(url);

    temp.setContent("<div id='markerInfoWindowTitle'>Waiting...</div>");

    return fetch(url).then((res) => {return res.json()});
    //return Promise.resolve({meta: {code: 201}});

}

getSuccessInfoWindowContent = (title , firstName , lastName) =>{
    
    let parentDiv = document.createElement("div");
    parentDiv.setAttribute("id" , "focus-div");
    parentDiv.setAttribute("tabindex" , "-1");

    let parentSection = document.createElement("section");
    parentSection.setAttribute("id" , "markerInfoWindow");

    let TitleDiv = document.createElement("div");
    TitleDiv.setAttribute("id" , "markerInfoWindowTitle");
    TitleDiv.textContent = title;

    let ImageDiv = document.createElement("div");
    let image = document.createElement("img");
    image.setAttribute("id" , "markerInfoWindowImage");
    image.setAttribute("src" , "");
    image.setAttribute("aria-hidden" , "true");
    image.setAttribute("alt" , title);
    ImageDiv.appendChild(image);

    let CreditDiv = document.createElement("div");
    CreditDiv.setAttribute("id" , "markerInfoWindowCredit");
    CreditDiv.textContent = ((firstName || "") + (lastName || "") + "" );

    let CreditDiv1 = document.createElement("div");
    CreditDiv1.setAttribute("id" , "markerInfoWindowPowerCredit");
    CreditDiv1.innerHTML = "By <a href='https://developer.foursquare.com/' id='foursquare'>Foursquare</a> & <a href='https://www.flaticon.com/' id='flaticon'>Flaticon</a>";


    parentSection.appendChild(TitleDiv);
    parentSection.appendChild(ImageDiv);
    parentSection.appendChild(CreditDiv);
    parentSection.appendChild(CreditDiv1);

    
    
    parentDiv.appendChild(parentSection);

    return parentDiv;

}

getFailureInfoWindowContent = (title , firstMessage , secondMessage) => {



    let parentDiv = document.createElement("div");
    parentDiv.setAttribute("id" , "focus-div");
    parentDiv.setAttribute("tabindex" , "-1");


    let TitleDiv = document.createElement("div");
    TitleDiv.setAttribute("id" , "markerInfoWindowTitle");
    TitleDiv.textContent = title;

    let ImageDiv = document.createElement("div");
    ImageDiv.setAttribute("id" , "markerInfoWindowCredit");
    ImageDiv.textContent = firstMessage;

    let CreditDiv = document.createElement("div");
    CreditDiv.setAttribute("id" , "markerInfoWindowCredit");
    CreditDiv.textContent = (secondMessage || firstMessage);

    let CreditDiv1 = document.createElement("div");
    CreditDiv1.setAttribute("id" , "markerInfoWindowPowerCredit");
    CreditDiv1.innerHTML = "By <a href='https://developer.foursquare.com/' id='foursquare'>Foursquare</a> & <a href='https://www.flaticon.com/' id='flaticon'>Flaticon</a>";



    parentDiv.appendChild(TitleDiv);
    parentDiv.appendChild(ImageDiv);
    parentDiv.appendChild(CreditDiv);
    parentDiv.appendChild(CreditDiv1);
    
    
    return parentDiv;
    
}

 
populateInfoWindow = (marker , focusable=false) => {

    //console.log(marker , this.state.largeInfowindow);

    let createdInfoDomElement = null;

    if(this.state.largeInfowindow){

        let temp = this.state.largeInfowindow;
        if (
            temp.marker !== marker) {
                if(temp.marker){
                    temp.marker.setAnimation(null);
                }
            
            temp.marker = marker;
            temp.marker.appFocusable = focusable;

            

            

            

             

                //console.log(focusable , "upper");

                let getBackFocusList = this.props.getBackFocusList;

            
            
            //temp.addListener('closeclick',);

        }

            this.getMakeImageUrl(marker.appMarkerId , temp).then((res)=>{

                //console.log(res);

                
                if(res.meta.code === 200){

                    createdInfoDomElement = this.getSuccessInfoWindowContent(marker.title, res.response.photos.items[0].user.firstName ,
                        res.response.photos.items[0].user.lastName
                    );

                    temp.setContent(createdInfoDomElement);    

                    let  photoRecObject = res.response.photos.items[0];
                    let photoUrl = photoRecObject.prefix+"200x200" + photoRecObject.suffix; 

                    document.getElementById("markerInfoWindowImage").setAttribute("src" , photoUrl);

                    document.getElementById("focus-div").focus();

                }else{

                    
                    
                    
                    createdInfoDomElement = this.getFailureInfoWindowContent(marker.title , "Photo Not Found" , "Credit Not Found");

                    temp.setContent(createdInfoDomElement);
                    
                }

            }).catch((err) => {
                
                //console.log(err);
                createdInfoDomElement = this.getFailureInfoWindowContent(marker.title , "NetWork Error");
                temp.setContent(createdInfoDomElement);
                
            }).then(() => {
               createdInfoDomElement.focus();
            });

            

            temp.open(this.state.map, marker);
            
          
    }

}

 pointMarkers = (locations) => {

    let bounds = new window.google.maps.LatLngBounds();

    this.setState( (state) => {return {

        markers: locations.map((locationObject) => {
 
            let markerIcon = this.getMarkerIcon((locationObject.venue.categories[0] && locationObject.venue.categories[0].name) || "place")

            let marker =  new window.google.maps.Marker({
                position: {
                    lat:locationObject.venue.location.lat,
                    lng:locationObject.venue.location.lng
                },
                map: this.state.map,
                title: locationObject.venue.name,
                appMarkerId: locationObject.venue.id,
                icon: markerIcon
              });

              marker.addListener('click' , (event) => {
                this.populateInfoWindow(marker);
                this.setMarkerAnimationBounceAndOff(marker);
                //console.log(marker);
              } );

              if(marker && marker.position)
              bounds.extend(new window.google.maps.LatLng(marker.position.lat(),marker.position.lng()));

              return marker;
        })
            
     } });
     
     this.state.map.fitBounds(bounds);
     this.state.map.panToBounds(bounds);

 }

 
 getFilterMarker = (updatedLocation) => {

    //console.log(updatedLocation);

    if(updatedLocation.length === 0){

        this.state.markers.forEach((marker) => {marker.setMap(null)});

    }else{

    
    this.state.markers.forEach((marker) => {

        for(let index=0 ; index < updatedLocation.length ; index++){
            
            if(updatedLocation[index].venue.id === marker.appMarkerId){
                marker.setMap(this.state.map);
                break;
            }else{
                marker.setMap(null);
            }

        }

        });

    }
    //console.log(updatedLocation , "in map final");

 }

 removeMarkers = () => {
     this.state.markers.forEach((marker)=>{
        marker.setMap(null);
     });

     this.setState({
         markers: []
     });
 }

 notifyUpdateLocations = () => {
    let locations = this.props.getLocations();
    if(this.state.map){
        if(this.state.markers.length > 0){
            this.removeMarkers();
        }
        this.pointMarkers(locations);
        
       
    }else{
        this.promiseResolve.then(() => {
            if(this.state.markers.length > 0){
                this.removeMarkers();
            }
            this.pointMarkers(locations);
        })

    }
 }

componentWillMount(){

    let googleMapscript = document.getElementById("app-google-map-script");
    if(!googleMapscript){
        this.promiseResolve = this.loadScript();
    }else{
        this.promiseResolve = Promise.resolve(window.google);
    }

}

componentDidMount(){
    //console.log(this.promiseResolve);
    this.promiseResolve.then((function(res){
        let map = new window.google.maps.Map(
            document.getElementById('map'),
            {
                center: {lat: -34.397, lng: 150.644},
                zoom: 4,
                mapTypeControl: false
            }
        );

        //change-1

        let iniMarkers = getMapOnject();
       // console.log(iniMarkers);
        let markers = [];
        let bounds = new window.google.maps.LatLngBounds();

        iniMarkers.forEach((markerIni) => {
            markerIni.map = map;
            markerIni.icon = this.getMarkerIcon(markerIni.title);
        //    console.log(markerIni);
            let markerNewIni = new window.google.maps.Marker(
                markerIni
            );
            markers.push(markerNewIni);
            bounds.extend(new window.google.maps.LatLng(markerNewIni.position.lat(), markerNewIni.position.lng()));
        });

        
        markers.forEach((marker) => {
            marker.addListener("click" , () => {
                this.populateInfoWindow(marker);    
                this.setMarkerAnimationBounceAndOff(marker);
            });
        });

        

        map.fitBounds(bounds);
        map.panToBounds(bounds);



        let largeInfowindow = new window.google.maps.InfoWindow()
        let callbackFocusFunction = this.props.getBackFocusList;

        window.google.maps.event.addListener(largeInfowindow , 'closeclick' ,  () =>{
                
            if(largeInfowindow.marker)
                largeInfowindow.marker.setAnimation(null);
                
            

           // console.log("close click called");
            
            if(largeInfowindow.marker.appFocusable){
                map.fitBounds(this.bounds);  
                map.panToBounds(this.bounds);
                //console.log("GetBackFocusList called");
                    callbackFocusFunction();
            }

            //window.google.maps.event.removeListener(this);
        });
        
        this.bounds = bounds;
        //change-1
        this.setState({
            map: map,
            markers: markers,
            largeInfowindow: largeInfowindow,
            
        });
    }).bind(this));
}

mapFailure = (message) => {
    
        let tempMapDomObject = document.getElementById("map");
        tempMapDomObject.style.background = "#282c34";
        tempMapDomObject.style.display ="flex";
        tempMapDomObject.style.flexWrap ="no-wrap";
        tempMapDomObject.innerHTML = ""+
        "<div id='map-error'>"+
        `<div id='map-error-main'>${message} 😔</div> `+
        "<div id='map-error-extra'>Maybe we have to search in globe.</div>"+
        "<div id='map-error-globe'><img src='./earth-globe.png' alt='earth-globe' aria-hidden='true' />"+
        "</div> "+
        "</div>"


        this.setState({
            map: null
        });
}


 loadScript = () => {

    window.gm_authFailure =  (err) => {
            this.mapFailure("Map Not Load");
        
    }

    return new Promise((resolve) => {

        let script = document.createElement("script");
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyB4KRQ3O9bgiSHAsC3KieDLn_wsGSclpS0&libraries=geometry&callback=initMap";
        script.async = true;
        script.defer = true;
        script.setAttribute("id" , "app-google-map-script");
        document.body.appendChild(script);
        window.initMap = resolve;
        script.onerror = this.mapFailure.bind(this , "Network Error");

    });
}


getMarkerIcon = (title) => {
    
    let markerUrl = "./";
    let titleLower = title.toLowerCase();

    if(titleLower.includes("restaurant")){
        markerUrl += "restaurant.png";
    }else if(titleLower.includes("food truck")){
        markerUrl += "food-truck.png";
    }else if(titleLower.includes("café") || title.includes("coffee") ){
        markerUrl += "coffee.png";
    }else if(titleLower.includes("bar") || titleLower.includes("pub")){
        markerUrl += "wine.png";
    }else{
        markerUrl += "store.png";
    }

    return markerUrl;
}



    render(){
        return (
            <div role='application' aria-label='location on maps' id="map"></div>
        );
    }

}



export default Map;