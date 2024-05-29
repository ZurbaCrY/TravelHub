// __tests__/mapAndSearchFunctions.test.js
import { findNearestCity, findCountry, haversineDistance, handleSearch, handleMarkerPress } from '../screens/MapScreen';

describe('Map and Search Functions', () => {
  test('haversineDistance should calculate correct distance', () => {
    const distance = haversineDistance(50, 0, 51, 0);
    expect(distance).toBeCloseTo(111.19, 2);
  });

  test('findNearestCity should return the nearest city', () => {
    const mockContinentsData = [
      {
        countries: [
          {
            cities: [
              { City_ID: 1, Cityname: 'City1', coordinates: [{ latitude: 50, longitude: 0 }] },
              { City_ID: 2, Cityname: 'City2', coordinates: [{ latitude: 51, longitude: 0 }] },
            ],
          },
        ],
      },
    ];

    const region = { latitude: 50.5, longitude: 0, latitudeDelta: 1, longitudeDelta: 1 };
    const nearestCity = findNearestCity(region, mockContinentsData);
    expect(nearestCity.Cityname).toBe('City1');
  });

  test('findCountry should return the correct country for a city', () => {
    const mockContinentsData = [
      {
        countries: [
          {
            Countryname: 'Country1',
            cities: [
              { City_ID: 1, Cityname: 'City1', coordinates: [{ latitude: 50, longitude: 0 }] },
            ],
          },
        ],
      },
    ];

    const city = { Cityname: 'City1' };
    const country = findCountry(city, mockContinentsData);
    expect(country.Countryname).toBe('Country1');
  });

  // Additional tests for handleSearch and handleMarkerPress can be written here
});