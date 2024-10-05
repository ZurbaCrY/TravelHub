import { supabase } from "./supabase";

export const getProfilePictureUrlByUserId = async (user_id) => {
  try {    
    const { data, error } = await supabase
      .from('users')
      .select('profilepicture_url')
      .eq('user_id', user_id)
      .single();

    if (error) {
      console.error('Error fetching profile picture URL:', error);
      return null;
    }
    return data ? data.profilepicture_url : null; // Return the URL or null if not found
  } catch (error) {
    console.error('Unexpected error:', error);
    return null; // Error handling
  }
};
