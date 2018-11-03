import React from 'react';

class Map extends React.Component{

promiseResolve = null;

 state = {
     map: null,
     markers: [],
     largeInfowindow: null
 }

 callMethod = () => {
     console.log(this)
 }

 setMarkerAnimationBounceAndOff = (markerToNullAnimate) => {
    markerToNullAnimate.setAnimation(window.google.maps.Animation.BOUNCE);
    setTimeout(markerToNullAnimate.setAnimation.bind(markerToNullAnimate) , 5000 , null);
 }

 linkListClickToMapMarker = (restaurant) => {
    
    if(this.state.largeInfowindow){
        let returnMarker = this.getFilterMarkerFromRestaurant(restaurant);
            if(returnMarker){
                    this.populateInfoWindow(returnMarker);
                    this.setMarkerAnimationBounceAndOff(returnMarker);
                   // returnMarker.setAnimation(window.google.maps.Animation.BOUNCE);
                   // setTimeout(this.setMarkerAnimationBounceOff  , 5000 , returnMarker);
                }

    }else{
        this.promiseResolve.then(() => {
            if(this.state.largeInfowindow){
                let returnMarker = this.getFilterMarkerFromRestaurant(restaurant);
                if(returnMarker){
                    this.populateInfoWindow(returnMarker);
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


getMakeImageUrl = (markerResId) => {

    let url = new URL("https://api.foursquare.com/v2/venues/"+markerResId+"/photos?");
    let params = {
      
      
      
      limit: 5,
      client_id: "VVZNTZCTW20DLYBQBYD20ZMW5WWEYIM5V4FNL0041WCG4U3Q",
      client_secret: "UZRNMMDE0IEPBJ2XIOURKNGBKVWOHUFUY14LTRQNIOPDSWFB",
      v: "20181101"
    };

    url.search = new URLSearchParams(params);
    console.log(url);

    return fetch(url).then((res) => {return res.json()}).catch(() => {return {"meta":{"code":400}}});

} 

 
populateInfoWindow = (marker) => {

    //console.log(marker , this.state.largeInfowindow);

    if(this.state.largeInfowindow){

        let temp = this.state.largeInfowindow;
        if (
            temp.marker !== marker) {
                if(temp.marker){
                    temp.marker.setAnimation(null);
                }
            
            temp.marker = marker;
            

            // Make sure the marker property is cleared if the infowindow is closed.
            temp.addListener('closeclick', function() {
                temp.marker.setAnimation(null);
                marker = null;
            });

        }

            this.getMakeImageUrl(marker.appMarkerId).then((res)=>{

                if(res.meta.code === 200){

                    temp.setContent('<div>' + marker.title + '</div>' +
                    "<div><img id='markerInfoWindowImage' src='' /></div>"
                    );

                    let  photoRecObject = res.response.photos.items[0];
                    let photoUrl = photoRecObject.prefix+"200x200" + photoRecObject.suffix; 

                    document.getElementById("markerInfoWindowImage").setAttribute("src" , photoUrl);

                }else{

                    temp.setContent('<div>' + marker.title + '</div>' +
                    '<div>Photo Not Found</div>'
                    );

                }

            }).catch(() => {
                temp.setContent('<div>' + marker.title + '</div>' +
                '<div>Photo Not Found</div>'
                );
            });
            
            temp.open(this.state.map, marker);
            
            
          
    }

}

 pointMarkers = (locations) => {

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
                console.log(marker);
              } );

              return marker;
        })

     } });

 }

 
 getFilterMarker = (updatedLocation) => {

    console.log(updatedLocation);

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
    console.log(updatedLocation , "in map final");

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
    console.log(this.promiseResolve);
    this.promiseResolve.then((function(res){
        let map = new window.google.maps.Map(
            document.getElementById('map'),
            {
                center: {lat: -34.397, lng: 150.644},
                zoom: 8,
                mapTypeControl: false
            }
        );

        //change-1
        let markers = [new window.google.maps.Marker({
            "position": {
                "lat":18.517027817210945,
                "lng":73.85484481593303
            },
            "map": map,
            "title": "New Poona Bakery",
            "appMarkerId": "abcd",
            "icon": this.getMarkerIcon("place")
          }

        )];
  
        markers.forEach((marker) => {
            marker.addListener("click" , () => {
                this.populateInfoWindow(marker);    
                this.setMarkerAnimationBounceAndOff(marker);
            });
        });

        //change-1
        this.setState({
            map: map,
            markers: markers,
            largeInfowindow: new window.google.maps.InfoWindow()
        });
    }).bind(this));
}


 loadScript = () => {

    return new Promise((resolve) => {

        let script = document.createElement("script");
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDMMgxBbkZCfyb1sXfdkA1XiFvyrOK8uxg&libraries=geometry&callback=initMap";
        script.async = true;
        script.defer = true;
        script.setAttribute("id" , "app-google-map-script");
        document.body.appendChild(script);
        window.initMap = resolve;
        

    });
}


getMarkerIcon = (title) => {
    
    let markerUrl = "./images/";
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
            <div id="map"></div>
        );
    }

}

export default Map;