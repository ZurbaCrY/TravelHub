import { supabase } from '../services/supabase';
import { Continent, Country, City, Place } from './MapClasses'; // Passe den Pfad zu deinen Klassen an

//Abfrage auf Supabase um aktuellen Favoriten Status zu setzen
const isFavourite = async (placeId, userId) => {
  try {
    // Überprüfe, ob ein Eintrag für die gegebene Attractions_ID und user_id existiert
    const { data, error } = await supabase
      .from('DesiredDestination')
      .select('Attractions_ID')
      .eq('Attractions_ID', placeId)
      .eq('User_ID', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116: Single row expected, multiple rows found
      throw error;
    }

    // Wenn ein Eintrag existiert, gib true zurück, ansonsten false
    //console.log(!!data);
    return !!data;
  } catch (error) {
    console.error('Fehler beim Überprüfen des Favoritenstatus:', error.message);
    return false;
  }
};

// Daten aus der Supabase abrufen
export const fetchCountries = async () => {
  const { data, error } = await supabase.from('Country').select('*');
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const fetchCities = async () => {
  const { data, error } = await supabase.from('City').select('*');
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

export const fetchPlaces = async () => {
  const { data, error } = await supabase.from('Attraction').select('*');
  if (error) {
    throw new Error(error.message);
  }
  return data;
};

// Abrufen und Zusammenfügen der Daten für Kontinente, Länder, Städte und Orte
export const fetchData = async (setContinentsData, CURRENT_USER_ID) => {
  try {
    const countries = await fetchCountries();
    const cities = await fetchCities();
    const attractions = await fetchPlaces();

    const continentsData = await Promise.all([
      new Continent('World', await Promise.all(countries.map(async (country) => {
        const countryCities = await Promise.all(cities
          .filter(city => city.Country_ID === country.Country_ID)
          .map(async (city) => {
            const cityAttractions = await Promise.all(attractions
              .filter(attraction => attraction.City_ID === city.City_ID)
              .map(async (attraction) => {
                const favourite = await isFavourite(attraction.Attraction_ID, CURRENT_USER_ID);
                return new Place(
                  attraction.Attraction_ID,
                  attraction.Attraction_Name,
                  { latitude: parseFloat(attraction.Latitude), longitude: parseFloat(attraction.Longitude) },
                  attraction.Type_of_Attraction,
                  attraction.Description,
                  attraction.Link,
                  favourite
                );
              })
            );

            const cityCoordinates = [
              { latitude: parseFloat(city.latitude), longitude: parseFloat(city.longitude) }
            ];

            return new City(city.City_ID, city.Cityname, cityCoordinates, cityAttractions);
          })
        );

        return new Country(country.Country_ID, country.Countryname, countryCities);
      })))
    ]);

    setContinentsData(continentsData);
  } catch (error) {
    console.error('Error fetching data:', error.message);
  }
};
