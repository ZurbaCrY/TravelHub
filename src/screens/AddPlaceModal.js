import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import MapView, { Marker } from 'react-native-maps';
import { customMapStyle } from '../styles/customMapStyle';
import { supabase } from '../services/supabase';
import PropTypes from 'prop-types';
import { styles } from '../styles/styles.js'; // Relativer Pfad
import { useDarkMode } from '../context/DarkModeContext';

const AddPlaceModal = ({ visible, onClose, continentsData }) => {
  const [placeName, setPlaceName] = useState('');
  const [placeDescription, setPlaceDescription] = useState('');
  const [placeType, setPlaceType] = useState('');
  const [entranceFee, setEntranceFee] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [showMap, setShowMap] = useState(false);
  let cityId;

  const data = [
    { label: 'Sehenswürdigkeit', value: 'Sehenswürdigkeit' },
    { label: 'Restaurant', value: 'Restaurant' },
    { label: 'Einkaufsladen', value: 'Einkaufsladen' },
    { label: 'Aussichtspunkt', value: 'Aussichtspunkt' },
  ];

  const handleAddPlace = () => {
    if (!placeName || !placeDescription || !placeType || !coordinates) {
      alert('Bitte füllen Sie alle erforderlichen Felder aus.'); // Consider a better notification method
      return;
    }
    addPlace(placeName,
      placeType,
      placeDescription,
      coordinates.latitude,
      coordinates.longitude);
    resetForm();
  };

  const resetForm = () => {
    setPlaceType('');
    setCoordinates(null);
    setPlaceDescription('');
    setPlaceName('');
  };

  // Function to calculate the distance between two coordinates using the Haversine formula
  const haversineDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c; // Distance in km
    return d;
  };

  // Function to convert degrees to radians
  const deg2rad = (deg) => {
    return deg * (Math.PI / 180);
  };

  const addPlace = async (
    attractionName,
    typeOfAttraction,
    description,
    latitude,
    longitude) => {
    try {
      cityId = findNearestCityId({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 1, // Eine sehr kleine Zahl für einen sehr kleinen Bereich
        longitudeDelta: 1, // Eine sehr kleine Zahl für einen sehr kleinen Bereich
      }, continentsData);
      const { data, error } = await supabase
        .from('Attraction')
        .insert([{
          Attraction_Name: attractionName,
          City_ID: cityId,
          Type_of_Attraction: typeOfAttraction,
          Description: description,
          Latitude: latitude,
          Longitude: longitude
        }]);
      if (error) {
        throw new Error(error.message);
      }
      

      // Task: Look at this:
      console.log('Place added:', data);

      
      onClose(); // Consider moving onClose to after success
    } catch (error) {
      console.error('Error adding place:', error.message);
    }
  };

  const handleConfirmLocation = () => {
    setShowMap(false); // Verstecke die Karte nach der Bestätigung
  };

  const findNearestCityId = (region, continentsData) => {
    let nearestCityId = null;
    let minDistance = Infinity;

    continentsData.forEach(continent => {
      continent.countries.forEach(country => {
        country.cities.forEach(city => {
          // Calculate the distance between the current city and the region
          const distance = haversineDistance(region.latitude,
            region.longitude,
            city.coordinates[0].latitude,
            city.coordinates[0].longitude);

          // Update the nearest city if this city is closer
          if (distance < minDistance) {
            minDistance = distance;
            nearestCityId = city.cityId;
          }
        });
      });
    });

    return nearestCityId;
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
                rotateEnabled={false}
                showsCompass={false}
                showsUserLocation={true}
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
          {/* Additional conditions for other place types could go here */}
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

AddPlaceModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  continentsData: PropTypes.array.isRequired
};


export default AddPlaceModal;
