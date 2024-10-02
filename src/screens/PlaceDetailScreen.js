import React from 'react';
import { View, Text, Modal, TouchableOpacity, Image } from 'react-native';
import PropTypes from 'prop-types';
import { useDarkMode } from '../context/DarkModeContext';
import { styles } from '../style/styles.js'; // Relativer Pfad

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
    type: PropTypes.string.isRequired,
    entranceFee: PropTypes.number,
    priceLevel: PropTypes.string,
    isOpen: PropTypes.bool,
    viewpointType: PropTypes.string,
  }).isRequired,
  onClose: PropTypes.func.isRequired,
};

export default PlaceDetailModal;
