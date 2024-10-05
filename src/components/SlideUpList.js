import React from 'react';
import { View, Modal, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import CustomPlaceItem from './CustomPlaceItem';

const SlideUpList = ({
  showList,
  setShowList,
  searchResult,
  handleMarkerPress,
  handleStarClick,
  getListImage,
  handlePlaceDetail,
  selectedPlace,
  setForceUpdate,
  forceUpdate,
  styles,
  CURRENT_USER_ID
}) => {
  return (
    <Modal
      animationType="slide-up"
      transparent={true}
      visible={showList}
      onRequestClose={() => setShowList(false)}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {searchResult && searchResult.places.map(place => (
            <CustomPlaceItem
              key={`${place.name}-${forceUpdate}`}
              place={place}
              handleMarkerPress={handleMarkerPress}
              handleStarClick={(place) => handleStarClick(place, CURRENT_USER_ID, setForceUpdate)}
              image={getListImage(place)}
              handlePlaceDetail={handlePlaceDetail}
              selected={selectedPlace === place}
            />
          ))}
          <TouchableOpacity onPress={() => setShowList(false)} style={styles.arrowDown}>
            <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default SlideUpList;