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

        
        return filteredData;
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

        return (<ol className='list-item-container'>
            {
                
                (filteredData.length > 0 && (

                    filteredData.map((restaurant) => {
//                        console.log(restaurant.venue.name);
                       return  (<li key={restaurant.venue.id} className='list-item'>
                        <span className='list-item-hotel-name'>{restaurant.venue.name}</span>
                        <span className='list-item-hotel-type'>{restaurant.venue.categories[0].name}</span>
                        <span className='list-item-hotel-address'>{restaurant.venue.location.formattedAddress.join(" ")}</span>
                        </li>) }) ) )
            }

            {
                (filteredData.length <=0 && 

                    (<li  className='list-item'>
                        <span className='list-item-no-result'>No Results :(</span>
                        </li>
                    )
                )
            
            }

        </ol>)

    }



}