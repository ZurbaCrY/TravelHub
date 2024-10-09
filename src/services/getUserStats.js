import { supabase } from "../services/supabase";

const fetchFriendCount = async (user_id) => {
  try {
    const { data, error } = await supabase
      .from("friends")
      .select("friend_id", { count: 'exact' })
      .eq("user_id", user_id);

    if (error) {
      throw new Error("Error fetching friend count: " + error.message);
    }

    return data ? data.length : 0;
  } catch (error) {
    console.error("Error fetching Friend Count:", error);
    throw error;
  }
}

const fetchPostCount = async (user_id) => {
  try {
    const { data, error } = await supabase
      .from("posts")
      .select("id", { count: 'exact' })
      .eq("user_id", user_id);

    if (error) {
      throw new Error("Error fetching post count: " + error.message);
    }

    return data ? data.length : 0;
  } catch (error) {
    console.error("Error fetching post Count:", error);
    throw error;
  }
}

const fetchVoteCount = async (user_id) => {
  try {
    const { data: posts, error: postError } = await supabase
      .from("posts")
      .select("id")
      .eq("user_id", user_id);

    if (postError) {
      throw new Error("Error fetching posts: " + postError.message);
    }

    const postIds = posts.map(post => post.id); // Extract post_ids

    if (postIds.length === 0) return [0, 0]; // No posts, return counts as [0, 0]

    // Fetch the vote counts for the post_ids
    const { data: votes, error: voteError } = await supabase
      .from("post_votes")
      .select("vote_type", { count: 'exact' })
      .in('post_id', postIds);

    if (voteError) {
      throw new Error("Error fetching Vote Counts: " + voteError.message);
    }

    const upvoteCount = votes.filter(vote => vote.vote_type === 1).length;
    const downvoteCount = votes.filter(vote => vote.vote_type === -1).length;

    return [upvoteCount, downvoteCount];
  } catch (error) {
    console.error("Error fetching Vote Counts:", error);
    return [0, 0]; // Return zero counts on error
  }
}

const getUserStats = async (user_id, getFriendCount = true, getVoteCount = true, getPostCount = true) => {
  try {
    let friendCount = 0;
    let voteCount = [0, 0];
    let postCount = 0;

    if (getFriendCount) {
      friendCount = await fetchFriendCount(user_id);
    }
    if (getVoteCount) {
      voteCount = await fetchVoteCount(user_id);
    }
    if (getPostCount) {
      postCount = await fetchPostCount(user_id);
    }

    // Create a stats object
    const stats = {
      user_id: user_id,
      upvoteCount: voteCount[0],
      downvoteCount: voteCount[1],
      friendCount: friendCount,
      postCount: postCount,
    };

    return stats;
  } catch (error) {
    console.error("Error getting user stats: ", error);
    throw error; // Re-throw the error to handle it where you call this method
  }
}

export {
  getUserStats,
  fetchFriendCount,
  fetchVoteCount
}
