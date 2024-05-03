import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, Button } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polygon, Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import { customMapStyle } from './resources/customMapStyle';

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
      new City('DeutschStadt', [
                           { latitude: 55.028022, longitude: 8.085938 },
                           { latitude: 54.265224, longitude: 8.085938 },
                           { latitude: 53.904338, longitude: 7.602539 },
                           { latitude: 53.67068, longitude: 6.28418 },
                           { latitude: 52.988337, longitude: 7.163086 },
                           { latitude: 52.562995, longitude: 6.943359 },
                           { latitude: 51.862924, longitude: 6.899414 },
                           { latitude: 51.835778, longitude: 6.152344 },
                           { latitude: 51.069017, longitude: 5.932617 },
                           { latitude: 50.34546, longitude: 6.108398 },
                           { latitude: 49.353756, longitude: 6.503906 },
                           { latitude: 48.835797, longitude: 7.954102 },
                           { latitude: 47.487513, longitude: 7.602539 },
                           { latitude: 47.546872, longitude: 9.316406 },
                           { latitude: 47.15984, longitude: 10.239258 },
                           { latitude: 47.576526, longitude: 12.392578 },
                           { latitude: 48.57479, longitude: 14.282227 },
                           { latitude: 50.092393, longitude: 12.348633 },
                           { latitude: 50.847573, longitude: 14.985352 },
                           { latitude: 52.402419, longitude: 14.72168 },
                           { latitude: 52.829321, longitude: 14.282227 },
                           { latitude: 54.162434, longitude: 14.458008 },
                           { latitude: 54.749991, longitude: 13.623047 },
                           { latitude: 54.54658, longitude: 12.436523 },
                           { latitude: 54.290882, longitude: 12.172852 },
                           { latitude: 54.41893, longitude: 11.030273 },
                           { latitude: 54.800685, longitude: 10.019531 },
                           { latitude: 54.952386, longitude: 8.173828 },
                           { latitude: 55.028022, longitude: 8.085938 }, // Zurück zum Anfang, um das Polygon zu schließen
                         ], [
                                    new SightseeingSpot('Brandenburger Tor', { latitude: 52.516275, longitude: 13.377704 }, 0), // Brandenburger Tor hat keine Eintrittsgebühr
                                    new Restaurant('Mustermanns Restaurant', { latitude: 52.5233, longitude: 13.4127 }, 3, 'Deutsch'), // Mustermanns Restaurant ist mittelpreisig und serviert deutsche Küche
                                    // Weitere Orte hinzufügen
                                  ]),
      // weitere Städte hinzufügen...
    ]),
    // weitere Länder hinzufügen...
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
        return require('./resources/travel-marker-s.png');
      case 'Restaurant':
        return require('./resources/travel-marker-r.png');
      case 'Einkaufsladen':
        return require('./resources/travel-marker-m.png');
      case 'Aussichtspunkt':
        return require('./resources/travel-marker-v.png');
      default:
        return require('./resources/travel-marker-x.png');
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
  };

    const handleSearch = async () => {
      const result = continentsData.find(continent =>
        continent.countries.some(country =>
          country.cities.some(city =>
            city.name.toLowerCase() === searchQuery.toLowerCase()
          )
        )
      );

      if (result) {
        // Durch die Länder des Ergebnisses iterieren
        const city = result.countries.flatMap(country =>
          country.cities.find(city =>
            city.name.toLowerCase() === searchQuery.toLowerCase()
          )
        )[0]; // Zugriff auf das erste Element des Arrays

        console.log(city.name);

        if (city) {
          setSearchResult(city);
          const middleCoordinate = findMiddleCoordinate(city.coordinates);

          // Animiere die Karte zur Mitte der gesuchten Stadt über einen Zeitraum von 1000 Millisekunden (1 Sekunde)
          if (mapRef) {
            mapRef.animateToRegion({
              latitude: middleCoordinate.latitude,
              longitude: middleCoordinate.longitude,
              latitudeDelta: 3, // Hier kannst du die Zoomstufe einstellen
              longitudeDelta: 3, // Hier kannst du die Zoomstufe einstellen
            }, 1000);
          }
        } else {
          setSearchResult(null);
          setSearchLocation(null);
        }
      }
    };


 return (
    <View style={styles.container}>

      <View style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Stadt suchen..."
          onChangeText={text => setSearchQuery(text)}
          value={searchQuery}
        />
        <Button
          title="Suchen"
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


          {/* Polygone über gesperrte Städte*/}
          {continentsData.flatMap(continent =>
            continent.countries.flatMap(country =>
              country.cities.map(city =>
                city.locked && (
                  <Polygon
                    key={`${continent.name}-${country.name}-${city.name}`}
                    coordinates={city.coordinates}
                    strokeColor="black"
                    fillColor="rgba(212, 210, 200, 0.5)" // Hintergrundfarbe der Karte
                  />
                )
              )
            )
          )}

          {/* Polygone über gesperrten Ländern */}
          {continentsData.flatMap(continent =>
            continent.countries.map(country =>
              country.locked && (
                <Polygon
                  key={`${continent.name}-${country.name}`}
                  coordinates={country.cities.flatMap(city => city.coordinates)}
                  strokeColor="black"
                  fillColor="rgba(212, 210, 200, 0.5)" // Hintergrundfarbe der Karte
                />
              )
            )
          )}

        {/* Polygone über gesperrten Kontinenten */}
        {continentsData.map(continent =>
          continent.locked && (
            <Polygon
              key={`${continent.name}`}
              coordinates={continent.countries.flatMap(country => country.cities.flatMap(city => city.coordinates))}
              strokeColor="black"
              fillColor="rgba(212, 210, 200, 0.5)" // Hintergrundfarbe der Karte
            />
          )
        )}

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
                          opacity={0.65}
                        />
                      ))
                    )
                  )
                )}

        </MapView>
      ) : (
        <Text>Loading...</Text>
      )}
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
  },
  searchInput: {
    width: '70%',
    height: 40,
    borderWidth: 1,
    borderColor: 'gray',
    marginRight: 10,
    paddingHorizontal: 10,
  },
});
