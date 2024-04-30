import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text } from 'react-native';
import MapView, { Marker, PROVIDER_GOOGLE, Polygon } from 'react-native-maps';
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
    this.locked = true; // Annahme: alle Städte sind zu Beginn gesperrt
  }
}

// Daten für die Weltkarte
const continentsData = [
  new Continent('Europe', [
    new Country('Germany', [
      new City('Berlin', [
        { latitude: 52.52, longitude: 13.405 },
        { latitude: 52.52, longitude: 13.6 },
        { latitude: 52.4, longitude: 13.6 },
        { latitude: 52.4, longitude: 13.405 },
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
        >
          {/* Polygon für die Umrandung von Berlin */}
          {continentsData.map(continent =>
            continent.countries.map(country =>
              country.cities.map(city =>
                city.coordinates && (
                  <Polygon
                    key={`${continent.name}-${country.name}-${city.name}`}
                    coordinates={city.coordinates}
                    strokeColor="rgba(128, 128, 128, 1)"
                    strokeWidth={2}
                    fillColor="rgba(128, 128, 128, 0.5)"
                  />
                )
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
  },
  map: {
    flex: 1,
  },
});
