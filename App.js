import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { FontAwesome5 } from "@expo/vector-icons";
import { Animated, View, ActivityIndicator, Text } from "react-native";
import { DarkModeProvider } from "./src/screens/DarkModeContext";
import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import { supabase } from "./src/User-Auth/supabase";
import {
  MapScreen,
  CommunityScreen,
  ProfileScreen,
  SettingsScreen,
  HomeScreen,
  StartingScreen,
  SignInScreen,
  SignUpScreen,
  LoadingScreen,
} from './src/screens'
import AuthService from "./src/User-Auth/auth"

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();
const Stack = createStackNavigator();

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarActiveTintColor: "#ffffff",
        tabBarInactiveTintColor: "gray",
        tabBarStyle: { backgroundColor: "#3EAAE9" },
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === "HomeScreen") {
            iconName = "home";
          } else if (route.name === "CommunityScreen") {
            iconName = "users";
          } else if (route.name === "MapScreen") {
            iconName = "map-marker-alt";
          } else if (route.name === "ProfileScreen") {
            iconName = "user";
          } else if (route.name === "ChatListScreen") {
            iconName = "comments";
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
      <Tab.Screen name="HomeScreen" component={HomeScreen} />
      <Tab.Screen name="CommunityScreen" component={CommunityScreen} />
      <Tab.Screen name="MapScreen" component={MapScreen} />
      <Tab.Screen name="ProfileScreen" component={ProfileScreen} />
      <Tab.Screen name="ChatListScreen" component={ChatListScreen} />
    </Tab.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // On App open, initialize User, will not get info ever because AuthService cant have any (yet)
  useEffect(() => {
    const initUser = async () => {
      const currentUser = await AuthService.getUser();
      console.log(currentUser);
      setUser(currentUser);
      setLoading(false)
    };
    initUser();
  }, []);

  // Just some User state prints for debugging purposes
  React.useEffect(() => {
    console.log('User state:', user);
  }, [user]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#39FF55" />
      </View>
    );
  }
  return (
    // No want SerializableWarning, Serializablewarning bad 
    // safe to ignore warning displayed without this:
    <NavigationContainer ignoreSerializableWarnings={true}>
      {user ? (
        <DarkModeProvider>
            <RootStack.Navigator>
              <RootStack.Screen
                name="Main"
                component={MainTabs}
                options={{ headerShown: false }}
              />
              <RootStack.Screen name="Settings" component={SettingsScreen} />
              <RootStack.Screen name="ChatListScreen" component={ChatListScreen} />
              <RootStack.Screen name="ChatScreen" component={ChatScreen} />
            </RootStack.Navigator>
            <StatusBar style="auto" />
        </DarkModeProvider>
      ) : (
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
              initialParams={{setUser: setUser}}
              />
            <Stack.Screen
              name="SignUpScreen"
              component={SignUpScreen}
              options={{ headerShown: false }}
              initialParams={{setUser: setUser}}
            />
          </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};
