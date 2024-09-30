import React, { useEffect, useState } from "react";
import { View, Button, FlatList, Text } from "react-native";
import FriendService from "./dev_backend";

export default function DevelopmentScreen() {
  const [friends, setFriends] = useState([])

  useEffect(() => {
    const fetchFriends = async () => {
      try {
        await FriendService.loadUser();
        console.log(FriendService.friends)
        console.log(FriendService.friendRequests)
        const friendList = await FriendService.getFriends();
        setFriends(friendList);
      } catch (error) {
        console.error("Error fetching friends:", error);
      }
    };

    fetchFriends();
  }, []);

  const acceptFriendRequest = async () => {
    await FriendService.respondToFriendRequest(35, "accept");
  };

  const declineFriendRequest = async () => {
    await FriendService.respondToFriendRequest(33, "decline");
  };

  return (
    <View>
      {/* Use arrow functions to handle the onPress event properly */}
      <Button
        title="sendFriendRequest"
        onPress={() => FriendService.sendFriendRequest("2472b8e1-8952-4064-a508-7bc44abb66ea")}
      />
      <Button title="acceptFriendRequest" onPress={acceptFriendRequest} />
      <Button title="declineFriendRequest" onPress={declineFriendRequest} />

      {/* Display list of friends */}
      <FlatList
        data={friends}
        keyExtractor={(item) => item.friend_id}
        renderItem={({ item }) => (
          <Text>{item.friend_id}</Text>
        )}
      />
    </View>
  );
}
