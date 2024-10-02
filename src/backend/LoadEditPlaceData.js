import { supabase } from '../services/supabase';
import { Continent, Country, City, Place } from './MapClasses'; // Passe den Pfad zu deinen Klassen an

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
  if (place === selectedPlace) {
    return require('../assets/images/travel-marker-x.png');
  }
  switch (place.type) {
    case 'Sehenswürdigkeit':
      return require('../assets/images/travel-marker-s.png');
    case 'Restaurant':
      return require('../assets/images/travel-marker-r.png');
    case 'Einkaufsladen':
      return require('../assets/images/travel-marker-m.png');
    case 'Aussichtspunkt':
      return require('../assets/images/travel-marker-v.png');
    default:
      return require('../assets/images/travel-marker-x.png');
  }
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