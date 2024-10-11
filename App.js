import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { StatusBar } from 'expo-status-bar';
import RootStackNavigator from './src/navigation/RootStack';
import AuthStackNavigator from './src/navigation/AuthStack';
import LoadingOverlay from './src/components/LoadingOverlay';
import FriendService from './src/services/friendService';
import { DarkModeProvider } from './src/context/DarkModeContext';
import { LoadingProvider, useLoading } from './src/context/LoadingContext';
import { AuthProvider, useAuth } from './src/context/AuthContext';


import { useTranslation } from 'react-i18next';


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

  const { t  } = useTranslation();
  const [ language, setLanguage ] = useState('en');

  useEffect(() => {
    const initFriends = async () => {
      try {
        showLoading("Loading Friends...");
        await FriendService.initialize();
      } catch (error) {
        console.error('Error loading friends:', error);
      } finally {
        hideLoading();
      }
    };

    // const loadLanguage = async () => {
    //   try {
    //     showLoading("Loading Language...");
    //     const savedLanguage = await AsyncStorage.getItem('language');
    //     if (savedLanguage) {
    //       i18n.changeLanguage(savedLanguage);
    //     } else {
    //       const locale = Localization.getLocales();
    //       i18n.changeLanguage(locale);
    //     }
    //   } catch (error) {
    //     console.error('Error loading language:', error);
    //   } finally {
    //     hideLoading();
    //   }
    // }

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