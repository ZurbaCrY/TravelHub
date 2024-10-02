import React from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet, Image } from 'react-native';
import PropTypes from 'prop-types';
import { useDarkMode } from '../context/DarkModeContext';

const PlaceDetailModal = ({ visible, place, onClose }) => {
  if (!visible || !place) {
    return null;
  }

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Bild des Ortes (Platzhalter verwenden, wenn kein Bild vorhanden ist) */}
          {place.link ? (
            <Image
              source={{ uri: place.link }}
              style={styles.placeImage}
              onError={() => console.log("Image failed to load")}
            />
          ) : (
            <View style={styles.placeholderImage} />
          )}
          <Text style={styles.placeName}>{place.name}</Text>
          <Text style={styles.placeDescription}>{place.description}</Text>
          <Text style={styles.placeType}>Typ: {place.type}</Text>
          {place.type === 'Sehenswürdigkeit' && (
            <Text style={styles.entranceFee}>Eintrittsgebühr: {place.entranceFee} Euro</Text>
          )}
          {place.type === 'Restaurant' && (
            <Text style={styles.priceLevel}>Preisniveau: {place.priceLevel}</Text>
          )}
          {place.type === 'Einkaufsladen' && (
            <Text style={styles.isOpen}>Geöffnet: {place.isOpen ? 'Ja' : 'Nein'}</Text>
          )}
          {place.type === 'Aussichtspunkt' && (
            <Text style={styles.viewpointType}>Aussichtspunkttyp: {place.viewpointType}</Text>
          )}
          {/* Hier können weitere Details des Ortes hinzugefügt werden */}
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeButtonText}>Schließen</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

PlaceDetailModal.propTypes = {
  visible: PropTypes.bool.isRequired,
  place: PropTypes.shape({
    link: PropTypes.string,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    type: PropTypes.string,
    entranceFee: PropTypes.number,
    priceLevel: PropTypes.string,
    isOpen: PropTypes.bool,
    viewpointType: PropTypes.string,
  }),
  onClose: PropTypes.func.isRequired,
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
    height: '80%',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  placeImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    borderRadius: 10,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    marginBottom: 10,
    backgroundColor: 'lightgray',
    borderRadius: 10,
  },
  placeName: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  placeDescription: {
    fontSize: 16,
    marginBottom: 10,
  },
  placeType: {
    fontSize: 16,
    marginBottom: 10,
  },
  entranceFee: {
    fontSize: 16,
    marginBottom: 10,
  },
  priceLevel: {
    fontSize: 16,
    marginBottom: 10,
  },
  isOpen: {
    fontSize: 16,
    marginBottom: 10,
  },
  viewpointType: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    padding: 10,
    backgroundColor: 'lightgray',
    borderRadius: 5,
    alignSelf: 'flex-end', // Neu hinzugefügt
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'black',
  },
});

export default PlaceDetailModal;
