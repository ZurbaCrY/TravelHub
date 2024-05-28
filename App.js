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
  ChatScreen,
  ChatListScreen,
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
  const [loading, setLoading] = useState({ status: true, message: "Loading..." });

  const setLoadingStatus = (status, message = "Loading...") => {
    setLoading({ status, message })
  }

  // On App open, initialize User, will not get info ever because AuthService cant have any (yet)
  useEffect(() => {
    const initUser = async () => {
      await AuthService.loadUser();
      const currentUser = await AuthService.getUser();
      console.log(currentUser);
      setUser(currentUser);
      setLoadingStatus(false)
    };
    initUser();
  }, []);

  // Just some User state prints for debugging purposes
  React.useEffect(() => {
    console.log('User state:', user);
  }, [user]);

  if (loading.status) {
    return (
      <LoadingScreen loadingMessage={loading.message} />
    );
  }
  return (
    // No want SerializableWarning, Serializablewarning bad 
    // safe to ignore warning displayed without this:
    <NavigationContainer ignoreSerializableWarnings={true}>
      {user ? (
        <DarkModeProvider>
          <RootStack.Navigator ignoreSerializableWarnings={true}>
            <RootStack.Screen
              name="Main"
              component={MainTabs}
              options={{ headerShown: false }}
            />
            <RootStack.Screen name="Settings">
              {props => <SettingsScreen {...props} setUser={setUser} setLoading={setLoadingStatus} />}

            </RootStack.Screen>
              <RootStack.Screen name="ChatListScreen" component={ChatListScreen} />
              <RootStack.Screen name="ChatScreen" component={ChatScreen} />
          </RootStack.Navigator>
          <StatusBar style="auto" />
        </DarkModeProvider>
      ) : (
        <Stack.Navigator gnoreSerializableWarnings={true} initialRouteName="Welcome">
          <Stack.Screen
            name="Welcome"
            component={StartingScreen}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="SignInScreen"
            options={{ headerShown: false }}
          >
            {props => <SignInScreen {...props} setUser={setUser} setLoading={setLoadingStatus} />}
          </Stack.Screen>
          <Stack.Screen
            name="SignUpScreen"
            options={{ headerShown: false }}
          >
            {props => <SignUpScreen {...props} setUser={setUser} setLoading={setLoadingStatus} />}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};
