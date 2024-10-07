import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Modal, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import * as Location from 'expo-location';
import { customMapStyle } from '../styles/customMapStyle';
import { MaterialIcons } from '@expo/vector-icons';
import CustomPlaceItem from '../components/CustomPlaceItem';
import PlaceDetailScreen from '../components/PlaceDetailScreen';
import AddPlaceModal from '../components/AddPlaceModal';
import { Button } from 'react-native-paper'
import { supabase } from '../services/supabase';
import AuthService from '../services/auth'
import { useDarkMode } from '../context/DarkModeContext';
import { fetchData, updateVisitedCountry, updateOrCreateVisitedCountry } from '../backend/LoadEditMapData';
import { updateFavourite, deleteFavourite, getMarkerForPlace, getDescriptionForPlace, getListImage, getNameForPlace, handleStarClick } from '../backend/LoadEditPlaceData';
import { findNearestCity } from '../backend/MapLocationChangeFunctions';
import MapSearchBar from '../components/MapSearchBar';
import Map from '../components/Map';
import SlideUpBar from '../components/SlideUpBar';
import SlideUpList from '../components/SlideUpList';

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
  const [region, setRegion] = useState(null); // Zustand für die aktuelle Kartenregion
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

  const CURRENT_USER = AuthService.getUser();
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
          setErrorMsg('Permission to access location was denied');
          return;
        }

        let currentLocation = await Location.getCurrentPositionAsync({});
        setLocation(currentLocation);

        if (currentLocation) {
          setRegion({
            latitude: currentLocation.coords.latitude,
            longitude: currentLocation.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          });
        }
      })();
  }, []);


  /**
   * Funktionen zum Verändern der Position der Map.
   *
  */
  const onRegionChangeComplete = (region) => {
    setZoomLevel(region.latitudeDelta);
    setRegion(region);

    if (region.latitudeDelta < 12) {
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
    <View style={styles.container}>

      {/* Search Bar mit Autocomplete Feature */}
      <MapSearchBar
        styles={styles}
        mapRef={mapRef}
        scrollToStart={scrollToStart}
        setSelectedCoordinates={setSelectedCoordinates}
        setSelectedPlace={setSelectedPlace}
        setSearchResult={setSearchResult}
        continentsData={continentsData}
      />

      {/* Symbol mit einem Plus oben links um "Ort-hinzufügen" Modul zu öffnen*/}
      <TouchableOpacity style={styles.addButton} onPress={handleOpenModal} >
        <MaterialIcons name="add" size={24} color="black" />
      </TouchableOpacity>

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
        styles={styles}
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

/**
 * Stylesheet was genutzt wird.
 *
 */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  map: {
    flex: 1,
    width: '100%',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingVertical: 25,
  },
  bottomBarContent: {
    paddingHorizontal: 20,
  },
  placeItem: {
    marginRight: 10,
    padding: 5,
    borderRadius: 5,
    bottom: 0,
    backgroundColor: '#eee',
  },
  selectedPlaceItem: {
    marginRight: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#dbe155', // Hintergrundfarbe für den ausgewählten Ort
  },
  crossButton: {
    position: 'absolute',
    bottom: 22,
    right: 16,
  },
  arrowButton: {
    position: 'absolute',
    top: 0, // Adjust position as needed
    right: (width - 24) / 2, // Width of the screen minus width of the icon divided by 2
  },
  modalContainer: {
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },

  arrowDown: {
    position: 'absolute',
    top: 0, // Adjust position as needed
    right: (width - 24) / 2, // Width of the screen minus width of the icon divided by 2
  },

  customPlaceItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  customSelectedPlaceItem: {
    backgroundColor: '#e0e0e0',
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
  },
  addButton: {
    position: 'absolute',
    top: 20,
    left: 20,
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 20,
    zIndex: 1, // Stelle sicher, dass das Plus-Symbol über anderen Elementen liegt
    marginTop: 90,
    borderWidth: 1,
    borderColor: 'black',
  },
  searchContainer: {
    position: 'relative', // Ändere die Position auf 'relative', um 'absolute'-positionierte Kinder zu berücksichtigen
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 30,
    zIndex: 2,
  },
  searchInput: {
    width: '70%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginLeft: 10,
    marginRight: 10,
    marginTop: 10,
    paddingHorizontal: 10,
  },
  listViewContainer: {
    position: 'absolute',
    top: '100%',
    maxHeight: 150,
    zIndex: 10,
  },
  searchLocationButton: {
    height: 40,
    color: 'black',
  },
  button: {
    backgroundColor: "#3EAAE9",
    height: 40,
    borderRadius: 7,
    marginTop: 10,
    marginRight: 5,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledContainer: {
    opacity: 0.5, // Verringert die Deckkraft des Containers, um ihn auszugrauen
  },
  disabledInput: {
    backgroundColor: '#f2f2f2', // Ändert die Hintergrundfarbe des Eingabefelds, um es auszugrauen
  },
});