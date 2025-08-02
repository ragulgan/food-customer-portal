import React from 'react'
import { useLoadScript, Autocomplete } from "@react-google-maps/api";
import { TextField } from '@mui/material';
import { boundary, country } from '../../../config';

const placesLibrary: any = ['places']

interface ConfirmationModalProps {
    setPosition: any;
    value: any
}

const AutocompleteTextfield: React.FC<ConfirmationModalProps> = ({ setPosition, value }) => {

    const [searchResult, setSearchResult] = React.useState<google.maps.places.Autocomplete>()

    function onLoad(autocomplete: google.maps.places.Autocomplete) {
        setSearchResult(autocomplete);
    }

    const { isLoaded } = useLoadScript({
        googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY,
        libraries: placesLibrary
    });

    function locationSelected() {
        if (searchResult) {
            const place: any = searchResult.getPlace();
            const newPosition = {
                latitude: place.geometry?.location?.lat(),
                longitude: place.geometry?.location?.lng()
            };
            sessionStorage.setItem("Lat", place.geometry?.location?.lat())
            sessionStorage.setItem("Long", place.geometry?.location?.lng())
            setPosition(newPosition);
        }
    }

    if (!isLoaded) {
        return <div>Loading...</div>
    };

    return (
        <Autocomplete
            onLoad={onLoad}
            onPlaceChanged={locationSelected}
            bounds={boundary}
            restrictions={{
                country: country,
            }}
            options={{
                strictBounds: true,
            }}
            className={value === 'addAddress' ? 'add-search-input-map': 'search-input-map'}>
            <TextField
                variant="outlined"
                type='search'
                size="small"
                sx={{ ml: { xs: 0, sm: 2 }, mt: { xs: 2, sm: 0 }, backgroundColor: '#FFFFFF' }}
                fullWidth
                placeholder="Search for Area, Street Name..." />
        </Autocomplete>
    )
}

export default AutocompleteTextfield