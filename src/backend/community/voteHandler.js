import { supabase } from '../../services/supabase';

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
