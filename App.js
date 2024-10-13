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
import AsyncStorage from '@react-native-async-storage/async-storage';
import i18n from './src/assets/i18n/i18n';
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

  const { t } = useTranslation();

  useEffect(() => {
    const initFriends = async () => {
      try {
        showLoading(t('LOADING_MESSAGE.FRIENDS'));
        await FriendService.initialize();
      } catch (error) {
        console.error('Error loading friends:', error);
      } finally {
        hideLoading();
      }
    };

    const loadLanguage = async () => {
      try {
        showLoading(t('LOADING_MESSAGE.LANGUAGE'));
        const savedLanguage = await AsyncStorage.getItem('language');
        if (savedLanguage) {
          i18n.changeLanguage(savedLanguage);
        } else {
          const locale = Localization.getLocales();
          i18n.changeLanguage(locale);
        }
      } catch (error) {
        console.error('Error loading language:', error);
      } finally {
        hideLoading();
      }
    }

    if (user) {
      initFriends();
    }
    loadLanguage();
  }, []);

  return user ? (
    <DarkModeProvider>
      <RootStackNavigator />
    </DarkModeProvider>
  ) : (
    <AuthStackNavigator />
  );
}