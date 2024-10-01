import React, { useEffect, useState } from "react";
import { View, Button, FlatList, Text } from "react-native";
import FriendService from "./dev_backend";
import getUsernamesByUserIds from "../services/getUsernamesByUserIds";

export default function DevelopmentScreen() {
  const [friends, setFriends] = useState([])
  const [incomingRequests, setIncomingRequests] = useState([])
  const [friendUsernames, setFriendUsernames] = useState({});
  const [incomingRequestUsernames, setIncomingRequestUsernames] = useState({});

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        await FriendService.setup();

        const incomingRequestList = FriendService.getIncomingRequests(true, true, true);
        setIncomingRequests(incomingRequestList);

        const friendList = FriendService.getFriends();
        setFriends(friendList);

        // Fetch usernames for friends
        const friendIds = friendList.map(friend => friend.friend_id); // Extract friend IDs
        const fetchedFriendUsernames = await getUsernamesByUserIds(friendIds);
        const friendUsernameMap = Object.fromEntries(fetchedFriendUsernames.map(user => [user.id, user.username]));
        setFriendUsernames(friendUsernameMap); // Store usernames in state

        // Fetch usernames for incoming requests
        const requestSenderIds = incomingRequestList.map(request => request.sender_id); // Extract sender IDs
        const fetchedRequestUsernames = await getUsernamesByUserIds(requestSenderIds);
        const requestUsernameMap = Object.fromEntries(fetchedRequestUsernames.map(user => [user.id, user.username]));
        setIncomingRequestUsernames(requestUsernameMap); // Store usernames in state

        console.log("friends: ", friendList, "\nincomingRequests: ", incomingRequestList);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, []);

  const acceptFriendRequest = async (requestId) => {
    await FriendService.respondToFriendRequest(requestId, "accept");
  };

  const declineFriendRequest = async (requestId) => {
    await FriendService.respondToFriendRequest(requestId, "decline");
  };

  return (
    <View>
      {/* Use arrow functions to handle the onPress event properly */}
      <Button
        title="sendFriendRequest"
        onPress={() => FriendService.sendFriendRequest("d3d4312c-9918-4101-b44e-5b7f6951cc31")}
      />

      {/* Display list of friends */}
      <FlatList
        data={friends}
        keyExtractor={(item) => item.friend_id}
        renderItem={({ item }) => (
          <Text>
            {friendUsernames[item.friend_id] || item.friend_id} {/* Display username or friend_id if not found */}
            </Text>
        )}
      />

      {/* Display incoming friend requests */}
      <FlatList
        data={incomingRequests}
        keyExtractor={(item) => item.friend_request_id.toString()} // Assuming friend_request_id is a unique identifier
        renderItem={({ item }) => (
          <View>
            <Text>
              {incomingRequestUsernames[item.sender_id] || item.sender_id} - Status: {item.status}
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