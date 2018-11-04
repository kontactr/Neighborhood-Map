import React from 'react';

export default class ListView extends React.Component{


/*    notifyUpdateLocations = (NewLocations) => {
        this.setState({
            filteredLocation: NewLocations
        });
    }

    notifyUpdatePlaces(newPlaceSearch) => {
        this.setState({

        })
    } */

    activeElement = {element: "" , key: "" , focusBack: false}


    keyboardClickEvent = (restaurant) => {

        
        console.log("Keyboard event start");
        if(this.activeElement.key === 13 || this.activeElement.key === 32)
        {
            
            if(! this.props.drawerItemSelectionActionFocus()){
                    this.activeElement.focusBack = true;
            }

            console.log("Element Focus" , this.activeElement.focusBack);
            this.props.linkListClickToMapFocus(restaurant);
        }
    }

    retriveBackFocus = () =>{
        if(this.activeElement.focusBack)
            console.log("for click also");
            this.activeElement.element.focus();
            this.activeElement = {element: "" , key: "" , focusBack: false};
    }


    filterData = (newLocations , newPlacesQuery = '') => {
        let filteredData = [];

        newPlacesQuery = newPlacesQuery.toLocaleLowerCase();

        if(newLocations.msg){
            
          //  console.log(true);
            
            filteredData =  newLocations.filter((restaurant) => {
                return (restaurant.venue.name.toLocaleLowerCase().includes(newPlacesQuery) ||
                        restaurant.venue.categories[0].name.toLocaleLowerCase().includes(newPlacesQuery) );
            });
        }

        filteredData.msg = newLocations.msg;

        
        return filteredData;
    }

olFocusEventTraverse = (event) => {
    event.preventDefault();

    if(event.keyCode === 40){

        if(event.target.nextElementSibling){
            event.target.nextElementSibling.focus();
        }
    }else if(event.keyCode === 38){

        if(event.target.previousElementSibling){
            event.target.previousElementSibling.focus();
        }
    }


}

    
    render(){

        let filteredData = this.filterData(
            this.props.getnewLocations(),
            this.props.getNewPlaceQuery()
        );

        console.log(filteredData , "Asdsfsg");
        //console.log(this.props.getFilteredMarker);
        //if(this.props.getUpdateMapFunction())
        this.props.getFilteredMarker(filteredData);
        console.log(filteredData , "Asdsfsg--1");
        //console.log(filteredData , filteredData.length);

        return (<ol className='list-item-container' id='ol-element' onKeyUp = { this.olFocusEventTraverse } >
            {
                
                ( filteredData.msg && filteredData.length > 0 && (

                    filteredData.map((restaurant) => {
//                        console.log(restaurant.venue.name);
                       return  (<li key={restaurant.venue.id} className='list-item' onClick={(event) => {
                           
                           this.props.drawerItemSelectionAction();
                           this.props.linkListClickToMap(restaurant);}}
                           
                           onKeyDown ={ (event) => { console.log("Start Again");  this.activeElement = {key: event.keyCode , element: event.target , focusBack: true }  
                           
                           console.log(this.activeElement);
                           this.keyboardClickEvent(restaurant); }}
                           tabIndex="0" >
                        <h3 className='list-item-hotel-name'>{restaurant.venue.name}</h3>
                        <span className='list-item-hotel-type'>{(restaurant.venue.categories[0] && restaurant.venue.categories[0].name) || "Place"}</span>
                        <span className='list-item-hotel-address'>{restaurant.venue.location.formattedAddress.join(" ")}</span>
                        </li>) }) ) )
            }

            {
                ( filteredData.msg && filteredData.length <=0 && 

                    (<li  className='list-item'>
                        <span className='list-item-no-result'>No Results :(</span>
                        </li>
                    )
                )
            
            }

                {
                
                ( !filteredData.msg  && 

                    (<li  className='list-item'>
                        <span className='list-item-no-result'>Network Error :(</span>
                        </li>
                    )
                )
            
            }

        </ol>)

    }



}