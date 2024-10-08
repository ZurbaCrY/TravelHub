import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { handleSearchLocalAutocomplete } from '../backend/MapSearchBarFunctions'; // Importiere die Funktion für lokale Suche
import { findMiddleCoordinate } from '../services/MapMathematics';

const MapSearchBar = ({ styles, mapRef, scrollToStart, setSelectedPlace, setSearchResult, continentsData }) => {
  const [query, setQuery] = useState('');
  const [bestMatch, setBestMatch] = useState(null);

  const handleInputChange = (input) => {
    setQuery(input || '');
    const results = handleSearchLocalAutocomplete(input || '', continentsData);
    setBestMatch(results.length > 0 ? results[0] : null);
  };

  const handleButtonPress = () => {
    if (bestMatch) {
      if (bestMatch.coordinates && bestMatch.coordinates.length > 0) {
        const middleCoordinate = findMiddleCoordinate(bestMatch.coordinates);
        mapRef.animateToRegion({
          latitude: middleCoordinate.latitude,
          longitude: middleCoordinate.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }, 1000);
        setSelectedPlace(null);
        setSearchResult(bestMatch);
        setQuery(bestMatch.name);
      }
    }
  };

  return (
    <View style={styles.searchContainer}>
      <TextInput
        placeholder='Search for city...'
        value={query}
        onChangeText={handleInputChange}
        onSubmitEditing={handleButtonPress}
        style={styles.searchInput}
      />

      {/* bester Vorschlag in grauer Schrift */}
      {bestMatch && (
        <TextInput
          value={bestMatch.name}
          editable={false}
          style={[styles.suggestionText, { position: 'absolute', top: 0, left: 0, opacity: 0.5 }]}
        />
      )}

      <Button
        title="Go!"
        onPress={handleButtonPress}
        style={styles.button}
      />
    </View>
  );
};

// Styles hier definiert, muss noch verschönert und ausgelagert werden
const localStyles = StyleSheet.create({
  searchContainer: {
    position: 'relative',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  suggestionText: {
    fontSize: 16,
    color: 'gray',
    padding: 10,
    height: 40,
  },
  button: {
    marginTop: 10,
  },
});

export default MapSearchBar;
