import React, { useRef, useState, useEffect } from 'react';
import { ActivityIndicator, View, Text } from 'react-native';
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
  const [isLoading, setIsLoading] = useState(true); // Ladezustand

  // Snap points define the open heights of the bottom sheet
  const snapPoints = ['7%', '25%', '37%', '50%', '90%'];

  useEffect(() => {
    // Ladezustand basierend auf den Suchergebnissen
    if (searchResult) {
      setIsLoading(false); // Wenn Ergebnisse vorhanden sind, beende das Laden
    } else {
      setIsLoading(true); // Wenn keine Ergebnisse, zeige das Ladesymbol
    }
  }, [searchResult]);

  return (
    <BottomSheet
      ref={bottomSheetRef}
      index={showList ? 1 : -1} // Shows the sheet when showList is true
      snapPoints={snapPoints}
      enablePanDownToClose={false} // Verhindert das Schließen durch nach unten wischen
      onChange={(index) => {
        if (snapPoints[index] === '90%') {
          setShowList(false);
        } else {
          setShowList(true);
        }
      }}
    >
      {/* Handle indicator (the small stripe for drag handle) */}
      <View />

      {/* Content for the Bottom Sheet */}
      <View style={slideUpListStyles.sheetContent}>
        {isLoading ? (
          <View style={slideUpListStyles.hiddenList}>
            <ActivityIndicator size="large" color="#3EAAE9" />
            <Text>Loading Results...</Text>
          </View>
        ) : searchResult && searchResult.places.length > 0 ? (
          // Zuerst den selectedPlace filtern und an den Anfang setzen
          searchResult.places
            .filter((place) => place === selectedPlace) // Filtert den selectedPlace
            .concat(searchResult.places.filter((place) => place !== selectedPlace)) // Fügt die restlichen Plätze hinzu
            .map((place) => (
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
            <Text>Keine Ergebnisse an diesem Ort</Text>
          </View>
        )}
      </View>
    </BottomSheet>
  );
};

export default SlideUpList;
