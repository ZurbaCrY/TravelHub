import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import MapView, { Marker } from 'react-native-maps'; // assuming you have 'react-native-maps' installed
import AntDesign from '@expo/vector-icons/AntDesign';

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
    setPlaceType('');
    console.log(coordinates);
    onClose();
  };

  const handleConfirmLocation = () => {
    // Hier kannst du die ausgewählten Koordinaten bestätigen und speichern
    setShowMap(false); // Verstecke die Karte nach der Bestätigung
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
          <TouchableOpacity onPress={() => setShowMap(true)} style={styles.locationButton}>
                      <Text style={styles.locationInput}>Standort wählen</Text>
                    </TouchableOpacity>
                    {showMap && (
                      <View style={styles.mapContainer}>
                        <MapView
                          style={styles.map}
                          onPress={(event) => setCoordinates(event.nativeEvent.coordinate)}
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
