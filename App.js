import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5 } from '@expo/vector-icons';
import { Animated, Easing } from 'react-native'; // Importiere Animated und Easing

import MapScreen from './pages/Maps';
import CommunityScreen from './pages/Community';
import ProfileScreen from './pages/Profile';
import SettingsScreen from './pages/Settings';
import HomeScreen from './pages/Home';

const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          activeTintColor: 'blue', // Farbe für aktiven Tab
          inactiveTintColor: 'gray', // Farbe für inaktiven Tab
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;

            if (route.name === 'Home') {
              iconName = 'home';
            } else if (route.name === 'Community') {
              iconName = 'users';
            } else if (route.name === 'Map') {
              iconName = 'map-marker-alt';
            } else if (route.name === 'Profile') {
              iconName = 'user';
            } else if (route.name === 'Settings') {
              iconName = 'cog';
            }

            // Erstelle eine animierte Komponente
            return (
              <Animated.View
                style={{
                  transform: [
                    // Füge eine Animation hinzu, wenn der Tab ausgewählt ist
                    {
                      scale: focused
                        ? new Animated.Value(1.2)
                        : new Animated.Value(1),
                    },
                  ],
                }}
              >
                <FontAwesome5 name={iconName} size={24} color={color} />
              </Animated.View>
            );
          },
        })}
      >
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Community" component={CommunityScreen} />
        <Tab.Screen name="Map" component={MapScreen} />
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Settings" component={SettingsScreen} />
      </Tab.Navigator>
      <StatusBar style="auto" />
    </NavigationContainer>
  );
}
