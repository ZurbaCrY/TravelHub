// screens/MapScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDarkMode } from './DarkModeContext';

export default function FriendsScreen() {
const { isDarkMode, toggleDarkMode } = useDarkMode();
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF',  }]}>
      
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

