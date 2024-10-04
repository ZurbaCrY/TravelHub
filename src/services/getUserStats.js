import { supabase } from "../services/supabase";

class UserStatsService {
  constructor(supabase) {
    this.supabase = supabase;
  }

  async getUserStats(user_id) {
    try {
      const { data: friendCount, error: friendCountError } = await this.supabase
        .from("friends")
        .select("friend_id", { count: 'exact' })
        .eq("user_id", user_id);
      
      if (friendCountError) {
        throw new Error("Error fetching friend count: " + friendCountError.message);
      }

      // Create a stats object
      const stats = {
        user_id: user_id,
        friendCount: friendCount.length,
      };

      return stats;
    } catch (error) {
      console.error("Error getting user stats: ", error);
      throw error; // Re-throw the error to handle it where you call this method
    }
  }
}

export default new UserStatsService(supabase);
