import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import AuthService from './src/services/auth';
import FriendService from './src/services/friendService';
import RootStackNavigator from './src/navigation/RootStack';
import AuthStackNavigator from './src/navigation/AuthStack';
import { DarkModeProvider } from './src/context/DarkModeContext';
import { LoadingScreen } from './src/screens/loading/';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState({ status: true, message: "Loading..." });

  const setLoadingStatus = (status, message = "Loading...") => {
    setLoading({ status, message });
  };

  // Initialize user and friends
  useEffect(() => {
    const initUser = async () => {
      try {
        setLoadingStatus(true);
        await AuthService.loadUser();
        const currentUser = await AuthService.getUser();
        setUser(currentUser);
      } catch (error) {
        console.error('Error loading user:', error);
      } finally {
        setLoadingStatus(false);
      }
    };

    const initFriends = async () => {
      try {
        setLoadingStatus(true);
        await FriendService.initialize();
      } catch (error) {
        console.error('Error loading friends:', error);
      } finally {
        setLoadingStatus(false);
      }
    };

    initUser();
    initFriends();
  }, []);

  if (loading.status) {
    return <LoadingScreen loadingMessage={loading.message} />;
  }

  return (
    <NavigationContainer>
      {user ? (
        <DarkModeProvider>
          <RootStackNavigator user={user} setUser={setUser} setLoadingStatus={setLoadingStatus} />
          <StatusBar style="auto" />
        </DarkModeProvider>
      ) : (
        <AuthStackNavigator setUser={setUser} setLoadingStatus={setLoadingStatus} />
      )}
    </NavigationContainer>
  );
}
