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
        revoked: [],
      },
      sent: {
        pending: [],
        accepted: [],
        declined: [],
        revoked: [],
      }
    };
    this.friends = [];
  }

  async initialize() {
    try {
      await this.loadUser();
      // await Promise.all([this.fetchFriends(), this.fetchFriendRequests()]);
    } catch (error) {
      console.error("Error in FriendService setup: ", error);
    }
  }

  async loadUser() {
    await AuthService.initialize();
    await AuthService.loadUser();
    this.user = await AuthService.getUser();
    if (!this.user || !this.user.id) {
      throw new Error("User not loaded");
    }
  }

  setUser(user) {
    this.user = user;
  }

  async fetchFriends() {
    const { data, error } = await this.supabase
      .from("friends")
      .select("friend_id")
      .eq("user_id", this.user.id);
    if (error) {
      throw new Error("Error fetching friends: " + error.message);
    }
    this.friends = data || [];
    console.log("Friends: ", this.friends);
  }

  async fetchFriendRequests() {
    const { data, error } = await this.supabase
      .from("friend_requests")
      .select("*")
      .or(`receiver_id.eq.${this.user.id},sender_id.eq.${this.user.id}`)
      .in("status", ["pending", "accepted", "declined"]);
    if (error) {
      throw new Error("Fetch Friend Requests: Error fetching friend requests: " + error.message);
    }

    this.friendRequests = {
      received: {
        pending: [],
        accepted: [],
        declined: [],
        revoked: [],
      },
      sent: {
        pending: [],
        accepted: [],
        declined: [],
        revoked: [],
      }
    };

    data.forEach(req => {
      const type = req.receiver_id === this.user.id ? 'received' : 'sent';
      this.friendRequests[type][req.status].push(req);
    });

    console.log("Friend Requests: ", this.friendRequests);
  }

  async sendFriendRequest(receiver_id) {
    if (receiver_id === this.user.id) {
      throw new Error("You can't send a friend request to yourself");
    }

    if (this.checkFriendshipLocal(receiver_id) || this.checkExistingRequest(receiver_id)) {
      return;
    }

    const { data, error } = await this.supabase
      .from("friend_requests")
      .insert({ sender_id: this.user.id, receiver_id })
      .select();
    if (error) {
      throw new Error("Error sending friend request: " + error.message);
    }
    this.friendRequests.sent.pending.push(data[0]);
    console.log("Friend request sent: ", data[0]);
    return data;
  }

  async respondToFriendRequest(requestId, action) {
    let request = null;
    let type = null;
    if (action == "accept" || action == "decline"){
      type = "received";
      request = this.findRequestById(requestId, "received");
    } else if (action == "revoke") {
      type = "sent";
      request = this.findRequestById(requestId, "sent");
    } else {
      console.error("Invalid action: ", action);
      return;
    }

    if (!request) {
      throw new Error("Friend request not found.");
    }
    if (request.status === action) {
      throw new Error(`This friend request has already been ${request.status}.`);
    }

    if (action === "accept" && this.checkFriendshipLocal(request.sender_id)) {
      throw new Error("You are already friends with this user");
    }

    const status = action === "accept" ? "accepted" : action === "decline" ? "declined" : "revoked";
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
    this.updateRequestStatus(requestId, type, status);
  }

  async addFriend(friend_id) {
    if (await this.checkFriendship(friend_id)) {
      throw new Error("You are already friends with this user");
    }

    const { data, error } = await this.supabase
      .from("friends")
      .insert([
        { user_id: this.user.id, friend_id: friend_id },
        { user_id: friend_id, friend_id: this.user.id }
      ])
      .select();
    if (error) throw error;

    const friendEntry = data.find(entry => entry.user_id === this.user.id);
    this.friends.push(friendEntry);
    return friendEntry;
  }

  async removeFriend(friend_id) {
    const { error } = await this.supabase
      .from("friends")
      .delete()
      .or(`user_id.eq.${this.user.id},friend_id.eq.${friend_id}`)
      .or(`user_id.eq.${friend_id},friend_id.eq.${this.user.id}`);
    if (error) throw error;
    this.friends = this.friends.filter(f => f.friend_id !== friend_id);
  }

  async checkFriendship(friend_id) {
    if (this.checkFriendshipLocal(friend_id)) {
      return true;
    }

    const { data: existingFriendship, error } = await this.supabase
      .from("friends")
      .select("*")
      .or(`user_id.eq.${this.user.id},friend_id.eq.${friend_id}`)
      .or(`user_id.eq.${friend_id},friend_id.eq.${this.user.id}`);
      if (error) {
      throw new Error("Error checking for existing friendships: " + error.message);
    }

    return existingFriendship.length > 0;
  }

  checkExistingRequest(receiver_id) {
    return this.friendRequests.sent.pending.find(
      req => req.receiver_id === receiver_id || req.sender_id === receiver_id
    ) || this.friendRequests.received.pending.find(
      req => req.sender_id === receiver_id
    );
  }


  checkFriendshipLocal(friend_id) {
    const result = this.friends.some(friend => friend.friend_id === friend_id);
    return result;
  }

  updateRequestStatus(requestId, type, newStatus) {
    const request = this.friendRequests[type].pending.find(req => req.friend_request_id === requestId);
    if (request) {
      this.friendRequests[type][newStatus].push(request);
      this.friendRequests[type].pending = this.friendRequests[type].pending.filter(req => req.friend_request_id !== requestId);
    } else {
      console.error(`Request not found for requestId: ${requestId}`);
    }
  }

  findRequestById(requestId, type) {
    const request = this.friendRequests[type].pending.find(req => req.friend_request_id === requestId) ||
      this.friendRequests[type].accepted.find(req => req.friend_request_id === requestId) ||
      this.friendRequests[type].declined.find(req => req.friend_request_id === requestId);
    return request;
  }

  async getFriends() {
    await this.fetchFriends();
    return this.friends;
  }

  async getIncomingRequests(pending = true, accepted = true, declined = true, revoked = true) {
    await this.fetchFriendRequests();
    const requests = [];
    if (pending) requests.push(...this.friendRequests.received.pending);
    if (accepted) requests.push(...this.friendRequests.received.accepted);
    if (declined) requests.push(...this.friendRequests.received.declined);
    if (revoked) requests.push(...this.friendRequests.received.revoked);
    return requests;
  }

  async getFriendshipStatus(friend_id) {
    await this.fetchFriendRequests();
    const isFriend = this.checkFriendshipLocal(friend_id);
    const sentRequest = this.friendRequests.sent.pending.find(req => req.receiver_id === friend_id);
    const receivedRequest = this.friendRequests.received.pending.find(req => req.sender_id === friend_id);
    return {
      isFriend,
      request: sentRequest ? { ...sentRequest, type: 'sent' } : receivedRequest ? { ...receivedRequest, type: 'received' } : null
    };
  }
}
export default new FriendService(supabase);