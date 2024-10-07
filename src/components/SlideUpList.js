import React, { useRef } from 'react';
import { View, Text } from 'react-native';
import BottomSheet from '@gorhom/bottom-sheet';
import CustomPlaceItem from './CustomPlaceItem';
import { slideUpListStyles } from '../styles/slideUpListStyles';

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
  CURRENT_USER_ID,
}) => {
  const bottomSheetRef = useRef(null);

  // Snap points define the open heights of the bottom sheet
  const snapPoints = ['5%', '50%', '90%'];

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={showList ? 1 : -1} // Shows the sheet when showList is true
      snapPoints={snapPoints}
      enablePanDownToClose={false} // Verhindert das Schließen durch nach unten wischen
      onChange={(index) => {
        // Nur schließen, wenn die BottomSheet auf -1 ist
        if (index === -1) setShowList(false);
      }}
    >
      {/* Handle indicator (the small stripe for drag handle) */}
      <View style={slideUpListStyles.handleIndicator} />

      {/* Content for the Bottom Sheet */}
      <View style={slideUpListStyles.sheetContent}>
        {searchResult && searchResult.places.length > 0 ? (
          searchResult.places.map((place) => (
            <CustomPlaceItem
              key={`${place.name}-${forceUpdate}`}
              place={place}
              handleMarkerPress={handleMarkerPress}
              handleStarClick={() => handleStarClick(place, CURRENT_USER_ID, setForceUpdate)}
              image={getListImage(place)}
              handlePlaceDetail={handlePlaceDetail}
              selected={selectedPlace === place}
            />
          ))
        ) : (
          <View style={slideUpListStyles.hiddenList}>
            <Text style={{ color: '#888' }}>Keine Ergebnisse</Text>
          </View>
        )}
      </View>
    </BottomSheet>
  );
};

export default SlideUpList;
