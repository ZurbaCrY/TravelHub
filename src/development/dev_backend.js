import { supabase } from "../services/supabase";
import AuthService from "../services/auth";

class FriendService {
  constructor(supabase) {
    this.supabase = supabase;
    this.user = null;
    this.friendRequests = {
      received: {
        pending: [],
        accepted: [],
        declined: [],
      },
      sent: {
        pending: [],
        accepted: [],
        declined: [],
      }
    }
    this.friends = [];
    this.setup();
  }

  async setup() {
    try {
      await this.loadUser();
      await this.fetchFriends();
      await this.fetchFriendRequests();
    } catch (error) {
      console.error("Error in FriendService setup: ", error)
    }
  }

  async loadUser() {
    await AuthService.loadUser();
    this.user = AuthService.getUser();
  }

  async fetchFriends() {
    if (!this.user || !this.user.id) {
      throw new Error("User not loaded");
    }
    const { data, error } = await this.supabase
      .from("friends")
      .select("friend_id")
      .eq("user_id", this.user.id);
    if (error) {
      throw new Error("Error fetching friends: " + error.message);
    }
    this.friends = data || [];
  }

  async fetchFriendRequests() {
    if (!this.user || !this.user.id) {
      throw new Error("User not loaded");
    }
    const { data, error } = await this.supabase
      .from("friend_requests")
      .select("*")
      .or(`receiver_id.eq.${this.user.id},sender_id.eq.${this.user.id}`) // Get all sent and received friend requests
      .in("status", ["pending", "accepted", "declined"]);
    if (error) {
      throw new Error("Error fetching friend requests: " + error.message);
    }

    // Separate requests into sent and received
    data.forEach(req => {
      if (req.receiver_id === this.user.id) {
        this.friendRequests.received[req.status].push(req);
      } else if (req.sender_id === this.user.id) {
        this.friendRequests.sent[req.status].push(req);
      }
    });
  }

  async sendFriendRequest(receiver_id) {
    if (this.user.id === receiver_id) {
      throw new Error("You can't send a friend request to yourself");
    }
    const { data, error } = await this.supabase
      .from("friend_requests")
      .insert({ sender_id: this.user.id, receiver_id })
      .select();
    if (error) {
      throw new Error("Error sending friend request: " + error.message);
    }
    this.friendRequests.sent.pending.push(data[0])
    return data;
  }

  async respondToFriendRequest(requestId, action) {
    const status =
      action === "accept" ? "accepted" : "declined";
    const { data, error } = await this.supabase
      .from("friend_requests")
      .update({ status })
      .eq("friend_request_id", requestId)
      .select("receiver_id")
      .single();
    if (error) {
      throw new Error("Error responding to friend request: " + error.message);
    }
    if (action == "accept") {
      await this.addFriend(data.receiver_id);
    }
    this.updateRequestStatus(requestId, "received", status);
  }

  async addFriend(friend_id) {
    const { data, error } = await this.supabase
      .from("friends")
      .insert([
        { user_id: this.user.id, friend_id: friend_id },
        { user_id: friend_id, friend_id: this.user.id }
      ])
      .select();
    if (error) throw error;

    const friendEntry = data.find(entry => entry.user_id === this.user.id);

    this.friends.push(friendEntry)
    return friendEntry;
  }

  async removeFriend(friend_id) {
    const { error } = await this.supabase
      .from("friends")
      .delete()
      .or(`(user_id.eq.${this.user.id}, friend_id.eq.${friend_id}), (user_id.eq.${friend_id}, friend_id.eq.${this.user.id})`);
    if (error) throw error;
    this.data.friends = this.data.friends.filter(f => f !== friend_id); // Remove friend from list
  }

  // Update the status of a request in the local store
  updateRequestStatus(requestId, type, newStatus) {
    const request = this.friendRequests[type].pending.find(req => req.friend_request_id === requestId);
    if (request) {
      this.friendRequests[type][newStatus].push(request);
      this.friendRequests[type].pending = this.friendRequests[type].pending.filter(req => req.friend_request_id !== requestId);
    }
  }

  getFriends() {
    return this.friends
  }
}

export default new FriendService(supabase);
