import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StatusBar } from "expo-status-bar";
import { FontAwesome5 } from "@expo/vector-icons";
import { Animated } from "react-native";
import { DarkModeProvider } from "./src/screens/DarkModeContext";
import "react-native-url-polyfill/auto";
import { useState, useEffect } from "react";
import {
  MapScreen,
  CommunityScreen,
  ProfileScreen,
  SettingsScreen,
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
        tabBarIcon: ({ focused, color }) => {
          let iconName;
          // if (route.name === "HomeScreen") {
          //   iconName = "home";
          // } else 
          if (route.name === "Map") {
          iconName = "map-marker-alt";
          } else if (route.name === "Community") {
            iconName = "users";
          } else if (route.name === "Chats") {
            iconName = "comments";
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
      {/* <Tab.Screen name="HomeScreen" component={HomeScreen} /> */}
      <Tab.Screen name="Map" component={MapScreen} />
      <Tab.Screen name="Community" component={CommunityScreen} />
      <Tab.Screen name="Chats" component={ChatListScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
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