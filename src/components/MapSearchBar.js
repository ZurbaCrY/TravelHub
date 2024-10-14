import React, { useState } from 'react';
import { View, TextInput, Button, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { handleSearchLocalAutocomplete } from '../backend/MapSearchBarFunctions'; // Importiere die Funktion für lokale Suche
import { findMiddleCoordinate } from '../services/MapMathematics';
import { MaterialIcons } from '@expo/vector-icons';

const MapSearchBar = ({ styles, mapRef, scrollToStart, setSelectedPlace, setSearchResult, continentsData, setRegion }) => {
  const [query, setQuery] = useState('');
  const [bestMatch, setBestMatch] = useState(null);
  const [selectedMatch, setSelectedMatch] = useState(null);

  const handleInputChange = (input) => {
    setQuery(input || '');
    const results = handleSearchLocalAutocomplete(input || '', continentsData);
    setBestMatch(results.length > 0 ? results[0] : null); // Bestes Ergebnis setzen
  };

  const handleSubmit = () => {
    if (bestMatch) {
      if (bestMatch.coordinates && bestMatch.coordinates.length > 0) {
        const middleCoordinate = findMiddleCoordinate(bestMatch.coordinates);
        const newRegion = {
          latitude: middleCoordinate.latitude,
          longitude: middleCoordinate.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        mapRef.animateToRegion(newRegion, 1000);
        setSelectedPlace(null);
        setQuery(bestMatch.name);
        setSelectedMatch(bestMatch);
        setBestMatch(null);
      }
    }
  };

  const handleButtonPress = () => {
    if (selectedMatch) {
      if (selectedMatch.coordinates && selectedMatch.coordinates.length > 0) {
        const middleCoordinate = findMiddleCoordinate(selectedMatch.coordinates);
        const newRegion = {
          latitude: middleCoordinate.latitude,
          longitude: middleCoordinate.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        mapRef.animateToRegion(newRegion, 1000);
        setSelectedPlace(null);
        setQuery(selectedMatch.name);

      }
    }
  };

  return (
    <View style={localStyles.searchContainer}>
      <View style={localStyles.inputContainer}>
        <TextInput
          placeholder='Search for city...'
          value={query}
          onChangeText={handleInputChange}
          onSubmitEditing={handleSubmit}
          style={localStyles.searchInput}
        />

        {/* Vorschlag in der Suchleiste */}
        {bestMatch && (
          <TouchableOpacity onPress={() => setQuery(bestMatch.name)} style={localStyles.suggestionOverlay}>
            <Text style={localStyles.suggestionText}>{bestMatch.name}</Text>
          </TouchableOpacity>
        )}
      </View>

      <TouchableOpacity
          onPress={handleButtonPress}
          style={localStyles.button}
       >
        <MaterialIcons name="send" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
};

// Styles hier definiert
const localStyles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row', // Nebeneinander anordnen
    alignItems: 'center',  // Vertikal zentrieren
    marginTop: 40,
    marginLeft: 10,
  },
  inputContainer: {
    position: 'relative',
    flex: 1, // Nimmt den verfügbaren Platz ein
  },
  searchInput: {
    height: 50,
    borderColor: '#ccc',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    fontSize: 16,
    backgroundColor: '#fff', // Hintergrundfarbe hinzufügen
  },
  suggestionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 50,
    justifyContent: 'center', // Vertikale Zentrierung
    paddingHorizontal: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)', // Transparenter Hintergrund
    borderBottomColor: '#ccc', // Untere Rahmenfarbe
  },
  suggestionText: {
    fontSize: 16,
    color: 'gray', // Graue Schriftfarbe für Vorschlag
  },
  button: {
    margin: 10, // Abstand zwischen Input und Button
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
  },
});

export default MapSearchBar;
