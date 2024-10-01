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
      .select('id, content, author, image_url, upvotes, downvotes, timestamp')  // image_url hinzugefügt
      .order('timestamp', { ascending: false });  // Sortierung nach timestamp
    
    if (error) {
      throw error;  // Fehler werfen, falls beim Abrufen etwas schiefgeht
    }

    return data;  // Gibt die Posts (inkl. image_url) zurück
  } catch (error) {
    console.error('Error fetching posts:', error.message);
    return [];  // Gibt ein leeres Array zurück, falls ein Fehler auftritt
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
          contentType: 'image/jpeg', // Stelle sicher, dass der richtige Inhaltstyp verwendet wird
          upsert: true, // Erlaube das Überschreiben
        });

      if (uploadError) {
        throw new Error('Error uploading image: ' + uploadError.message);
      }

      // Generiere die öffentliche URL des hochgeladenen Bildes
      uploadedImageUrl = `${SUPABASE_URL}/storage/v1/object/public/Images/images/${fileName}`;
    }

    // Erstelle den Post nach dem Hochladen des Bildes
    const { error: postError } = await supabase.from('posts').insert([{
      content: newPostContent,
      author: user_username,
      image_url: uploadedImageUrl,  // Verwende die hochgeladene Bild-URL
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
    // Öffne den Bildauswähler
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