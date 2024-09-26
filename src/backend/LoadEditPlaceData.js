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