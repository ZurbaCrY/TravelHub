import React from "react";
import { View, Button } from "react-native";
import FriendService from "./dev_backend";

export default function DevelopmentScreen() {
  // Define async functions using arrow syntax
  const acceptFriendRequest = async () => {
    await FriendService.respondToFriendRequest();
  };
  
  const declineFriendRequest = async () => {
    await FriendService.respondToFriendRequest();
  };

  return (
    <View>
      {/* Use arrow functions to handle the onPress event properly */}
      <Button title="sendFriendRequest" onPress={() => FriendService.sendFriendRequest("2472b8e1-8952-4064-a508-7bc44abb66ea")} />
      <Button title="acceptFriendRequest" onPress={acceptFriendRequest} />
      <Button title="declineFriendRequest" onPress={declineFriendRequest} />
    </View>
  );
}
