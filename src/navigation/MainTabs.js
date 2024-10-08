import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Animated } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { MapScreen } from "../screens/map/";
import { CommunityScreen } from "../screens/community/";
import { ProfileScreen } from "../screens/profile/";
import { ChatListScreen } from "../screens/chat/";

const Tab = createBottomTabNavigator();

const getIconName = (routeName) => {
  switch (routeName) {
    case 'Map': return 'map-marker-alt';
    case 'Community': return 'users';
    case 'Chats': return 'comments';
    case 'Profile': return 'user';
    default: return '';
  }
};

export default function MainTabs() {
  const theme = {
    activeTintColor: '#ffffff',
    inactiveTintColor: 'gray',
    tabBarBackgroundColor: '#3EAAE9',
  };

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: theme.activeTintColor,
        tabBarInactiveTintColor: theme.inactiveTintColor,
        tabBarStyle: { backgroundColor: theme.tabBarBackgroundColor },
        tabBarIcon: ({ focused, color }) => {
          const iconName = getIconName(route.name);
          return (
            <Animated.View style={{ transform: [{ scale: focused ? 1.2 : 1 }] }}>
              <FontAwesome5 name={iconName} size={24} color={color} />
            </Animated.View>
          );
        },
        tabBarShowLabel: false,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Chats" component={ChatListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}
