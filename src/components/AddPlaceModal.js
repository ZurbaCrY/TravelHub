import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import MapView, { Marker } from 'react-native-maps';
import { customMapStyle } from '../styles/customMapStyle';
import { supabase } from '../services/supabase';
import PropTypes from 'prop-types';
import { styles } from '../styles/styles.js';
import { useDarkMode } from '../context/DarkModeContext';
import { haversineDistance, deg2rad } from '../services/MapMathematics';
import { findNearestCity } from '../backend/MapLocationChangeFunctions';
import { fetchData } from '../backend/LoadEditMapData'
import { MaterialIcons } from '@expo/vector-icons';
import Alert from './Alert';

const AddPlaceModal = ({ visible, onClose, setContinentsData, userID, continentsData }) => {
  const [placeName, setPlaceName] = useState('');
  const [placeDescription, setPlaceDescription] = useState('');
  const [placeType, setPlaceType] = useState('');
  const [entranceFee, setEntranceFee] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [showMap, setShowMap] = useState(false);
  let cityId;

    const [alertVisible, setAlertVisible] = useState(false);
    const [message, setMessage] = useState('');

    const showAlert = () => {
      setAlertVisible(true);
    };

    const hideAlert = () => {
      setAlertVisible(false);
    };

  const data = [
    { label: 'Sehenswürdigkeit', value: 'Sehenswürdigkeit' },
    { label: 'Restaurant', value: 'Restaurant' },
    { label: 'Einkaufsladen', value: 'Einkaufsladen' },
    { label: 'Aussichtspunkt', value: 'Aussichtspunkt' },
  ];

  const handleAddPlace = () => {
    if (!placeName || !placeDescription || !placeType || !coordinates) {
      setMessage('Bitte füllen Sie alle erforderlichen Felder aus.');
      showAlert();
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

  const addPlace = async (
    attractionName,
    typeOfAttraction,
    description,
    latitude,
    longitude) => {
    try {
      cityId = findNearestCity({
        latitude: latitude,
        longitude: longitude,
        latitudeDelta: 1,
        longitudeDelta: 1,
      }, continentsData).cityId;
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
      
      console.log('Place added');
      setMessage("Attraktion hinzugefügt!");
      showAlert();
      fetchData(setContinentsData, userID);
      //onClose();
    } catch (error) {
      console.error('Error adding place:', error.message);
    }
  };

  const handleConfirmLocation = () => {
    setShowMap(false);
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
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <MaterialIcons name="close" size={24} color="black" />
              </TouchableOpacity>
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
        </View>
      </View>
            <Alert
              visible={alertVisible}
              onClose={hideAlert}
              message={message}
            />
    </Modal>
  );
};

AddPlaceModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  continentsData: PropTypes.array.isRequired
};


export default AddPlaceModal;
