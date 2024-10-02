import React from 'react';
import { Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';

const Map = ({
  location,
  region,
  onRegionChangeComplete,
  handleMapPress,
  handleMarkerPress,
  setMapRef,
  continentsData,
  showMarkers,
  selectedPlace,
  getMarkerForPlace,
  getNameForPlace,
  getDescriptionForPlace,
  customMapStyle,
  styles
}) => {
  return (
    location ? (
      <MapView
        provider={PROVIDER_GOOGLE}
        style={styles.map}
        mapType={"mutedStandard"}
        showsUserLocation={true}
        region={region}
        backgroundColor="lightblue"
        onRegionChangeComplete={onRegionChangeComplete}
        showsPointsOfInterest={false}
        showsTraffic={false}
        customMapStyle={customMapStyle}
        showsIndoors={false}
        showsIndoorLevelPicker={false}
        rotateEnabled={false}
        showsCompass={false}
        onPress={handleMapPress}
        ref={setMapRef}
      >
        {/* Markierungen für verschiedene Arten von Orten anzeigen */}
        {showMarkers && continentsData.flatMap(continent =>
          continent.countries.flatMap(country =>
            country.cities.flatMap(city =>
              city.places.map(place => (
                <Marker
                  key={`${continent.name}-${country.name}-${city.name}-${place.name}-${selectedPlace && selectedPlace.name === place.name ? 'selected' : 'unselected'}`}
                  coordinate={place.coordinates}
                  onPress={() => handleMarkerPress(place)}
                  title={getNameForPlace(place)}
                  description={getDescriptionForPlace(place)}
                  calloutEnabled={true}
                  image={getMarkerForPlace(place)}
                  style={{ width: 20, height: 20 }}
                />
              ))
            )
          )
        )}
      </MapView>
    ) : (
      <Text>Map Loading...</Text>
    )
  );
};

export default Map;