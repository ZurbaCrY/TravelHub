import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

const AddPlaceModal = ({ visible, onClose }) => {
  const [placeName, setPlaceName] = useState('');
  const [placeDescription, setPlaceDescription] = useState('');
  const [placeType, setPlaceType] = useState('');
  const [entranceFee, setEntranceFee] = useState('');
  const [priceLevel, setPriceLevel] = useState('');
  const [isOpen, setIsOpen] = useState('');
  const [viewpointType, setViewpointType] = useState('');

  const handleAddPlace = () => {
    // Hier kannst du die Logik zum Hinzufügen des Ortes implementieren
    // Verwende die eingegebenen Werte (placeName, placeDescription usw.)
    // Schließe das Modal nach dem Hinzufügen des Ortes
    onClose();
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
          <TextInput
            style={styles.input}
            placeholder="Typ des Ortes"
            onChangeText={setPlaceType}
            value={placeType}
          />
          {placeType === 'Sehenswürdigkeit' && (
            <TextInput
              style={styles.input}
              placeholder="Eintrittsgebühr"
              onChangeText={setEntranceFee}
              value={entranceFee}
            />
          )}
          {placeType === 'Restaurant' && (
            <TextInput
              style={styles.input}
              placeholder="Preisniveau"
              onChangeText={setPriceLevel}
              value={priceLevel}
            />
          )}
          {placeType === 'Einkaufsladen' && (
            <TextInput
              style={styles.input}
              placeholder="Geöffnet? (Ja/Nein)"
              onChangeText={setIsOpen}
              value={isOpen}
            />
          )}
          {placeType === 'Aussichtspunkt' && (
            <TextInput
              style={styles.input}
              placeholder="Typ des Aussichtspunkts"
              onChangeText={setViewpointType}
              value={viewpointType}
            />
          )}
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
});

export default AddPlaceModal;
