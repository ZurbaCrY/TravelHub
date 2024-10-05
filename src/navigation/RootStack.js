import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import MainTabs from './MainTabs';
import { ChatScreen } from "../screens/chat";
import { CommunityDetailScreen } from "../screens/community";
import { SettingsScreen } from "../screens/profile";
import { DevelopmentScreen } from '../development/dev';

const RootStack = createStackNavigator();

export default function RootStackNavigator({ user, setUser, setLoadingStatus }) {
  return (
    <RootStack.Navigator>
      <RootStack.Screen name="Main" component={MainTabs} options={{ headerShown: false }} />
      <RootStack.Screen name="Settings">
        {props => <SettingsScreen {...props} setUser={setUser} setLoading={setLoadingStatus} />}
      </RootStack.Screen>
      <RootStack.Screen name="Development">
        {props => <DevelopmentScreen {...props} setUser={setUser} setLoading={setLoadingStatus} />}
      </RootStack.Screen>
      <RootStack.Screen name="CommunityDetail" component={CommunityDetailScreen} options={{ title: 'Post' }} />
      <RootStack.Screen name="ChatScreen" component={ChatScreen} />
    </RootStack.Navigator>
  );
}
