import React, { useState, useEffect, useRef } from 'react';
import { StyleSheet, View, Modal, Text, TextInput, Button, ScrollView, TouchableOpacity, Dimensions, Image } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polygon, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { customMapStyle } from '../resources/customMapStyle';
import { MaterialIcons } from '@expo/vector-icons'; // Beispiel für ein Icon-Paket, hier MaterialIcons von Expo
import CustomPlaceItem from '../resources/CustomPlaceItem'; // Annahme: Pfad zur Datei mit der CustomPlaceItem-Komponente
import PlaceDetailScreen from './PlaceDetailScreen';


const { width } = Dimensions.get('window');

// Definition der Klassen
class Continent {
  constructor(name, countries) {
    this.name = name;
    this.countries = countries;
    this.locked = true; // Annahme: alle Kontinente sind zu Beginn gesperrt
  }
}

class Country {
  constructor(name, cities) {
    this.name = name;
    this.cities = cities;
    this.locked = true; // Annahme: alle Länder sind zu Beginn gesperrt
  }
}

class City {
  constructor(name, coordinates, places) {
    this.name = name;
    this.coordinates = coordinates;
    this.priceLevel = 1; // z.B. preisliche Einordnung der Stadt
    this.places = places; // Array von Orten in der Stadt
    this.locked = true; // Annahme: alle Städte sind zu Beginn entsperrt
  }
}

class Place {
  constructor(name, coordinates, type) {
    this.name = name;
    this.coordinates = coordinates;
    this.type = type; // Der Ortstyp (z.B. 'Sehenswürdigkeit', 'Restaurant', 'Einkaufsladen', 'Aussichtspunkt')
    this.favourite = false;
  }
    // Methode zum Aktualisieren des Favoritenstatus
    toggleFavourite() {
      this.favourite = !this.favourite;
    }
}

class SightseeingSpot extends Place {
  constructor(name, coordinates, entranceFee) {
    super(name, coordinates);
    this.type = 'Sehenswürdigkeit';
    this.entranceFee = entranceFee; // Eintrittsgebühr für Sehenswürdigkeiten
  }
}

class Restaurant extends Place {
  constructor(name, coordinates, priceLevel, cuisineType) {
    super(name, coordinates);
    this.type = 'Restaurant';
    this.priceLevel = priceLevel; // Preisniveau des Restaurants
    this.cuisineType = cuisineType; // Art der Küche im Restaurant
  }
}

class ShoppingStore extends Place {
  constructor(name, coordinates, category, isOpen) {
    super(name, coordinates);
    this.type = 'Einkaufsladen';
    this.category = category; // Kategorie des Geschäfts (z.B. Bekleidung, Souvenirs, Lebensmittel)
    this.isOpen = isOpen; // Gibt an, ob der Laden geöffnet ist oder nicht
  }
}

class Viewpoint extends Place {
  constructor(name, coordinates, viewpointType, height) {
    super(name, coordinates);
    this.type = 'Aussichtspunkt';
    this.viewpointType = viewpointType; // Art des Aussichtspunkts (z.B. Berggipfel, Wolkenkratzer, Aussichtsturm)
    this.height = height; // Höhe des Aussichtspunkts über dem Meeresspiegel oder der umgebenden Landschaft
  }
}

// Daten für die Weltkarte
const continentsData = [
  new Continent('Europe', [
    new Country('Germany', [
      new City('Berlin', [
                             { latitude: 52.698878, longitude: 13.373108 },
                             { latitude: 52.61313, longitude: 13.055878 },
                             { latitude: 52.343141, longitude: 13.212433 },
                             { latitude: 52.304555, longitude: 13.709564 },
                             { latitude: 52.529719, longitude: 13.907318 }
                         ], [
                              new SightseeingSpot('Brandenburger Tor', { latitude: 52.516275, longitude: 13.377704 }, 0), // Brandenburger Tor hat keine Eintrittsgebühr
                              new Restaurant('Mustermanns Restaurant', { latitude: 52.5233, longitude: 13.4127 }, 3, 'Deutsch'), // Mustermanns Restaurant ist mittelpreisig und serviert deutsche Küche
                              new Restaurant('Pizza Paradies', { latitude: 52.5111, longitude: 13.3985 }, 2, 'Italienisch'), // Pizza Paradies ist preiswert und serviert italienische Küche
                              new SightseeingSpot('Fernsehturm Berlin', { latitude: 52.5200, longitude: 13.4074 }, 10), // Fernsehturm Berlin hat eine Eintrittsgebühr von 10 Euro
                              new Restaurant('Sushi Deluxe', { latitude: 52.5144, longitude: 13.3453 }, 4, 'Japanisch'), // Sushi Deluxe ist teuer und serviert japanische Küche
                              // Weitere Orte hinzufügen
                            ]
),
      // weitere Städte hinzufügen...
    ]),
    new Country('France', [
      new City('Paris', [
    { latitude: 48.945447, longitude: 2.135468 }, // Obere linke Ecke
    { latitude: 48.716946, longitude: 2.146454 }, // Untere linke Ecke
    { latitude: 48.748628, longitude: 2.703323 }, // Untere rechte Ecke
    { latitude: 49.013582, longitude: 2.526855 }, // Obere rechte Ecke
        // Weitere Koordinaten für Paris hinzufügen...
      ], [
        new SightseeingSpot('Eiffel Tower', { latitude: 48.8584, longitude: 2.2945 }, 10), // Eiffelturm mit Eintrittsgebühr
        new SightseeingSpot('Louvre Museum', { latitude: 48.8606, longitude: 2.3376 }, 12), // Louvre Museum mit Eintrittsgebühr
        // Weitere Sehenswürdigkeiten hinzufügen...
      ]),
      new City('Marseille',[
      { latitude: 43.2964, longitude: 5.3700 },
      ], []),
      // Weitere Städte in Frankreich hinzufügen...
    ]),
  ]),
  // weitere Kontinente hinzufügen...
];

export default function MapScreen() {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(null);
  const [showMarkers, setShowMarkers] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResult, setSearchResult] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
    const [region, setRegion] = useState(null); // Zustand für die aktuelle Kartenregion
      const [mapRef, setMapRef] = useState(null);
    const [showBottomLine, setShowBottomLine] = useState(false);
      const [selectedPlace, setSelectedPlace] = useState(null);
        const scrollViewRef = useRef(null);
        const [showList, setShowList] = useState(false);
        const [forceUpdate, setForceUpdate] = useState(false);
          const [showPlaceDetailModal, setShowPlaceDetailModal] = useState(false);



useEffect(() => {
  // Scrollen zur ausgewählten Position in der ScrollView
  if (scrollViewRef.current && selectedPlace) {
    const index = searchResult.places.findIndex(place => place === selectedPlace);
    const offsetX = index * 120; // Breite des Platzhalters plus Abstand

    scrollViewRef.current.scrollTo({ x: offsetX, y: 0, animated: true });
  }
}, [selectedPlace]); // Füge selectedPlace als Abhängigkeit hinzu

useEffect(() => {
  (async () => {
    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
      return;
    }

    let location = await Location.getCurrentPositionAsync({});
    setLocation(location);
    setRegion({
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
      latitudeDelta: 0.0922,
      longitudeDelta: 0.0421,
    }); // Setze die anfängliche Kartenregion
    console.log("folgendes Land wurde besucht: " + findCountry(findNearestCity({
                                                                         latitude: location.coords.latitude,
                                                                         longitude: location.coords.longitude,
                                                                         latitudeDelta: 0.0922,
                                                                         longitudeDelta: 0.0421,
                                                                       })).name);
  })();
}, []);


  const getImageForPlace = (place) => {
        if (place === selectedPlace){
            return require('../resources/travel-marker-x.png');
        }
        switch (place.type) {
          case 'Sehenswürdigkeit':
            return require('../resources/travel-marker-s.png');
          case 'Restaurant':
            return require('../resources/travel-marker-r.png');
          case 'Einkaufsladen':
            return require('../resources/travel-marker-m.png');
          case 'Aussichtspunkt':
            return require('../resources/travel-marker-v.png');
          default:
            return require('../resources/travel-marker-x.png');
        }
  };

  const getDescriptionForPlace = (place) => {
  if (place === selectedPlace) {
        if (place.type === 'Sehenswürdigkeit') {
          return (place instanceof SightseeingSpot) ? `Eintritt: ${place.entranceFee || 'N/A'}` : 'N/A';
        } else if (place.type === 'Restaurant') {
          return `Preisniveau: ${place.priceLevel || 'N/A'}, Küche: ${place.cuisineType || 'N/A'}`;
        } else {
          return 'N/A';
        }
   } else {
        return null;
   }
  };

  const getListImage = (place) => {

    return 'https://www.fineart-panorama.de/361381/eiffelturm-paris-im-morgenlicht.jpg'

  };

  const getNameForPlace = (place) => {
    if (place === selectedPlace){
        return place.name;
    } else{
        return null;
    }
  }

  const findMiddleCoordinate = (coordinates) => {
    if (coordinates.length === 0) {
      return null;
    }

    let sumLat = 0;
    let sumLng = 0;

    // Summiere die Breiten- und Längengrade aller Koordinaten
    for (const coord of coordinates) {
      sumLat += coord.latitude;
      sumLng += coord.longitude;
    }

    // Berechne den Durchschnitt der Breiten- und Längengrade
    const avgLat = sumLat / coordinates.length;
    const avgLng = sumLng / coordinates.length;

    // Gib die mittlere Koordinate zurück
    return { latitude: avgLat, longitude: avgLng };
  };


  const onRegionChangeComplete = (region) => {
    // Update the zoom level whenever the region changes
    setZoomLevel(region.latitudeDelta);
    setRegion(region);

    // Check the zoom level and decide whether to show markers or not
    if (region.latitudeDelta < 12) {
      setShowMarkers(true);
      setShowBottomLine(true);
    } else {
      setShowMarkers(false);
      setShowBottomLine(false);
    }
  // Find the nearest city based on the current region
  const nearestCity = findNearestCity(region);

  // Set the searchLocation state to the nearest city
  setSearchResult(nearestCity);
  //console.log(nearestCity.name);
};

// Function to find the nearest city based on the current region
const findNearestCity = (region) => {
  let nearestCity = null;
  let minDistance = Infinity;

  // Iterate through all cities to find the nearest one
  continentsData.forEach(continent => {
    continent.countries.forEach(country => {
      country.cities.forEach(city => {
        // Calculate the distance between the current city and the center of the region
        const distance = haversineDistance(region.latitude, region.longitude, city.coordinates[0].latitude, city.coordinates[0].longitude);

        // Update the nearest city if this city is closer
        if (distance < minDistance) {
          minDistance = distance;
          nearestCity = city;
        }
      });
    });
  });

  return nearestCity;
};

const findCountry = (city) => {
  let country = null;

  continentsData.forEach(continent => {
    continent.countries.forEach(c => {
      const foundCity = c.cities.find(c => c.name === city.name);
      if (foundCity) {
        country = c;
        return; // Beende die Schleife, wenn die Stadt gefunden wurde
      }
    });
  });

  return country;
};


// Function to calculate the distance between two coordinates using the Haversine formula
const haversineDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
};

// Function to convert degrees to radians
const deg2rad = (deg) => {
  return deg * (Math.PI / 180);
};

const scrollToStart = () => {
  if (scrollViewRef.current) {
    scrollViewRef.current.scrollTo({ x: 0, y: 0, animated: true });
  }
};

    const handleSearch = async () => {
          const result = continentsData.find(continent =>
            continent.countries.some(country =>
              country.cities.some(city =>
                city.name.toLowerCase() === searchQuery.toLowerCase()
              )
            )
          );
          //console.log(result);

          if (result) {
            // Durch die Länder des Ergebnisses iterieren
            const matchingCountry = result.countries.find(country =>
              country.cities.some(city =>
                city.name.toLowerCase() === searchQuery.toLowerCase()
              )
            ); // Zugriff auf das erste Element des Arrays

            //console.log(matchingCountry);

            if (matchingCountry) {
                    const city = matchingCountry.cities.find(city =>
                        city.name.toLowerCase() === searchQuery.toLowerCase()
                    );
                    //console.log(city);
                                if (city) {
                                  setSearchResult(city);
                                  setSelectedPlace(null);
                                  scrollToStart();
                                  const middleCoordinate = findMiddleCoordinate(city.coordinates);

                                  // Animiere die Karte zur Mitte der gesuchten Stadt über einen Zeitraum von 1000 Millisekunden (1 Sekunde)
                                  if (mapRef) {
                                    mapRef.animateToRegion({
                                      latitude: middleCoordinate.latitude,
                                      longitude: middleCoordinate.longitude,
                                      latitudeDelta: 1, // Hier kannst du die Zoomstufe einstellen
                                      longitudeDelta: 1, // Hier kannst du die Zoomstufe einstellen
                                    }, 1000);
                                  }
                                } else {
                                  setSearchResult(null);
                                  setSearchLocation(null);
                                }
             }

          }
        };

          const handleResetPlaces = () => {
            setShowBottomLine(false); // Setze den Suchergebnis-Status auf null, um den Inhalt der Leiste zurückzusetzen
            setSelectedPlace(null);
          };

   const handleMarkerPress = (place) => {
     setSelectedPlace(place);
     if (mapRef) {
                                         mapRef.animateToRegion({
                                           latitude: place.coordinates.latitude,
                                           longitude: place.coordinates.longitude,
                                           latitudeDelta: 0.01, // Hier kannst du die Zoomstufe einstellen
                                           longitudeDelta: 0.01, // Hier kannst du die Zoomstufe einstellen
                                         }, 1000);
                                       }
     console.log(place);
   };

     const handleMapPress = () => {
       setSelectedPlace(null);
     };

     const scrollToTop = () => {
        setShowList(true);
     };

     const isStarred = (place) => {

     return place.favourite;

     };

     const handleStarClick = (place) => {

        place.toggleFavourite();
        console.log(place.favourite);

        setForceUpdate(prevState => !prevState);

     }

       const handlePlaceDetail = (place) => {
         setSelectedPlace(place);
         setShowPlaceDetailModal(true);
       };

 return (
    <View style={styles.container}>

<View style={[styles.searchContainer, showList && styles.disabledContainer]}>
  <TextInput
    style={[styles.searchInput, showList && styles.disabledInput]}
    placeholder="Search for city..."
    onChangeText={text => setSearchQuery(text)}
    value={searchQuery}
    editable={!showList} // Deaktiviere die Eingabe, wenn showList true ist
  />
  <Button
    title="Go!"
    onPress={handleSearch}
    disabled={showList} // Deaktiviere den Button, wenn showList true ist
  />
</View>

      {location ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          mapType={"mutedStandard"}
          showsUserLocation={true} // Zeige den Standort des Benutzers als blauen Punkt an
          region={region}
          backgroundColor="lightblue" // Hintergrundfarbe der gesamten Karte
          onRegionChangeComplete={onRegionChangeComplete}
          showsPointsOfInterest={false} // Entferne vordefinierte Orte wie Geschäfte, Restaurants, etc.
          showsTraffic={false}
          customMapStyle={customMapStyle}
          showsIndoors={false}
          showsIndoorLevelPicker={false}
          rotateEnabled={false} // Rotation der Karte deaktivieren
          showsCompass={false} // Kompass ausblenden
          onPress={handleMapPress}
          ref={(ref) => setMapRef(ref)}
        >


                {/* Markierungen für verschiedene Arten von Orten anzeigen */}
                {showMarkers && continentsData.flatMap(continent =>
                  continent.countries.flatMap(country =>
                    country.cities.flatMap(city =>
                      city.places.map(place => (

                        <Marker
                          key={`${continent.name}-${country.name}-${city.name}-${place.name}-${selectedPlace && selectedPlace.name === place.name ? 'selected' : 'unselected'}`}
                          coordinate={place.coordinates} // Die Koordinaten des Ortes werden von der Stadt übernommen
                          onPress={() => handleMarkerPress(place)} // Handler für das Anklicken des Markers
                          title={getNameForPlace(place)}
                          description={getDescriptionForPlace(place)}
                          calloutEnabled={true}
                          image={getImageForPlace(place)} // Hier das Bild für den benutzerdefinierten Marker angeben
                          style={{ width: 20, height: 20 }} // Anpassung der Größe des Markers
                        />
                      ))
                    )
                  )
                )}

        </MapView>

      ) : (
        <Text>Arvid fickt gerade deine Mum...</Text>
      )}

        <View style={styles.bottomBar}>
        <ScrollView
          ref={scrollViewRef}
          contentContainerStyle={styles.bottomBarContent}
          horizontal
          showsHorizontalScrollIndicator={false}
        >
          {/* Hier kannst du die Liste der Orte für die gesuchte Stadt anzeigen */}
          {showBottomLine && searchResult && searchResult.places.map(place => (
            <TouchableOpacity
              key={place.name}
              style={
                selectedPlace === place ?
                [styles.placeItem, styles.selectedPlaceItem] :
                styles.placeItem
              }
              onPress={() => handleMarkerPress(place)}
            >
              <Text>{place.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
          {/* Kreuz-Symbol für das Zurücksetzen der Liste */}
          {showBottomLine && searchResult && (
            <TouchableOpacity onPress={handleResetPlaces} style={styles.crossButton}>
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
          )}

          {showBottomLine && searchResult && (
          <TouchableOpacity onPress={scrollToTop}
          style={styles.arrowButton}>
                    <MaterialIcons name="keyboard-arrow-up" size={24} color="black" />
                  </TouchableOpacity>
                  )}
        </View>

      {/* Modal für die Liste von unten */}
            <Modal
              animationType="slide-up"
              transparent={true}
              visible={showList}
              onRequestClose={() => {
                setShowList(false);
              }}
            >
              <View style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  {searchResult && searchResult.places.map(place => (
                    <CustomPlaceItem
                      key={`${place.name}-${forceUpdate}`}
                      place={place}
                      handleMarkerPress={handleMarkerPress}
                      handleStarClick={handleStarClick}
                      image={getListImage(place)}
                      handlePlaceDetail={handlePlaceDetail} // Diese Prop hinzufügen
                    />
                  ))}
                  <TouchableOpacity onPress={() => setShowList(false)} style={styles.arrowDown}>
                    <MaterialIcons name="keyboard-arrow-down" size={24} color="black" />
                  </TouchableOpacity>
                </View>
              </View>
            </Modal>

                  {/* Das Modal für die Ortseinzelheiten */}
                  <PlaceDetailScreen
                    visible={showPlaceDetailModal}
                    place={selectedPlace}
                    onClose={() => setShowPlaceDetailModal(false)}
                  />

    </View>
  );
}

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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    marginTop: 30,
  },
  searchInput: {
    width: '70%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginRight: 10,
    paddingHorizontal: 10,
  },
  disabledContainer: {
      opacity: 0.5, // Verringert die Deckkraft des Containers, um ihn auszugrauen
    },
    disabledInput: {
      backgroundColor: '#f2f2f2', // Ändert die Hintergrundfarbe des Eingabefelds, um es auszugrauen
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
});