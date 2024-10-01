import { SUPABASE_URL } from '@env';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../services/supabase';

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
      .select('id, content, author, image_url, upvotes, downvotes, timestamp')  
      .order('timestamp', { ascending: false });  
    
    if (error) {
      throw error;  
    }

    return data;  
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    return [];  
  }
};


export const createNewPost = async (newPostContent, user_username, imageUrl) => {
  try {
    let uploadedImageUrl = null;

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
      downvotes: 0
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