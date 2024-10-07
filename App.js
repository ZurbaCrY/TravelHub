import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import RootStackNavigator from './src/navigation/RootStack';
import AuthStackNavigator from './src/navigation/AuthStack';
import LoadingOverlay from './src/components/LoadingOverlay';
import FriendService from './src/services/friendService';
import { DarkModeProvider } from './src/context/DarkModeContext';
import { LoadingProvider, useLoading } from './src/context/LoadingContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';

export default function App() {
  return (
    <LoadingProvider>
      <AuthProvider>
        <NavigationContainer>
          <AppContent />
          <StatusBar style="auto" />
        </NavigationContainer>
        <LoadingOverlay />
      </AuthProvider>
    </LoadingProvider>
  );
}

function AppContent() {
  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoading();

  // Initialize friends
  useEffect(() => {
    const initFriends = async () => {
      try {
        showLoading('Loading Friends...');
        await FriendService.initialize();
      } catch (error) {
        console.error('Error loading friends:', error);
      } finally {
        hideLoading();
      }
    };

    initFriends();
  }, []);

  return user ? (
    <DarkModeProvider>
      <RootStackNavigator />
    </DarkModeProvider>
  ) : (
    <AuthStackNavigator />
  );
}