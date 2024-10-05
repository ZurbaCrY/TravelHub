import { supabase } from "../services/supabase";
import AuthService from "../services/auth";

class FriendService {
  constructor(supabase) {
    this.supabase = supabase;
    this.initialized = false;
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
    this.initialize();
  }

  async initialize() {
    if (this.initialized) return;
    this.initialized = true;
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
      .or(`receiver_id.eq.${this.user.id},sender_id.eq.${this.user.id}`)
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
    if (receiver_id === this.user.id) {
      throw new Error("You can't send a friend request to yourself");
    }

    this.checkFriendshipLocal(receiver_id);
    this.checkExistingRequest(receiver_id);

    // Insert the friend request if none exists
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
    if (!["accept", "decline"].includes(action)) {
      throw new Error("Invalid action. Must be 'accept' or 'decline'.");
    }
    // Find the request in local state (pending, accepted, or declined)
    const request = this.friendRequests.received.pending.find(req => req.friend_request_id === requestId) ||
      this.friendRequests.received.accepted.find(req => req.friend_request_id === requestId) ||
      this.friendRequests.received.declined.find(req => req.friend_request_id === requestId);
    if (!request) {
      throw new Error("Friend request not found.");
    }
    if ((action === "accept" && request.status === "accepted") ||
      (action === "decline" && request.status === "declined")) {
      throw new Error(`This friend request has already been ${request.status}.`);
    }

    // Check if the user is already a friend
    this.checkFriendshipLocal(request.sender_id);

    // Update the status
    const status =
      action === "accept" ? "accepted" : "declined";
    const { data, error } = await this.supabase
      .from("friend_requests")
      .update({ status })
      .eq("friend_request_id", requestId)
      .select("sender_id")
      .single();
    if (error) {
      throw new Error("Error responding to friend request: " + error.message);
    }
    if (action === "accept") {
      await this.addFriend(data.sender_id);
    }
    this.updateRequestStatus(requestId, "received", status);
  }

  async addFriend(friend_id) {
    if (await this.checkFriendship(friend_id)) {
      throw new Error("You are already friends with this user");
    }

    // Insert the friendship if none exists
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
    // Check if friend exists
    const { error } = await this.supabase
      .from("friends")
      .delete()
      .or(`(user_id.eq.${this.user.id}, friend_id.eq.${friend_id}), (user_id.eq.${friend_id}, friend_id.eq.${this.user.id})`);
    if (error) throw error;
    this.data.friends = this.data.friends.filter(f => f !== friend_id); // Remove friend from list
  }

  async checkFriendship(friend_id) {
    // Check if the friendship already exists in local state
    if (this.checkFriendshipLocal(friend_id)) {
      throw new Error("You are already friends with this user");
    }

    const { data: existingFriendship, error } = await this.supabase
      .from("friends")
      .select("*")
      .or(`user_id.eq.${this.user.id}, friend_id.eq.${friend_id}), (user_id.eq.${friend_id}, friend_id.eq.${this.user.id}`);

    if (error) {
      throw new Error("Error checking for existing friendships: " + error.message);
    }

    return existingFriendship.length > 0;
  }

  checkExistingRequest(receiver_id) {
    const existingRequest = this.friendRequests.sent.pending.find(
      req => req.receiver_id === receiver_id || req.sender_id === receiver_id
    );
    if (existingRequest) {
      throw new Error("Friend request already sent.");
    }

    const receivedRequest = this.friendRequests.received.pending.find(
      req => req.sender_id === receiver_id
    );
    if (receivedRequest) {
      throw new Error("You have already received a friend request from this user.");
    }
  }

  checkFriendshipLocal(friend_id) {
    return this.friends.some(friend => friend.friend_id === friend_id);
  }

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

  getIncomingRequests(pending = true, accepted = true, declined = true) {
    const requests = [];

    if (pending) {
      requests.push(...this.friendRequests.received.pending);
    }

    if (accepted) {
      requests.push(...this.friendRequests.received.accepted);
    }

    if (declined) {
      requests.push(...this.friendRequests.received.declined);
    }

    return requests;
  }
}

export default new FriendService(supabase);
