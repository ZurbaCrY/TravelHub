import { supabase } from '../../services/supabase';
import AuthService from '../../services/auth';

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