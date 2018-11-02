import React from 'react';

class Map extends React.Component{

promiseResolve = null;

 state = {
     map: null,
     markers: []
 }

 callMethod = () => {
     console.log(this)
 }


 pointMarkers = (locations) => {

    this.setState({

        markers: locations.map((locationObject) => {
 
            return new window.google.maps.Marker({
                position: {
                    lat:locationObject.venue.location.lat,
                    lng:locationObject.venue.location.lng
                },
                map: this.state.map,
                title: locationObject.venue.name,
                appMarkerId: locationObject.venue.id
              });

        })

    });

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
            "title": "Pune",
            "appMarkerId": "abcd"
          }

        )];
  

        //change-1
        this.setState({
            map: map,
            markers: markers
        });
    }).bind(this));
}


 loadScript = () => {

    return new Promise((resolve) => {

        let script = document.createElement("script");
        script.src = "https://maps.googleapis.com/maps/api/js?key=AIzaSyDMMgxBbkZCfyb1sXfdkA1XiFvyrOK8uxg&callback=initMap";
        script.async = true;
        script.defer = true;
        script.setAttribute("id" , "app-google-map-script");
        document.body.appendChild(script);
        window.initMap = resolve;
        

    });
}


    render(){
        return (
            <div id="map"></div>
        );
    }

}

export default Map;