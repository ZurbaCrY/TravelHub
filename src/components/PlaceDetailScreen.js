import React, { useEffect, useRef } from 'react';
import { View, Text, Animated, TouchableOpacity, Image, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const PlaceDetailScreen = ({ visible, place, onClose }) => {
  const translateX = useRef(new Animated.Value(-1000)).current; // Start außerhalb des Bildschirms

  useEffect(() => {
    if (visible) {
      // Animation starten, wenn sichtbar
      Animated.timing(translateX, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  }, [visible]);

  if (!visible || !place) {
    return null;
  }

  return (
    <Animated.View style={[styles.container, { transform: [{ translateX }] }]}>
      <View style={styles.content}>
        {/* Bild des Ortes */}
        {place.link ? (
          <Image
            source={{ uri: place.link }}
            style={styles.placeImage}
            onError={() => console.error("Image failed to load")}
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
    </Animated.View>
  );
};

PlaceDetailScreen.propTypes = {
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
  container: {
    flex: 1,
    position: 'absolute', // Überlagern des Bildschirms
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'white', // Hintergrundfarbe der Detailansicht
    zIndex: 9999, // Sicherstellen, dass die View oben ist
  },
  content: {
    padding: 20,
    flex: 1,
    justifyContent: 'center', // Optional: Vertikale Zentrierung
  },
  placeImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  placeholderImage: {
    width: '100%',
    height: 200,
    backgroundColor: '#e0e0e0', // Platzhalterfarbe
    borderRadius: 10,
    marginBottom: 10,
  },
  placeName: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  placeDescription: {
    fontSize: 16,
    marginVertical: 10,
  },
  placeType: {
    fontSize: 14,
    marginBottom: 10,
  },
  entranceFee: {
    fontSize: 14,
    marginBottom: 10,
  },
  priceLevel: {
    fontSize: 14,
    marginBottom: 10,
  },
  isOpen: {
    fontSize: 14,
    marginBottom: 10,
  },
  viewpointType: {
    fontSize: 14,
    marginBottom: 10,
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#3EAAE9',
    borderRadius: 5,
    alignItems: 'center',
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PlaceDetailScreen;
