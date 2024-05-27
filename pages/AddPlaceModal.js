import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import MapView, { Marker } from 'react-native-maps'; // assuming you have 'react-native-maps' installed
import AntDesign from '@expo/vector-icons/AntDesign';
import { customMapStyle } from '../resources/customMapStyle';
import { createClient } from '@supabase/supabase-js';

const REACT_APP_SUPABASE_URL = "https://zjnvamrbnqzefncmdpaf.supabase.co";
const REACT_APP_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqbnZhbXJibnF6ZWZuY21kcGFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ0NjgzMDIsImV4cCI6MjAzMDA0NDMwMn0.O4S0x7F-5df2hR218qrO4VJbDOLK1Gzsvb3a8SGqwvY";

const supabase = createClient(REACT_APP_SUPABASE_URL, REACT_APP_ANON_KEY);

const AddPlaceModal = ({ visible, onClose }) => {
  const [placeName, setPlaceName] = useState('');
  const [placeDescription, setPlaceDescription] = useState('');
  const [placeType, setPlaceType] = useState('');
  const [entranceFee, setEntranceFee] = useState('');
  const [priceLevel, setPriceLevel] = useState('');
  const [isOpen, setIsOpen] = useState('');
  const [viewpointType, setViewpointType] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [showMap, setShowMap] = useState(false);

  const data = [
    { label: 'Sehenswürdigkeit', value: 'Sehenswürdigkeit' },
    { label: 'Restaurant', value: 'Restaurant' },
    { label: 'Einkaufsladen', value: 'Einkaufsladen' },
    { label: 'Aussichtspunkt', value: 'Aussichtspunkt' },
  ];

  const handleAddPlace = () => {
    // Hier kannst du die Logik zum Hinzufügen des Ortes implementieren
    // Verwende die eingegebenen Werte (placeName, placeDescription usw.)
    // und die Koordinaten (coordinates)
    if (!placeName || !placeDescription || !placeType || !coordinates) {
        alert('Bitte füllen Sie alle erforderlichen Felder aus.');
    } else {
        console.log(coordinates);
        addPlace(placeName, 1, placeType, placeDescription, coordinates.latitude, coordinates.longitude)
        onClose();
    }
    setPlaceType('');
    setCoordinates(null);
    setPlaceDescription('');
    setPlaceName('');
  };

  const addPlace = async (attractionName, typeOfAttraction, description, latitude, longitude) => {
    cityId = findNearestCityId({
               latitude: latitude,
               longitude: longitude,
               latitudeDelta: 1, // Eine sehr kleine Zahl für einen sehr kleinen Bereich
               longitudeDelta: 1, // Eine sehr kleine Zahl für einen sehr kleinen Bereich
             }, haversineDistance);
    try {
      const { data, error } = await supabase
        .from('Attraction')
        .insert([
          { Attraction_Name: attractionName, City_ID: cityId, Type_of_Attraction: typeOfAttraction, Description: description, Latitude: latitude, Longitude: longitude }
        ]);
      if (error) {
        throw new Error(error.message);
      }
      return data;
    } catch (error) {
      console.error('Error adding place:', error.message);
    }
    await onFetchData(); // Aktualisiert die continentData nach dem Hinzufügen des Ortes
  };

  const handleConfirmLocation = () => {
    // Hier kannst du die ausgewählten Koordinaten bestätigen und speichern
    setShowMap(false); // Verstecke die Karte nach der Bestätigung
  };

  const findNearestCityId = async (region, haversineDistance) => {
    try {
      const { data: cities, error } = await supabase.from('City').select('*');
      if (error) {
        throw new Error(error.message);
      }

      let nearestCityId = null;
      let minDistance = Infinity;

      // Iterate through all cities to find the nearest one
      cities.forEach(city => {
        // Calculate the distance between the current city and the region
        const distance = haversineDistance(region.latitude, region.longitude, city.latitude, city.longitude);

        // Update the nearest city if this city is closer
        if (distance < minDistance) {
          minDistance = distance;
          nearestCityId = city.City_ID;
        }
      });

      return nearestCityId;
    } catch (error) {
      console.error('Error finding nearest city:', error.message);
      return null;
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Ort hinzufügen</Text>
          <TextInput
            style={styles.input}
            placeholder="Name des Ortes"
            onChangeText={setPlaceName}
            value={placeName}
          />
          <TextInput
            style={styles.input}
            placeholder="Beschreibung des Ortes"
            onChangeText={setPlaceDescription}
            value={placeDescription}
          />
<TouchableOpacity onPress={() => setShowMap(true)} style={[styles.locationButton, coordinates ? styles.locationButtonSelected : null]}>
  <Text style={styles.locationInput}>{coordinates ? 'Standort ausgewählt' : 'Standort wählen'}</Text>
</TouchableOpacity>

                    {showMap && (
                      <View style={styles.mapContainer}>
                        <MapView
                          style={styles.map}
                          onPress={(event) => setCoordinates(event.nativeEvent.coordinate)}
                          customMapStyle={customMapStyle}
                        rotateEnabled={false} // Rotation der Karte deaktivieren
                        showsCompass={false} // Kompass ausblenden
                                  showsUserLocation={true} // Zeige den Standort des Benutzers als blauen Punkt an

                        >
                          {coordinates && <Marker coordinate={coordinates} />}
                        </MapView>
                        <TouchableOpacity onPress={handleConfirmLocation} style={styles.confirmButton}>
                          <Text style={styles.buttonText}>OK</Text>
                        </TouchableOpacity>
                      </View>
                    )}
          <View style={styles.dropdownContainer}>
            <Dropdown
              style={styles.dropdown}
              data={data}
              labelField="label"
              valueField="value"
              placeholder="Typ des Ortes"
              value={placeType}
              onChange={item => setPlaceType(item.value)}
            />
          </View>
          {placeType === 'Sehenswürdigkeit' && (
            <TextInput
              style={styles.input}
              placeholder="Eintrittsgebühr"
              onChangeText={setEntranceFee}
              value={entranceFee}
            />
          )}
          {/* Weitere Bedingungen für verschiedene Ortstypen... */}
          <TouchableOpacity onPress={handleAddPlace} style={styles.addButton}>
            <Text style={styles.buttonText}>Ort hinzufügen</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.buttonText}>Abbrechen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    width: '90%',
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  input: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: 'lightblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 20,
  },
  closeButton: {
    backgroundColor: 'lightgray',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
  dropdownContainer: {
    width: '100%',
    marginBottom: 10,
  },
  dropdown: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
  },
  locationButton: {
    width: '100%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  locationButtonSelected: {
    backgroundColor: "lightgreen",
  },
  locationInput: {
  color: 'gray',
    marginTop: 7,
    fontSize: 15,
  },
  mapContainer: {
    width: '100%',
    height: 300,
    marginTop: 10,
    marginBottom: 10,
  },
  map: {
    flex: 1,
  },
  confirmButton: {
    position: 'absolute',
    bottom: 10,
    right: 10,
    backgroundColor: 'lightblue',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

export default AddPlaceModal;
