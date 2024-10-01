import { findNearestCity } from './MapLocationChangeFunctions';

/**
 * Fetch city coordinates using Google Places API
 *
 * @param {string} placeId - Google Places ID of the city
 * @param {function} setSelectedCoordinates - Function to update the selected coordinates
 */
export const fetchCityCoordinates = async (placeId, setSelectedCoordinates) => {
  try {
    const response = await fetch(`https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=geometry&key=AIzaSyDUMJ0wbXrEYkKY4iN7noJJ7yRp-C86LFU`);
    const data = await response.json();
    const { geometry } = data.result;
    if (geometry) {
      setSelectedCoordinates(geometry.location);
    }
  } catch (error) {
    console.error('Error fetching city coordinates:', error);
  }
};

/**
 * Handle search with Google autocomplete API
 *
 * @param {object} selectedCoordinates - Selected coordinates from Google Places
 * @param {function} setSelectedPlace - Function to reset selected place
 * @param {function} scrollToStart - Function to scroll to start
 * @param {object} mapRef - Map reference to animate the region
 * @param {function} findNearestCity - Function to find the nearest city based on coordinates
 * @param {function} setSearchResult - Function to update search results
 * @param {object} continentsData - Data containing continents, countries, and cities
 */
export const handleSearchAutocompleteAPI = (selectedCoordinates, setSelectedPlace, scrollToStart, mapRef, setSearchResult, continentsData) => {
  if (selectedCoordinates) {
    setSelectedPlace(null);
    scrollToStart();
    if (mapRef) {
      mapRef.animateToRegion({
        latitude: selectedCoordinates.lat,
        longitude: selectedCoordinates.lng,
        latitudeDelta: 1,
        longitudeDelta: 1,
      }, 1000);
    }
    const nearestCity = findNearestCity({
      latitude: selectedCoordinates.lat,
      longitude: selectedCoordinates.lng,
      latitudeDelta: 1,
      longitudeDelta: 1,
    }, continentsData);
    setSearchResult(nearestCity);
  } else {
    console.log("ERROR: City not found");
  }
};

/**
 * Handle local search for a city in continentsData
 *
 * @param {string} searchQuery - The search query input by the user
 * @param {function} setSearchResult - Function to update search results
 * @param {function} setSelectedPlace - Function to reset selected place
 * @param {function} scrollToStart - Function to scroll to the start of the results
 * @param {object} mapRef - Map reference to animate the region
 * @param {function} findMiddleCoordinate - Function to find the middle coordinates of the city
 * @param {object} continentsData - Data containing continents, countries, and cities
 */
export const handleSearchLocal = (searchQuery, setSearchResult, setSelectedPlace, scrollToStart, mapRef, findMiddleCoordinate, continentsData) => {
  const result = continentsData.find(continent =>
    continent.countries.some(country =>
      country.cities.some(city =>
        city.name.toLowerCase() === searchQuery.toLowerCase()
      )
    )
  );

  if (result) {
    const matchingCountry = result.countries.find(country =>
      country.cities.some(city =>
        city.name.toLowerCase() === searchQuery.toLowerCase()
      )
    );

    if (matchingCountry) {
      const city = matchingCountry.cities.find(city =>
        city.name.toLowerCase() === searchQuery.toLowerCase()
      );
      if (city) {
        setSearchResult(city);
        setSelectedPlace(null);
        scrollToStart();
        const middleCoordinate = findMiddleCoordinate(city.coordinates);

        if (mapRef) {
          mapRef.animateToRegion({
            latitude: middleCoordinate.latitude,
            longitude: middleCoordinate.longitude,
            latitudeDelta: 1,
            longitudeDelta: 1,
          }, 1000);
        }
      } else {
        setSearchResult(null);
      }
    }
  }
};

/**
 * Searches the local data for cities or places that match the user's input.
 *
 * @param {string} query - The user's input.
 * @param {array} continentsData - The local data containing information about cities and places.
 * @returns {array} - A list of matching cities or places.
 */
export const handleSearchLocalAutocomplete = (input, continentsData) => {
  if (!input || input.length === 0) {
    return []; // Kein Input, keine Vorschläge
  }

  const lowercaseInput = input.toLowerCase(); // Das wird jetzt nur aufgerufen, wenn input gesetzt ist

  // Durchsuche die continentsData nach passenden Städten
  const results = [];
  continentsData.forEach(continent => {
    continent.countries.forEach(country => {
      country.cities.forEach(city => {
        if (city.name.toLowerCase().includes(lowercaseInput)) {
          results.push(city);
        }
      });
    });
  });

  // Rückgabe der Vorschläge
  return results;
};