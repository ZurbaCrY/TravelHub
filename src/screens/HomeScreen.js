// screens/MapScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDarkMode } from './DarkModeContext';
import AuthService from '../User-Auth/auth';

export default function HomepageScreen() {
  let user;
  const { isDarkMode } = useDarkMode();
  user = AuthService.getUser();
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF',}]}>
      <Text style={{color: isDarkMode ? '#FFFDF3' : '#000000'  }}>{user.email}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
