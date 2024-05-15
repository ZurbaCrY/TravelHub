// screens/MapScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDarkMode } from './DarkModeContext';

export default function HomepageScreen() {
const { isDarkMode, toggleDarkMode } = useDarkMode();
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF',}]}>
      <Text style={{color: isDarkMode ? '#FFFDF3' : '#000000'  }}>Homepage</Text>
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
