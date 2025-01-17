import { supabase } from '../services/supabase';
import { Continent, Country, City, Place } from './MapClasses';
import { isFavourite } from './LoadEditPlaceData';
import { findNearestCity, findCountry } from './MapLocationChangeFunctions';

/**
* Funktionen zum Verifizieren der besuchten Länder.
*
*/
export const updateOrCreateVisitedCountry = async (countryId, userId) => {
  try {
    const { data, error } = await supabase
      .from('Visited Countries')
      .select('VisitedCountries_ID, verified')
      .eq('Country_ID', countryId)
      .eq('user_id', userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    if (data) {
      if (data.verified) {
        return data;
      }

      const { data: updatedEntry, error: updateError } = await supabase
        .from('Visited Countries')
        .update({ verified: true })
        .eq('VisitedCountries_ID', data.VisitedCountries_ID)
        .select();

      if (updateError) {
        throw updateError;
      }

      return updatedEntry;
    } else {
      const { data: newEntry, error: insertError } = await supabase
        .from('Visited Countries')
        .insert([{ Country_ID: countryId, user_id: userId, verified: true }])
        .select();

      if (insertError) {
        throw insertError;
      }

      return newEntry;
    }
  } catch (error) {
    console.error('Fehler beim Aktualisieren oder Erstellen des Eintrags:', error.message);
    return null;
  }
};

export const updateVisitedCountry = (location, continentsData, userId) => {
  let country = findCountry(findNearestCity({
    latitude: location.coords.latitude,
    longitude: location.coords.longitude,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }, continentsData), continentsData);

  updateOrCreateVisitedCountry(country.countryId, userId);
};


/**
* Funktionen zum Fetchen aller existierender Länder, Städte, Orte aus der Datenbank.
*
*/
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
