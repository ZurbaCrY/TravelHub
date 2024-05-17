// screens/MapScreen.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useDarkMode } from './DarkModeContext';
import AuthService from '../User-Auth/auth';
import Button from "../components/Button";
import LoadingScreen from './LoadingScreen';
import { useState, useEffect } from "react";

export default function HomepageScreen() {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);


  if(AuthService.session) {
    setSession(AuthService.session);
    setLoading(false);
 }
  


  if(loading) {
    return(
      <LoadingScreen />
    )
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF',}]}>
      <Text style={{color: isDarkMode ? '#FFFDF3' : '#000000'  }}>test</Text>
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
