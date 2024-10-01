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
    const { data, error } = await supabase.from('posts').select('*').order('timestamp', { ascending: false });
    if (error) {
      throw error;
    }
    return data; // Gibt die Posts zurück
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    return []; // Rückgabe eines leeren Arrays im Fehlerfall
  }
};

export const createNewPost = async (newPostContent, user_username, imageUrl) => {
  try {
    let uploadedImageUrl = null;
    if (imageUrl) {
      const { error } = await supabase.storage.from('Storage').upload(`images/${imageUrl}`, imageUrl);
      if (error) throw error;
    }

    const { error } = await supabase.from('posts').insert([{
      content: newPostContent,
      author: user_username,
      image_url: imageUrl,
      upvotes: 0,
      downvotes: 0
    }]);

    if (error) {
      throw error;
    }
  } catch (error) {
    console.error('Error creating post:', error.message);
  }
};


export const handleFileUpload = async () => {
  try {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    
    if (!result.canceled && result.assets.length > 0) {
      const firstAsset = result.assets[0]; 
      const fileUri = firstAsset.uri; 
      const fileName = fileUri.substring(fileUri.lastIndexOf('/') + 1); 

      console.log('Fetching file from URI:', fileUri);

      // Konvertiere das Bild in Base64
      const base64Data = await FileSystem.readAsStringAsync(fileUri, { encoding: FileSystem.EncodingType.Base64 });
      const arrayBuffer = base64ToArrayBuffer(base64Data); 

      // Hochladen in Supabase-Speicher
      const { error } = await supabase.storage
        .from('Storage')
        .upload(`images/${fileName}`, arrayBuffer, {
          cacheControl: '3600',
          upsert: false, // Überschreiben von Dateien verhindern
        });

      if (error) {
        console.error('Upload Error Details:', error);
        throw error; 
      }

      // URL des hochgeladenen Bildes generieren
      const imageUrl = `${SUPABASE_URL}/storage/v1/object/public/Storage/images/${fileName}`;
      console.log('Image URL:', imageUrl);
      return imageUrl; // Gebe die Bild-URL zurück
    }
  } catch (error) {
    // Fehler abfangen und in der Konsole anzeigen
    console.error('Fehler beim Hochladen des Bildes:', error.message);
  }
};

// Hilfsfunktion: Konvertiere Base64 in ArrayBuffer
function base64ToArrayBuffer(base64) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}