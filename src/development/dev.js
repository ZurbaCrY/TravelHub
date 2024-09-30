import React, { useEffect, useState } from "react";
import { View, Button, FlatList, Text } from "react-native";
import FriendService from "./dev_backend";

export default function DevelopmentScreen() {
  const [friends, setFriends] = useState([])
  const [incomingRequests, setIncomingRequests] = useState([])

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        await FriendService.setup();
        const incomingRequestList = FriendService.getIncomingRequests(true, false, true);
        setIncomingRequests(incomingRequestList);

        const friendList = FriendService.getFriends();
        setFriends(friendList);

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
        onPress={() => FriendService.sendFriendRequest("2472b8e1-8952-4064-a508-7bc44abb66ea")}
      />

      {/* Display list of friends */}
      <FlatList
        data={friends}
        keyExtractor={(item) => item.friend_id}
        renderItem={({ item }) => (
          <Text>{item.friend_id}</Text>
        )}
      />

      {/* Display incoming friend requests */}
      <FlatList
        data={incomingRequests}
        keyExtractor={(item) => item.friend_request_id.toString()} // Assuming friend_request_id is a unique identifier
        renderItem={({ item }) => (
          <View>
            <Text>
              {item.sender_id} - Status: {item.status}
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
