import React, { useEffect, useState } from "react";
import { View, Button, FlatList, Text } from "react-native";
import FriendService from "../services/friendService";
import getUsernamesByUserIds from "../services/getUsernamesByUserIds";

export default function DevelopmentScreen() {
  const [friends, setFriends] = useState([]);
  const [incomingRequests, setIncomingRequests] = useState([]);
  const [usernames, setUsernames] = useState({}); // Store usernames in a dictionary

  useEffect(() => {
    const fetchFriendsAndRequests = async () => {
      try {
        // Fetch friend list and incoming requests from FriendService
        const friendList = FriendService.getFriends(); // Assuming this returns an array of friends
        const incomingRequestList = FriendService.getIncomingRequests(true, true, true); // Assuming this returns an array of requests
        
        // Extract IDs from friends and requests
        const friendIds = friendList.map(friend => friend.friend_id); // Extract friend_ids
        const requestSenderIds = incomingRequestList.map(request => request.sender_id); // Extract sender_ids
        
        // Combine all user IDs
        const allUserIds = [...friendIds, ...requestSenderIds];

        // Fetch usernames for all user IDs
        const fetchedUsernames = await getUsernamesByUserIds(allUserIds);

        // Create a map from user ID to username
        const usernameMap = {};
        fetchedUsernames.forEach(user => {
          usernameMap[user.user_id] = user.username;
        });

        // Update state with the friends, incoming requests, and username map
        setFriends(friendList);
        setIncomingRequests(incomingRequestList);
        setUsernames(usernameMap);
        
      } catch (error) {
        console.error("Error fetching friends or usernames:", error);
      }
    };

    fetchFriendsAndRequests();
  }, []);

  const acceptFriendRequest = async (requestId) => {
    await FriendService.respondToFriendRequest(requestId, "accept");
  };

  const declineFriendRequest = async (requestId) => {
    await FriendService.respondToFriendRequest(requestId, "decline");
  };

  return (
    <View>
      {/* Button to send a friend request */}
      <Button
        title="Send Friend Request"
        onPress={() => FriendService.sendFriendRequest("d3d4312c-9918-4101-b44e-5b7f6951cc31")}
      />

      {/* Display list of friends */}
      <FlatList
        data={friends}
        keyExtractor={(item) => item.friend_id}
        renderItem={({ item }) => (
          <Text>
            {usernames[item.friend_id] || item.friend_id} {/* Display username if available, else friend_id */}
          </Text>
        )}
      />

      {/* Display incoming friend requests */}
      <FlatList
        data={incomingRequests}
        keyExtractor={(item) => item.friend_request_id.toString()} // Assuming friend_request_id is unique
        renderItem={({ item }) => (
          <View>
            <Text>
              {usernames[item.sender_id] || item.sender_id} {/* Display username if available, else sender_id */}
              {" - Status: "}{item.status} 
            </Text>
            {item.status === "pending" && (
              <View>
                <Button title="Accept" onPress={() => acceptFriendRequest(item.friend_request_id)} />
                <Button title="Decline" onPress={() => declineFriendRequest(item.friend_request_id)} />
              </View>
            )}
          </View>
        )}
      />
    </View>
  );
}
