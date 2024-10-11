import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabs from './MainTabs';
import { ChatScreen } from "../screens/chat";
import { CommunityDetailScreen } from "../screens/community";
import { SettingsScreen, EditProfile } from "../screens/profile";
import { DevelopmentScreen } from "../development";

const RootStack = createStackNavigator();

export default function RootStackNavigator() {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <RootStack.Screen name="Settings" component={SettingsScreen} />
      <RootStack.Screen name="EditProfile" component={EditProfile} />
      <RootStack.Screen name="Development" component={DevelopmentScreen} />
      <RootStack.Screen name="CommunityDetail" component={CommunityDetailScreen} options={{ title: 'Post' }} />
      <RootStack.Screen name="Chat" component={ChatScreen} />
    </RootStack.Navigator>
  );
}
