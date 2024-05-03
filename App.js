import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import { FontAwesome5 } from '@expo/vector-icons';
import { Animated } from 'react-native';
import { DarkModeProvider } from './pages/DarkModeContext';

import MapScreen from './pages/Maps';
import CommunityScreen from './pages/Community';
import ProfileScreen from './pages/Profile';
import SettingsScreen from './pages/Settings';
import HomeScreen from './pages/Home';

import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
const Tab = createBottomTabNavigator();
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const TopTab = createMaterialTopTabNavigator();

import { View, Text, StyleSheet } from 'react-native';
import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from './User-Auth/supabase'
import SignInScreen from './pages/SignIn';
import SignUpScreen from './pages/SignUp';
import { Session } from '@supabase/supabase-js'

export default function App() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  if (session && session.user) {
    return (
      <DarkModeProvider>
        <NavigationContainer>
          <Tab.Navigator
            screenOptions={({ route }) => ({
              tabBarActiveTintColor: '#ffffff', // Farbe für aktiven Tab
              tabBarInactiveTintColor: 'gray', // Farbe für inaktiven Tab
              tabBarStyle: { backgroundColor: "#3EAAE9" },
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
                return (
                  <Animated.View
                    style={{
                      transform: [
                        {
                          scale: focused ? 1.2 : 1,
                        },
                      ],
                    }}
                  >
                    <FontAwesome5 name={iconName} size={24} color={color} />
                  </Animated.View>
                );
              },
              tabBarShowLabel: true,
              headerShown: false
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
      </DarkModeProvider>
    );
  } else {
    return (

      // Disign nur von Oben kopirt, sollte bearbeitet werden!

      <DarkModeProvider>
        <NavigationContainer>
          <TopTab.Navigator
            screenOptions={({ route }) => ({
              tabBarActiveTintColor: '#ffffff', // Farbe für aktiven Tab
              tabBarInactiveTintColor: 'gray', // Farbe für inaktiven Tab
              tabBarStyle: { backgroundColor: "#3EAAE9" },
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
                return (
                  <Animated.View
                    style={{
                      transform: [
                        {
                          scale: focused ? 1.2 : 1,
                        },
                      ],
                    }}
                  >
                    <FontAwesome5 name={iconName} size={24} color={color} />
                  </Animated.View>
                );
              },
              tabBarShowLabel: true,
              headerShown: false
            })}
          >
            <Tab.Screen name="SignIn" component={SignInScreen} />
            <Tab.Screen name="SignUp" component={SignUpScreen} />
          </TopTab.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </DarkModeProvider>
    )
  }
}
