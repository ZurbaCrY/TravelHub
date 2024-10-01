import React from 'react';
import { View, ScrollView, TouchableOpacity, Text } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

const SlideUpBar = ({
  scrollViewRef,
  styles,
  showBottomLine,
  searchResult,
  selectedPlace,
  handleMarkerPress,
  scrollToTop
}) => {
  return (
    <View style={styles.bottomBar}>
      <ScrollView
        ref={scrollViewRef}
        contentContainerStyle={styles.bottomBarContent}
        horizontal
        showsHorizontalScrollIndicator={false}
      >
        {/* Liste der Orte für die gesuchte Stadt anzeigen */}
        {showBottomLine && searchResult && searchResult.places.map(place => (
          <TouchableOpacity
            key={place.name}
            style={
              selectedPlace === place
                ? [styles.placeItem, styles.selectedPlaceItem]
                : styles.placeItem
            }
            onPress={() => handleMarkerPress(place)}
          >
            <Text>{place.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {showBottomLine && searchResult.places.length > 0 && (
        <TouchableOpacity onPress={scrollToTop} style={styles.arrowButton}>
          <MaterialIcons name="keyboard-arrow-up" size={24} color="black" />
        </TouchableOpacity>
      )}
    </View>
  );
};

export default SlideUpBar;