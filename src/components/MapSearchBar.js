import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet } from 'react-native';
import { handleSearchLocalAutocomplete } from '../backend/MapSearchBarFunctions'; // Importiere die Funktion für lokale Suche
import { findMiddleCoordinate } from '../services/MapMathematics';

const MapSearchBar = ({ styles, mapRef, scrollToStart, setSelectedPlace, setSearchResult, continentsData }) => {
  const [query, setQuery] = useState('');
  const [bestMatch, setBestMatch] = useState(null);

  // Handler für die Eingabeveränderung
  const handleInputChange = (input) => {
    setQuery(input || ''); // Setze einen leeren String, wenn input undefined ist
    const results = handleSearchLocalAutocomplete(input || '', continentsData); // Nutze einen leeren String für die Suche
    // Setze den besten Vorschlag, falls einer existiert
    setBestMatch(results.length > 0 ? results[0] : null);
  };

  // Handle Button-Klick
  const handleButtonPress = () => {
    if (bestMatch) {
      // Hier prüfen, ob die Koordinaten existieren
      if (bestMatch.coordinates && bestMatch.coordinates.length > 0) {
        const middleCoordinate = findMiddleCoordinate(bestMatch.coordinates);
        mapRef.animateToRegion({
          latitude: middleCoordinate.latitude,
          longitude: middleCoordinate.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }, 1000);
        setSearchResult(bestMatch);
        setQuery(bestMatch.name); // Update das Suchfeld mit dem besten Vorschlag
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

      {/* Zeige den besten Vorschlag in grauer Schrift */}
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

// Styles hier definiert
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
