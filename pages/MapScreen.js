import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button, ScrollView, TouchableOpacity } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polygon, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { customMapStyle } from '../resources/customMapStyle';
import { MaterialIcons } from '@expo/vector-icons'; // Beispiel für ein Icon-Paket, hier MaterialIcons von Expo

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
                                    // Weitere Orte hinzufügen
                                  ]),
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
    })();
  }, []);

  const getImageForPlace = (placeType) => {
    switch (placeType) {
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
    } else {
      setShowMarkers(false);
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
            setSearchResult(null); // Setze den Suchergebnis-Status auf null, um den Inhalt der Leiste zurückzusetzen
          };

 return (
    <View style={styles.container}>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search for city..."
          onChangeText={text => setSearchQuery(text)}
          value={searchQuery}
        />
        <Button
          title="Go!"
          onPress={handleSearch}
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
          rotateEnabled={false} // Rotation der Karte deaktivieren
          showsCompass={false} // Kompass ausblenden
          ref={(ref) => setMapRef(ref)}
        >


                {/* Markierungen für verschiedene Arten von Orten anzeigen */}
                {showMarkers && continentsData.flatMap(continent =>
                  continent.countries.flatMap(country =>
                    country.cities.flatMap(city =>
                      city.places.map(place => (

                        <Marker
                          key={`${continent.name}-${country.name}-${city.name}-${place.name}`}
                          coordinate={place.coordinates} // Die Koordinaten des Ortes werden von der Stadt übernommen
                          title={place.name}
                          description={place.type === 'Sehenswürdigkeit' ? `Eintritt: ${(place instanceof SightseeingSpot) ? place.entranceFee : 'N/A'}` : `Preisniveau: ${(place instanceof Restaurant) ? place.priceLevel : 'N/A'}, Küche: ${(place instanceof Restaurant) ? place.cuisineType : 'N/A'}`}
                          image={getImageForPlace(place.type)} // Hier das Bild für den benutzerdefinierten Marker angeben
                          style={{ width: 20, height: 20 }} // Anpassung der Größe des Markers
                        />
                      ))
                    )
                  )
                )}

        </MapView>

      ) : (
        <Text>Loading...</Text>
      )}

        <View style={styles.bottomBar}>
          <ScrollView
            contentContainerStyle={styles.bottomBarContent}
            horizontal
            showsHorizontalScrollIndicator={false}
          >
            {/* Hier kannst du die Liste der Orte für die gesuchte Stadt anzeigen */}
            {searchResult && searchResult.places.map(place => (
              <View key={place.name} style={styles.placeItem}>
                <Text>{place.name}</Text>
              </View>
            ))}
          </ScrollView>
          {/* Kreuz-Symbol für das Zurücksetzen der Liste */}
          {searchResult && (
            <TouchableOpacity onPress={handleResetPlaces} style={styles.crossButton}>
              <MaterialIcons name="close" size={24} color="black" />
            </TouchableOpacity>
          )}
        </View>

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
    marginTop: 10,
  },
  searchInput: {
    width: '70%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginRight: 10,
    paddingHorizontal: 10,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingVertical: 15,
  },
  bottomBarContent: {
    paddingHorizontal: 20,
  },
  placeItem: {
    marginRight: 10,
    padding: 5,
    borderRadius: 5,
    backgroundColor: '#eee',
  },
    crossButton: {
      position: 'absolute',
      bottom: 16,
      right: 16,
    },
});