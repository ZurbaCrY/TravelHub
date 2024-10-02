import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import { supabase } from '../services/supabase';
import AuthService from '../services/auth'
import { SUPABASE_URL } from '@env';


// Funktion, um Usernames für Upvotes zu erhalten
export const getUpvoters = async (postId) => {
  try {
    const { data, error } = await supabase
      .from('post_votes') // Die Tabelle, die die Votes speichert
      .select(`
        user_id,
        users (
          username,
          profilepicture_url
        )
      `) // Korrekte Klammer- und Formatierung
      .eq('post_id', postId)
      .eq('vote_type', 1); // Nur Upvotes auswählen (vote_type == 1)

    if (error) throw error;
    
    // Gib Usernames und Profilepic URLs zurück
    return data.map(vote => ({
      username: vote.users.username,
      profilepicture_url: vote.users.profilepicture_url,
    }));
  } catch (error) {
    console.error('Error fetching upvoters:', error.message);
  }
};

// Funktion, um Usernames für Downvotes zu erhalten
export const getDownvoters = async (postId) => {
  try {
    const { data, error } = await supabase
      .from('post_votes') // Die Tabelle, die die Votes speichert
      .select(`
        user_id,
        users (
          username,
          profilepicture_url
        )
      `) // Korrekte Klammer- und Formatierung
      .eq('post_id', postId)
      .eq('vote_type', -1); // Nur Downvotes auswählen (vote_type == -1)

    if (error) throw error;

    // Gib Usernames und Profilepic URLs zurück
    return data.map(vote => ({
      username: vote.users.username,
      profilepicture_url: vote.users.profilepicture_url,
    }));
  } catch (error) {
    console.error('Error fetching downvoters:', error.message);
  }
};


export const handleUpvote = async (postId, userId, fetchPosts) => {
  try {
    // Überprüfe, ob der Benutzer bereits für diesen Beitrag abgestimmt hat
    const { data: existingVote, error: voteError } = await supabase
      .from('post_votes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (voteError && voteError.code !== 'PGRST116') {
      console.error('Error checking user vote:', voteError.message);
      return;
    }

    // Wenn der Benutzer bereits downgevotet hat, entferne die Downvote und erhöhe die Upvote-Zahl
    if (existingVote && existingVote.vote_type === -1) {
      console.log("User has downvoted. Removing downvote and upvoting.");
      await supabase
        .from('post_votes')
        .delete()
        .eq('id', existingVote.id);

      // Verringere die Downvotes im Post
      const { data: postData, error: fetchError } = await supabase
        .from('posts')
        .select('downvotes')
        .eq('id', postId)
        .single();

      if (fetchError) {
        console.error('Error fetching post for downvote decrement:', fetchError.message);
        return;
      }

      const updatedDownvotes = postData.downvotes - 1;

      await supabase
        .from('posts')
        .update({ downvotes: updatedDownvotes })
        .eq('id', postId);
    }

    // Wenn der Benutzer bereits upgevotet hat, entferne die Upvote
    if (existingVote && existingVote.vote_type === 1) {
      console.log("User has already upvoted. Removing upvote.");
      await supabase
        .from('post_votes')
        .delete()
        .eq('id', existingVote.id);

      // Verringere die Upvotes im Post
      const { data: postData, error: fetchError } = await supabase
        .from('posts')
        .select('upvotes')
        .eq('id', postId)
        .single();

      if (fetchError) {
        console.error('Error fetching post for upvote decrement:', fetchError.message);
        return;
      }

      const updatedUpvotes = postData.upvotes - 1;

      await supabase
        .from('posts')
        .update({ upvotes: updatedUpvotes })
        .eq('id', postId);
      return; // Keine weitere Verarbeitung, da der Benutzer seine Stimme entfernt hat
    }

    // Füge die Upvote hinzu
    await supabase.from('post_votes').insert({
      user_id: userId,
      post_id: postId,
      vote_type: 1
    });

    // Update die Upvote-Zahl im Beitrag
    const { data: postDataAfterUpvote, error: fetchErrorAfterUpvote } = await supabase
      .from('posts')
      .select('upvotes')
      .eq('id', postId)
      .single();

    if (fetchErrorAfterUpvote) {
      console.error('Error fetching post for upvote:', fetchErrorAfterUpvote.message);
      return;
    }

    const updatedUpvotes = postDataAfterUpvote.upvotes + 1;

    await supabase
      .from('posts')
      .update({ upvotes: updatedUpvotes })
      .eq('id', postId);

    fetchPosts(); // Aktualisiere die Beiträge
  } catch (error) {
    console.error('Error upvoting post:', error.message);
  }
};

export const handleDownvote = async (postId, userId, fetchPosts) => {
  try {
    // Überprüfe, ob der Benutzer bereits für diesen Beitrag abgestimmt hat
    const { data: existingVote, error: voteError } = await supabase
      .from('post_votes')
      .select('*')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (voteError && voteError.code !== 'PGRST116') {
      console.error('Error checking user vote:', voteError.message);
      return;
    }

    // Wenn der Benutzer bereits upgevotet hat, entferne die Upvote und erhöhe die Downvote-Zahl
    if (existingVote && existingVote.vote_type === 1) {
      console.log("User has upvoted. Removing upvote and downvoting.");
      await supabase
        .from('post_votes')
        .delete()
        .eq('id', existingVote.id);

      // Verringere die Upvotes im Post
      const { data: postData, error: fetchError } = await supabase
        .from('posts')
        .select('upvotes')
        .eq('id', postId)
        .single();

      if (fetchError) {
        console.error('Error fetching post for upvote decrement:', fetchError.message);
        return;
      }

      const updatedUpvotes = postData.upvotes - 1;

      await supabase
        .from('posts')
        .update({ upvotes: updatedUpvotes })
        .eq('id', postId);
    }

    // Wenn der Benutzer bereits downgevotet hat, entferne die Downvote
    if (existingVote && existingVote.vote_type === -1) {
      console.log("User has already downvoted. Removing downvote.");
      await supabase
        .from('post_votes')
        .delete()
        .eq('id', existingVote.id);

      // Verringere die Downvotes im Post
      const { data: postData, error: fetchError } = await supabase
        .from('posts')
        .select('downvotes')
        .eq('id', postId)
        .single();

      if (fetchError) {
        console.error('Error fetching post for downvote decrement:', fetchError.message);
        return;
      }

      const updatedDownvotes = postData.downvotes - 1;

      await supabase
        .from('posts')
        .update({ downvotes: updatedDownvotes })
        .eq('id', postId);
      return; // Keine weitere Verarbeitung, da der Benutzer seine Stimme entfernt hat
    }

    // Füge die Downvote hinzu
    await supabase.from('post_votes').insert({
      user_id: userId,
      post_id: postId,
      vote_type: -1
    });

    // Update die Downvote-Zahl im Beitrag
    const { data: postDataAfterDownvote, error: fetchErrorAfterDownvote } = await supabase
      .from('posts')
      .select('downvotes')
      .eq('id', postId)
      .single();

    if (fetchErrorAfterDownvote) {
      console.error('Error fetching post for downvote:', fetchErrorAfterDownvote.message);
      return;
    }

    const updatedDownvotes = postDataAfterDownvote.downvotes + 1;

    await supabase
      .from('posts')
      .update({ downvotes: updatedDownvotes })
      .eq('id', postId);

    fetchPosts(); // Aktualisiere die Beiträge
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
    return data ? data.profilepicture_url : null; // Return the URL or null if not found
  } catch (error) {
    console.error('Unexpected error:', error);
    return null; // Error handling
  }
};
