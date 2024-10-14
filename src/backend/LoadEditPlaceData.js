import { supabase } from '../services/supabase';
import { Continent, Country, City, Place } from './MapClasses'; // Passe den Pfad zu deinen Klassen an
import { findNearestCity } from './MapLocationChangeFunctions';

/**
* Funktionen zum Favorisieren der Orte.
*
*/
export const isFavourite = async (placeId, userId) => {
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

export const updateFavourite = async (attractionId, userId) => {
  try {
    // Überprüfen, ob ein Eintrag für die gegebene Attractions_ID und user_id existiert
    const { data, error } = await supabase
      .from('DesiredDestination')
      .select('Desired_Destination_ID')
      .eq('Attractions_ID', attractionId)
      .eq('User_ID', userId)
      .single();

    if (error && error.code !== 'PGRST116') { // PGRST116: Single row expected, multiple rows found
      throw error;
    }

    // Wenn ein Eintrag existiert, gib den bestehenden Eintrag zurück
    if (data) {
      return data;
    } else {
      // Eintrag existiert nicht, erstelle einen neuen Eintrag
      const { data: newEntry, error: insertError } = await supabase
        .from('DesiredDestination')
        .insert([{ Attractions_ID: attractionId, User_ID: userId }])
        .select()
        .single();

      if (insertError) {
        throw insertError;
      }

      return newEntry;
    }
  } catch (error) {
    console.error('Fehler beim Erstellen des Eintrags in DesiredDestination:', error.message);
    return null;
  }
};

export const deleteFavourite = async (attractionId, userId) => {
  try {
    // Lösche den Eintrag für die gegebene Attractions_ID und user_id
    const { data, error } = await supabase
      .from('DesiredDestination')
      .delete()
      .eq('Attractions_ID', attractionId)
      .eq('User_ID', userId);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error('Fehler beim Löschen des Eintrags aus DesiredDestination:', error.message);
    return null;
  }
};


/**
 * Funktion zum Rendern der Änderung des Favoritenstatus.
 */
export const handleStarClick = async (place, currentUserId, setForceUpdate) => {
  if (!place.favourite) {
    await updateFavourite(place.placeId, currentUserId);
  } else {
    await deleteFavourite(place.placeId, currentUserId);
  }
  place.toggleFavourite();
  setForceUpdate(prevState => !prevState);
};


/**
 * Funktion, die den richtigen Marker für einen Ort zurückgibt.
 */
export const getMarkerForPlace = (place, selectedPlace) => {
  const blueMarkers = [
    require('../assets/images/marker-blau-rechts.png'),
    require('../assets/images/marker-blau-links.png'),
    require('../assets/images/marker-blau-mitte.png')
  ];

  const yellowMarkers = [
    require('../assets/images/marker-gelb-rechts.png'),
    require('../assets/images/marker-gelb-links.png'),
    require('../assets/images/marker-gelb-mitte.png')
  ];

  const typeIndex = place.type ? place.type.length % blueMarkers.length : 0;

  if (place === selectedPlace) {
    return yellowMarkers[typeIndex];
  }

  // Andernfalls gib den blauen Marker zurück
  return blueMarkers[typeIndex];
};


/**
 * Funktion, die die Beschreibung eines Ortes zurückgibt.
 */
export const getDescriptionForPlace = (place, selectedPlace) => {
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

/**
 * Funktion, die das Bild eines Ortes zurückgibt.
 */
export const getListImage = (place) => {
  return place.link;
};

/**
 * Funktion, die den Namen eines Ortes zurückgibt.
 */
export const getNameForPlace = (place, selectedPlace) => {
  if (place === selectedPlace) {
    return place.name;
  } else {
    return null;
  }
};

/**
 * Funktion, die einen Ort zur DB hinzufügt.
 */
export const addPlaceToDB = async (placeData, continentsData) => {
  try {
    const cityId = findNearestCity({
      latitude: placeData.latitude,
      longitude: placeData.longitude,
      latitudeDelta: 1,
      longitudeDelta: 1,
    }, continentsData).cityId;

    const { data, error } = await supabase
      .from('Attraction')
      .insert([{
        Attraction_Name: placeData.name,
        City_ID: cityId,
        Type_of_Attraction: placeData.type,
        Description: placeData.description,
        Latitude: placeData.latitude,
        Longitude: placeData.longitude
      }]);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

/**
 * Validiert, ob alle notwendigen Daten vorhanden sind, um einen Ort zur DB hinzuzufügen.
 */
export const validatePlaceData = (placeName, placeDescription, placeType, coordinates) => {
  if (!placeName || !placeDescription || !placeType || !coordinates) {
    return { valid: false, message: 'Bitte füllen Sie alle erforderlichen Felder aus.' };
  }
  return { valid: true };
};



export const loadRatings = async (attractionId) => {
  try {
    const { data, error } = await supabase
      .from('Rating')
      .select('rating, text, created_at')
      .eq('Attraction_Id', attractionId);

    if (error) {
      console.error('Fehler beim Laden der Bewertungen:', error.message);
      return [];
    }

    return data;
  } catch (error) {
    console.error('Fehler beim Abrufen der Bewertungen:', error.message);
    return [];
  }
};

export const saveRatingToDB = async (attractionId, rating, reviewText) => {
  try {
    const { data, error } = await supabase
      .from('Rating')
      .insert([{
        Attraction_Id: attractionId,
        rating: rating,
        text: reviewText,
      }]);

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, data };
  } catch (error) {
    console.error('Fehler beim Speichern der Bewertung:', error.message);
    return { success: false, message: error.message };
  }
};

export const getAverageRating = (ratings) => {
  if (!ratings || ratings.length === 0) {
    return 0;
  }

  const totalRating = ratings.reduce((acc, rating) => acc + rating.rating, 0);
  const averageRating = totalRating / ratings.length;

  return parseFloat(averageRating.toFixed(1));
};