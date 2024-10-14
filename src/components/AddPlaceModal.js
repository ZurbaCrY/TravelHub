import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import MapView, { Marker } from 'react-native-maps';
import { customMapStyle } from '../styles/customMapStyle';
import { supabase } from '../services/supabase';
import PropTypes from 'prop-types';
import { styles } from '../styles/styles.js';
import { useDarkMode } from '../context/DarkModeContext';
import { fetchData } from '../backend/LoadEditMapData'
import { MaterialIcons } from '@expo/vector-icons';
import Alert from './Alert';
import { addPlaceToDB, validatePlaceData } from '../backend/LoadEditPlaceData';

const AddPlaceModal = ({ visible, onClose, setContinentsData, userID, continentsData }) => {
  const [place, setPlace] = useState({
    name: '',
    description: '',
    type: '',
    entranceFee: '',
    coordinates: null,
  });

  const data = [
    { label: 'Sehenswürdigkeit', value: 'Sehenswürdigkeit' },
    { label: 'Restaurant', value: 'Restaurant' },
    { label: 'Einkaufsladen', value: 'Einkaufsladen' },
    { label: 'Aussichtspunkt', value: 'Aussichtspunkt' },
  ];

  const [alertVisible, setAlertVisible] = useState(false);
  const [message, setMessage] = useState('');
  const [showMap, setShowMap] = useState(false);

  const showAlert = (message) => {
    setMessage(message);
    setAlertVisible(true);
  };

  const resetForm = () => {
    setPlace({
      name: '',
      description: '',
      type: '',
      entranceFee: '',
      coordinates: null,
    });
  };

  const handleAddPlace = async () => {
    const validation = validatePlaceData(place.name, place.description, place.type, place.coordinates);
    if (!validation.valid) {
      showAlert(validation.message);
      return;
    }

    const placeData = {
      name: place.name,
      type: place.type,
      description: place.description,
      latitude: place.coordinates.latitude,
      longitude: place.coordinates.longitude,
    };

    const result = await addPlaceToDB(placeData, continentsData);
    if (result.success) {
      showAlert("Attraktion hinzugefügt!");
      fetchData(setContinentsData, userID);
      resetForm();
    } else {
      console.error('Error adding place:', result.message);
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
            onChangeText={(text) => setPlace({ ...place, name: text })}
            value={place.name}
          />
          <TextInput
            style={styles.input}
            placeholder="Beschreibung des Ortes"
            onChangeText={(text) => setPlace({ ...place, description: text })}
            value={place.description}
          />
          <TouchableOpacity onPress={() => setShowMap(true)} style={[styles.locationButton, place.coordinates ? styles.locationButtonSelected : null]}>
            <Text style={styles.locationInput}>{place.coordinates ? 'Standort ausgewählt' : 'Standort wählen'}</Text>
          </TouchableOpacity>

          {showMap && (
            <View style={styles.mapContainer}>
              <MapView
                style={styles.map}
                onPress={(event) => setPlace({ ...place, coordinates: event.nativeEvent.coordinate })}
                customMapStyle={customMapStyle}
                rotateEnabled={false}
                showsCompass={false}
                showsUserLocation={true}
              >
                {place.coordinates && <Marker coordinate={place.coordinates} />}
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
              value={place.type}
              onChange={item => setPlace({ ...place, type: item.value })}
            />
          </View>
          {place.type === 'Sehenswürdigkeit' && (
            <TextInput
              style={styles.input}
              placeholder="Eintrittsgebühr"
              onChangeText={(text) => setPlace({ ...place, entranceFee: text })}
              value={place.entranceFee}
            />
          )}
          <TouchableOpacity onPress={handleAddPlace} style={styles.addButton}>
            <Text style={styles.buttonText}>Ort hinzufügen</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Alert
        visible={alertVisible}
        onClose={() => setAlertVisible(false)}
        message={message}
      />
    </Modal>
  );
};

export default AddPlaceModal;