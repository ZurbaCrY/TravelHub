import React from "react";
import { useState, useEffect } from "react";
import { Animated } from "react-native";
import { StatusBar } from "expo-status-bar";
import { FontAwesome5 } from "@expo/vector-icons";
import "react-native-url-polyfill/auto";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";

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
import { DarkModeProvider } from "./src/context/DarkModeContext";
import AuthService from "./src/services/auth"

const Tab = createBottomTabNavigator();
const RootStack = createStackNavigator();
const Stack = createStackNavigator();
const ignoreSerializableWarnings = true;

const getIconName = (routeName) => {
  switch (routeName) {
    case 'Map':
      return 'map-marker-alt';
    case 'Community':
      return 'users';
    case 'Chats':
      return 'comments';
    case 'Profile':
      return 'user';
    default:
      return '';
  }
};

function MainTabs() {
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
            <Animated.View
              style={{
                transform: [{ scale: focused ? 1.2 : 1 }],
              }}
            >
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

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState({ status: true, message: "Loading..." });

  const setLoadingStatus = (status, message = "Loading...") => {
    setLoading({ status, message })
  }

  // On App open, initialize User
  useEffect(() => {
    const initUser = async () => {
      try {
        await AuthService.loadUser();
        const currentUser = await AuthService.getUser();
        console.log(currentUser);
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoadingStatus(false);
      }
    };
    initUser();
  }, []);

  // User state prints
  useEffect(() => {
    if (__DEV__) {
      console.log('User state:', user);
    }
  }, [user]);

  if (loading.status) {
    return (
      <LoadingScreen loadingMessage={loading.message} />
    );
  }

  return (
    // No want SerializableWarning, Serializablewarning bad 
    // safe to ignore warning displayed without this:
    <NavigationContainer ignoreSerializableWarnings={ignoreSerializableWarnings}>
      {user ? (
        // If user is logged in do this
        <DarkModeProvider>
          <RootStack.Navigator ignoreSerializableWarnings={ignoreSerializableWarnings}>
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
        // If user not logged in do this
        <Stack.Navigator ignoreSerializableWarnings={ignoreSerializableWarnings} initialRouteName="Welcome">
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