import { supabase } from '../services/supabase';

const fetchVisitedCountries = async (user_id) => {
  try {
    const { data, error } = await supabase
      .from('Visited Countries')
      .select(`Country_ID, verified, Country (Countryname)`)
      .eq('user_id', user_id);

    if (error) throw error;

    return data.map(item => ({
      name: item.Country.Countryname,
      verified: item.verified
    }));
  } catch (error) {
    console.error('Error fetching visited countries:', error);
    throw error;
  }
}

const fetchWishListCountries = async (user_id) => {
  try {
    const { data, error } = await supabase
      .from('DesiredDestinationProfile')
      .select('country')
      .eq('user_id', user_id)
      .single();

    if (error && error.code !== 'PGRST116') throw error;

    return data ? data.country : [];
  } catch (error) {
    console.error('Error fetching wishlist countries:', error);
    throw error;
  }
}

const validateCountry = async (countryName) => {
  try {
    const { data, error } = await supabase
      .from('Country')
      .select('Country_ID')
      .ilike('Countryname', countryName);

    if (error || !data || data.length === 0) {
      throw error || new Error('Country not found');
    }

    return data[0].Country_ID;
  } catch (error) {
    console.error('Error validating country:', error);
    throw error;
  }
};

const addVisitedCountry = async (userId, countryId) => {
  try {
    const { error } = await supabase
      .from('Visited Countries')
      .insert({
        user_id: userId,
        Country_ID: countryId,
        verified: false
      });

    if (error) throw error;
  } catch (error) {
    console.error('Error adding visited country:', error);
    throw error;
  }
};

const removeVisitedCountry = async (userId, countryId) => {
  try {
    const { error } = await supabase
      .from('Visited Countries')
      .delete()
      .eq('user_id', userId)
      .eq('Country_ID', countryId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting visited country:', error);
    throw error;
  }
};

const addWishListCountry = async (userId, updatedWishList) => {
  try {
    const { error } = await supabase
      .from('DesiredDestinationProfile')
      .upsert({ user_id: userId, country: updatedWishList }, { onConflict: ['user_id'] });

    if (error) throw error;
  } catch (error) {
    console.error('Error updating wishlist countries:', error);
    throw error;
  }
};

const removeWishListCountry = async (userId) => {
  try {
    const { error } = await supabase
      .from('DesiredDestinationProfile')
      .delete()
      .eq('user_id', userId);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting wishlist countries:', error);
    throw error;
  }
};

export const handleAnonymousModeToggle = async (enabled, user_id) => {
  if (!user_id) return;

  try {
    const { error } = await supabase
      .from('users')
      .update({ anonymous: enabled })  // Update the anonymous field in Supabase
      .eq('user_id', user_id);  // Match the user by their id

    if (error) {
      console.error('Error updating anonymous mode:', error.message);
    } else {
      console.log('Anonymous mode updated successfully.');
    }
  } catch (error) {
    console.error('Unexpected error:', error.message);
  }
};


export {
  fetchVisitedCountries,
  fetchWishListCountries,
  validateCountry,
  addVisitedCountry,
  removeVisitedCountry,
  addWishListCountry,
  removeWishListCountry,
};
