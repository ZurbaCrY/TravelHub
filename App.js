import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { FontAwesome5 } from "@expo/vector-icons";
import { Animated } from "react-native";
import { DarkModeProvider } from "./screens/DarkModeContext";

// import MapScreen from "./screens/MapScreen";
// import CommunityScreen from "./screens/CommunityScreen";
// import ProfileScreen from "./screens/ProfileScreen";
// import SettingsScreen from "./screens/SettingsScreen";
// import HomeScreen from "./screens/HomeScreen";
import {
  MapScreen,
  CommunityScreen,
  ProfileScreen,
  SettingsScreen,
  HomeScreen,
} from './src/screens'

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();
const Stack = createStackNavigator();
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
const TopTab = createMaterialTopTabNavigator();

import { View, Text, StyleSheet } from "react-native";
import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { supabase } from "./User-Auth/supabase";
import StartingScreen from "./screens/StartingScreen";
import SignInScreen from "./screens/SignInScreen";
import SignUpScreen from "./screens/SignUpScreen";
import auth from "./User-Auth/auth";
import { Session } from "@supabase/supabase-js";
import LoadingScreen from "./screens/LoadingScreen";
import SigninScreen from "./screens/SignInScreen";

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#3EAAE9" },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = "home";
          } else if (route.name === "Community") {
            iconName = "users";
          } else if (route.name === "Map") {
            iconName = "map-marker-alt";
          } else if (route.name === "Profile") {
            iconName = "user";
          }
          return (
            <Animated.View
              style={{
                transform: [{ scale: focused ? 1.2 : 1 }],
              }}
            >
              <FontAwesome5 name={iconName} size={24} color={color} />
            </Animated.View>
          );
        },
        tabBarShowLabel: true,
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth
      .getSession()
      .then(({ data: { session } }) => {
        setSession(session);
        setLoading(false); // Set loading to false once session is fetched
      })
      .catch((error) => {
        console.error("Error fetching session:", error);
        setLoading(false); // Set loading to false even if there's an error
      });

    const authListener = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      // Funktioniert nicht, bitte überarbeiten
      authListener.unsubscribe(); // Cleanup function for listener
    };
  }, []);

  if (loading) {
    return <LoadingScreen />; // Placeholder for loading screen
  }

  if (session && session.user) {
    return (
      <DarkModeProvider>
        <NavigationContainer>
          <RootStack.Navigator>
            <RootStack.Screen
              name="Main"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <RootStack.Screen name="Settings" component={SettingsScreen} />
          </RootStack.Navigator>
          <StatusBar style="auto" />
        </NavigationContainer>
      </DarkModeProvider>
    );
  } else {
    return (
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Welcome">
          <Stack.Screen
            name="Welcome"
            component={StartingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignInScreen"
            component={SignInScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignUpScreen"
            component={SignUpScreen}
            options={{ headerShown: false }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
