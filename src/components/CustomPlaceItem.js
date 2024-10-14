import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import PropTypes from 'prop-types';

const CustomPlaceItem = ({ place, handleMarkerPress, handleStarClick, handlePlaceDetail, image, selected }) => {
  const isFavourite = place.favourite;

  return (
    <TouchableOpacity
      style={selected ? [styles.customPlaceItem, styles.selectedItem] : styles.customPlaceItem}
      onPress={() => handleMarkerPress(place)}
    >
      <View style={styles.customPlaceItemContainer}>
        {/* Bild links */}
        <Image
          source={{ uri: image }}
          style={styles.customPlaceItemImage}
        />
        {/* Name und Beschreibung rechts daneben */}
        <View style={styles.customPlaceItemTextContainer}>
          <Text style={styles.customPlaceItemName}>{place.name}</Text>
          <Text style={styles.customPlaceItemDescription}>{place.type}</Text>
        </View>
        {/* Sternsymbol */}
        <TouchableOpacity onPress={() => handleStarClick(place)} style={styles.starIconContainer}>
          {isFavourite ? <MaterialIcons name="star" size={24} color="#3EAAE9" /> : <MaterialIcons name="star-border" size={24} color="#3EAAE9" />}
        </TouchableOpacity>
        {/* Weiterleitungs-Symbol */}
        <TouchableOpacity onPress={() => handlePlaceDetail(place)} style={styles.iconContainer}>
          <MaterialIcons name="arrow-forward-ios" size={24} color="#3EAAE9" />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );
};

CustomPlaceItem.propTypes = {
  place: PropTypes.object.isRequired,
  handleMarkerPress: PropTypes.func.isRequired,
  handleStarClick: PropTypes.func.isRequired,
  handlePlaceDetail: PropTypes.func.isRequired,
  image: PropTypes.string,
  selected: PropTypes.bool.isRequired,
};

const styles = StyleSheet.create({
  customPlaceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  customPlaceItemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  customPlaceItemImage: {
    width: 50,
    height: 50,
    marginRight: 10,
    borderRadius: 25,
  },
  customPlaceItemTextContainer: {
    flex: 1,
  },
  customPlaceItemName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  customPlaceItemDescription: {
    fontSize: 14,
    color: '#666',
  },
  starIconContainer: {
    marginLeft: 'auto', // Setzt das Sternsymbol ganz rechts
    margin: 7,
  },
  selectedItem: {
    backgroundColor: '#FFFDF3', // Hintergrundfarbe ändern
  },
});

export default CustomPlaceItem;
