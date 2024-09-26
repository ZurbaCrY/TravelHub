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