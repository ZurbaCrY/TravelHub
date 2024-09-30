import React from "react";
import { supabase } from "../services/supabase";
import AuthService from "../services/auth";

class FriendService {
  constructor(supabase) {
    this.supabase = supabase;
    this.user = null;
    this.user_id = null;
    this.loadUser();
  }

  async loadUser() {
    await AuthService.loadUser();
    this.user = AuthService.getUser();
    this.user_id = this.user.id;
    
    this.friendSubscription = supabase
      .from("friend_requests")
      .on("*", (payload) => {
        console.log("Change received!", payload);
      })
      .subscribe();
  }

  async sendFriendRequest(receiver_id) {
    const sender_id = this.user_id;
    if (sender_id == receiver_id) {
      throw new Error("You can't send a friend request to yourself");
    }
    const { data, error } = await this.supabase
      .from("friend_requests")
      .insert({ sender_id: sender_id, receiver_id: receiver_id });

    if (error) {
      throw new Error("Error sending friend request: " + error.message);
    }
    return data;
  }

  async respondToFriendRequest(requestId, action) {
    const status =
      action === "accept"
        ? "accepted"
        : action === "decline"
          ? "declined"
          : (() => {
            throw new Error(
              'Invalid parameter. Allowed values are "accept" or "decline".'
            );
          })();
    const { error } = await this.supabase
      .from("friend_requests")
      .update({ status })
      .eq("id", requestId);

    if (error) {
      throw new Error("Error responding to friend request: " + error.message);
    }

    // if ((action = "accept")) {
    //   addFriend(requestId);
    // }
  }

  async getFriends() {
    const { data, error } = await supabase
      .from("friends")
      .select("friend_id")
      .eq("user_id", this.user_id);
    if (error) throw error;
    if (data) return data;
  }

  async addFriend(friend_id) {
    const { data, error } = await supabase
      .from("friends")
      .insert([{ user_id: this.user_id, friend_id: friend_id },
      { user_id: friend_id, friend_id: this.user_id }])
    if (error) throw error;
  }

  async removeFriend(friend_id) {
    const { error } = await supabase
      .from("friends")
      .delete()
      .or(`(user_id.eq.${this.user_id}, friend_id.eq.${friend_id}), (user_id.eq.${friend_id}, friend_id.eq.${this.user_id})`);
    if (error) throw error;
    // Optional: Return success message or status if needed
    // return { success: true }
  }
}
export default new FriendService(supabase);
