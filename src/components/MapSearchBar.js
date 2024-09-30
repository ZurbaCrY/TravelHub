import React, { useState } from 'react';
import { View, Button } from 'react-native';
import { GooglePlacesAutocomplete } from 'react-native-google-places-autocomplete';
import { fetchCityCoordinates, handleSearchAutocompleteAPI, handleSearchLocal } from '../backend/MapSearchBarFunctions';

/**
 * Component for the search bar with autocomplete and related functions.
 *
 * @param {object} props - Contains required data such as styles, mapRef, and handlers.
 */
const MapSearchBar = ({ styles, mapRef, scrollToStart, setSelectedCoordinates, setSelectedPlace, setSearchResult, continentsData }) => {

  const [selectedCoordinates, setSelectedCoordinatesState] = useState(null);

  return (
    <View style={[styles.searchContainer]}>
      <GooglePlacesAutocomplete
        placeholder='Search for city...'
        onPress={(data, details = null) => {
          const { place_id } = details;
          if (place_id) {
            fetchCityCoordinates(place_id, setSelectedCoordinatesState);
          }
        }}
        query={{
          key: 'AIzaSyDUMJ0wbXrEYkKY4iN7noJJ7yRp-C86LFU',
          language: 'en',
          types: '(cities)',
        }}
        styles={{
          textInput: styles.searchInput,
          listView: styles.listViewContainer,
        }}
      />
      <Button
        mode='contained'
        onPress={() => handleSearchAutocompleteAPI(selectedCoordinates, setSelectedPlace, scrollToStart, mapRef, setSearchResult, continentsData)}
        style={styles.button}
        labelStyle={styles.buttonText}
        title="Go!"
      />
    </View>
  );
};

export default MapSearchBar;