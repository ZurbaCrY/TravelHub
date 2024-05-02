import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Polygon } from 'react-native-maps';
import * as Location from 'expo-location';

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
  constructor(name, coordinates) {
    this.name = name;
    this.coordinates = coordinates;
    this.priceLevel = 1; // z.B. preisliche Einordnung der Stadt
    this.locked = true; // Annahme: alle Städte sind zu Beginn entsperrt
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

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  return (
    <View style={styles.container}>
      {location ? (
        <MapView
          provider={PROVIDER_GOOGLE}
          style={styles.map}
          showsUserLocation={true} // Zeige den Standort des Benutzers als blauen Punkt an
          initialRegion={{
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            latitudeDelta: 0.0922,
            longitudeDelta: 0.0421,
          }}
          backgroundColor="lightblue" // Hintergrundfarbe der gesamten Karte
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
                    fillColor="lightblue" // Hintergrundfarbe der Karte
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
                  fillColor="black" // Hintergrundfarbe der Karte
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
              fillColor="red" // Hintergrundfarbe der Karte
            />
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
  },
  map: {
    flex: 1,
  },
});
