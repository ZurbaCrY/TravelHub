import { SUPABASE_URL } from '@env';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../services/supabase';
import AuthService from '../services/auth'

export const handleUpvote = async (postId, fetchPosts) => {
  try {
    const { data: postData, error } = await supabase.from('posts').select('upvotes').eq('id', postId).single();
    if (error) throw error;

    const updatedUpvotes = postData.upvotes + 1;
    const { error: updateError } = await supabase.from('posts').update({ upvotes: updatedUpvotes }).eq('id', postId);
    if (updateError) throw updateError;

    fetchPosts();
  } catch (error) {
    console.error('Error upvoting post:', error.message);
  }
};

export const handleDownvote = async (postId, fetchPosts) => {
  try {
    const { data: postData, error } = await supabase.from('posts').select('downvotes').eq('id', postId).single();
    if (error) throw error;

    const updatedDownvotes = (postData.downvotes || 0) + 1;
    const { error: updateError } = await supabase.from('posts').update({ downvotes: updatedDownvotes }).eq('id', postId);
    if (updateError) throw updateError;

    fetchPosts();
  } catch (error) {
    console.error('Error downvoting post:', error.message);
  }
};

export const fetchPosts = async () => {
  try {
    const { data, error } = await supabase
      .from('posts')
      .select(`
        id, 
        content, 
        user_id, 
        image_url, 
        upvotes, 
        downvotes, 
        timestamp, 
        users (
          username, 
          profilepicture_url
        )
      `)
      .order('timestamp', { ascending: false });

    if (error) {
      throw error;
    }
    console.log(data);
    return data;
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    return [];
  }
};



export const createNewPost = async (newPostContent, user_username, imageUrl) => {
  try {
    let uploadedImageUrl = null;
    const CURRENT_USER = AuthService.getUser();
    const CURRENT_USER_ID = CURRENT_USER.id;

    if (imageUrl) {
      // Lade das Bild hoch
      const fileUri = imageUrl;
      const fileName = fileUri.substring(fileUri.lastIndexOf('/') + 1);

      // Lese die Datei als Base64
      const base64Data = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Erstelle ein ArrayBuffer aus den Base64-Daten
      const arrayBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

      // Hochladen des Bildes
      const { error: uploadError } = await supabase.storage
        .from('Images')
        .upload(`images/${fileName}`, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: true, // Überschreiben erlaubt
        });

      if (uploadError) {
        throw new Error('Error uploading image: ' + uploadError.message);
      }

      // Öffentliche URL
      uploadedImageUrl = `${SUPABASE_URL}/storage/v1/object/public/Images/images/${fileName}`;
    }

    // Erstelle den Post nach dem Hochladen des Bildes
    const { error: postError } = await supabase.from('posts').insert([{
      content: newPostContent,
      author: user_username,
      image_url: uploadedImageUrl,
      upvotes: 0,
      downvotes: 0,
      user_id: CURRENT_USER_ID
    }]);

    if (postError) {
      throw new Error('Error creating post: ' + postError.message);
    }
  } catch (error) {
    console.error('Error creating post:', error.message);
  }
};

export const handleFilePicker = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled && result.assets.length > 0) {
      const firstAsset = result.assets[0];
      const imageUrl = firstAsset.uri;
      return imageUrl; // Gebe die Bild-URL zurück
    }
  } catch (error) {
    console.error('Error picking file:', error.message);
  }
};

export const handleNewProfilePicture = async (imageUrl) => {
  try {
    let uploadedImageUrl = null;
    const CURRENT_USER = AuthService.getUser();
    const CURRENT_USER_ID = CURRENT_USER.id;

    if (imageUrl) {
      // Lade das Bild hoch
      const fileUri = imageUrl;
      const fileName = fileUri.substring(fileUri.lastIndexOf('/') + 1);

      // Lese die Datei als Base64
      const base64Data = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });

      // Erstelle ein ArrayBuffer aus den Base64-Daten
      const arrayBuffer = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

      // Hochladen des Bildes
      const { error: uploadError } = await supabase.storage
        .from('Images')
        .upload(`profilepictures/${fileName}`, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: true, // Überschreiben erlaubt
        });

      if (uploadError) {
        throw new Error('Error uploading image: ' + uploadError.message);
      }

      // Öffentliche URL
      uploadedImageUrl = `${SUPABASE_URL}/storage/v1/object/public/Images/profilepictures/${fileName}`;
    }

    const { error: updateError } = await supabase
      .from('users')
      .update({ profilepicture_url: uploadedImageUrl })
      .eq('user_id', CURRENT_USER_ID); // 'userId' ist die ID des Benutzers, dessen Bild aktualisiert werden soll

    if (updateError) {
      console.error('Error updating image_url:', updateError);
      // Hier kannst du weitere Fehlerbehandlungen durchführen
    } else {
      console.log('Image URL updated successfully.');
    }

  } catch (error) {
    console.error('Error handling profile picture update:', error.message);
  }
};

export const getProfilePictureUrlByUserId = async () => {
  try {
    const CURRENT_USER = AuthService.getUser();
    const CURRENT_USER_ID = CURRENT_USER.id;
    
    const { data, error } = await supabase
      .from('users')
      .select('profilepicture_url')
      .eq('user_id', CURRENT_USER_ID)
      .single();

    if (error) {
      console.error('Error fetching profile picture URL:', error);
      return null;
    }
    
    console.log(data.profilepicture_url);
    return data ? data.profilepicture_url : null; // Return the URL or null if not found
  } catch (error) {
    console.error('Unexpected error:', error);
    return null; // Error handling
  }
};
