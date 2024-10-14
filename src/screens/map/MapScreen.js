import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Modal, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { customMapStyle } from '../../styles/customMapStyle';
import { MaterialIcons } from '@expo/vector-icons';
import CustomPlaceItem from '../../components/CustomPlaceItem';
import PlaceDetailScreen from '../../components/PlaceDetailScreen';
import AddPlaceModal from '../../components/AddPlaceModal';
import { Button } from 'react-native-paper'
import { supabase } from '../../services/supabase';
import AuthService from '../../services/auth'
import { useDarkMode } from '../../context/DarkModeContext';
import { fetchData, updateVisitedCountry, updateOrCreateVisitedCountry } from '../../backend/LoadEditMapData';
import { updateFavourite, deleteFavourite, getMarkerForPlace, getDescriptionForPlace, getListImage, getNameForPlace, handleStarClick } from '../../backend/LoadEditPlaceData';
import { findNearestCity } from '../../backend/MapLocationChangeFunctions';
import MapSearchBar from '../../components/MapSearchBar';
import Map from '../../components/Map';
import SlideUpBar from '../../components/SlideUpBar';
import SlideUpList from '../../components/SlideUpList';
import { useAuth } from '../../context/AuthContext';
import { commonStyles } from '../../styles/mapScreenStyles';

const { width } = Dimensions.get('window');

/**
 * Implementation MapScreen Komponente.
 *
 */
export default function MapScreen() {

  /**
   * State Variablen der Map.
   *
   */
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(null);
  const [showMarkers, setShowMarkers] = useState(false);
  const [searchResult, setSearchResult] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [region, setRegion] = useState(null);
  const [mapRef, setMapRef] = useState(null);
  const [showBottomLine, setShowBottomLine] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState(null);
  const scrollViewRef = useRef(null);
  const [showList, setShowList] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(false);
  const [showPlaceDetailModal, setShowPlaceDetailModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCoordinates, setSelectedCoordinates] = useState(null);
  const [continentsData, setContinentsData] = useState([]);
  const [hasZoomedToUserLocation, setHasZoomedToUserLocation] = useState(false);

  const { user } = useAuth();
  const CURRENT_USER = user;
  const CURRENT_USER_ID = CURRENT_USER.id;

  /**
     * UseEffect-Hooks für das erstmalige Aufrufen -> Laden der Karte und Daten aus der DB.
     * Aktualisieren der Position und der nächstgelegenen Stadt.
  */
  useEffect(() => {
      fetchData(setContinentsData, CURRENT_USER_ID);

      if (location) {
        updateVisitedCountry(location, continentsData, CURRENT_USER_ID);
      }
  }, []);

  useEffect(() => {
      if (scrollViewRef.current && selectedPlace) {
        const index = searchResult.places.findIndex(place => place === selectedPlace);
        const offsetX = index * 120;

        scrollViewRef.current.scrollTo({ x: offsetX, y: 0, animated: true });
      }

      if (location) {
          updateVisitedCountry(location, continentsData, CURRENT_USER_ID);
      }
  }, [selectedPlace]);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.log('Permission to access location was denied');
        return;
      }

      let currentLocation = await Location.getCurrentPositionAsync({});
      setLocation(currentLocation);

      if (currentLocation && !hasZoomedToUserLocation) {
        const newRegion = {
          latitude: currentLocation.coords.latitude,
          longitude: currentLocation.coords.longitude,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        };

        setRegion(newRegion);

        // Check if mapRef is available, and if we haven't zoomed already
        if (mapRef) {
          mapRef.animateToRegion(newRegion, 1000);  // Zoom to the user's current location
          setHasZoomedToUserLocation(true);  // Set flag to true so it won't zoom again
        }
      }
    })();
  }, [mapRef]);  // Dependencies: runs when mapRef is set


  /**
   * Funktionen zum Verändern der Position der Map.
   *
  */
  const onRegionChangeComplete = (region) => {
    setZoomLevel(region.latitudeDelta);
    setRegion(region);

    if (region.latitudeDelta < 1) {
      setShowMarkers(true);
      setShowBottomLine(true);
    } else {
      setShowMarkers(false);
      setShowBottomLine(false);
    }
    const nearestCity = findNearestCity(region, continentsData);

    setSearchResult(nearestCity);
  };


  /**
   * Funktionen für die Veränderung von Map Komponenten.
   *    - automatisches Zurückscrollen bei Ortswechsel in den Ortslisten
   *    - Auswählen von Attraktionen durch Klicken auf Marker
   *    - Öffnen und Schließen der Slide-Up Bar und Attraktionen Screen
   *
   */
  const scrollToStart = () => {
    if (scrollViewRef.current) {
      scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
    }
  };

  const handleResetPlaces = () => {
    setShowBottomLine(false);
    setSelectedPlace(null);
  };

  const handleMarkerPress = (place) => {
    setSelectedPlace(place);
    if (mapRef) {
      mapRef.animateToRegion({
        latitude: place.coordinates.latitude,
        longitude: place.coordinates.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      }, 1000);
    }
  };

  const handleMapPress = () => {
    setSelectedPlace(null);
  };

  const scrollToTop = () => {
    setShowList(true);
    fetchData(setContinentsData, CURRENT_USER_ID);
  };

  const handlePlaceDetail = (place) => {
    setSelectedPlace(place);
    setShowPlaceDetailModal(true);
  };

  const handleOpenModal = () => {
    setShowAddModal(true);
  };


  /**
   * tatsächliche Map Komponenten fürs Rendering.
   *
   */
  return (
    <View style={commonStyles.container}>

      {/* Search Bar mit Autocomplete Feature */}
      <MapSearchBar
        styles={commonStyles}
        mapRef={mapRef}
        scrollToStart={scrollToStart}
        setSelectedCoordinates={setSelectedCoordinates}
        setSelectedPlace={setSelectedPlace}
        setSearchResult={setSearchResult}
        continentsData={continentsData}
        setRegion={setRegion}
      />

      {/* Symbol mit einem Plus oben links um "Ort-hinzufügen" Modul zu öffnen*/}
      {showList && (
          <TouchableOpacity style={commonStyles.addButton} onPress={handleOpenModal}>
            <MaterialIcons name="add" size={24} color="black" />
          </TouchableOpacity>
      )}

      {/* Sobald Standort verfügbar -> Laden der MAP */}
      <Map
        location={location}
        region={region}
        onRegionChangeComplete={onRegionChangeComplete}
        handleMapPress={handleMapPress}
        handleMarkerPress={handleMarkerPress}
        setMapRef={setMapRef}
        continentsData={continentsData}
        showMarkers={showMarkers}
        selectedPlace={selectedPlace}
        getMarkerForPlace={getMarkerForPlace}
        getNameForPlace={getNameForPlace}
        getDescriptionForPlace={getDescriptionForPlace}
        customMapStyle={customMapStyle}
        styles={commonStyles}
      />

      {/* Modal für die aufgeklappte Liste bzw. Slide-Up Bar */}
      <SlideUpList
        showList={showList}
        setShowList={setShowList}
        searchResult={searchResult}
        handleMarkerPress={handleMarkerPress}
        handleStarClick={handleStarClick}
        getListImage={getListImage}
        handlePlaceDetail={handlePlaceDetail}
        selectedPlace={selectedPlace}
        setForceUpdate={setForceUpdate}
        forceUpdate={forceUpdate}
        CURRENT_USER_ID={CURRENT_USER_ID}
      />

      {/* Das Modal für die Ortseinzelheiten */}
      <PlaceDetailScreen
        visible={showPlaceDetailModal}
        place={selectedPlace}
        onClose={() => setShowPlaceDetailModal(false)}
      />

      {/* Das Modal fürs Hinzufügen von Orten */}
      <AddPlaceModal
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        setContinentsData={setContinentsData}
        userID={CURRENT_USER_ID}
        continentsData={continentsData}
      />

    </View>
  );
}