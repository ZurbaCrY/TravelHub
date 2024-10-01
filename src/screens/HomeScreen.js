import React from 'react';
import { View, Text } from 'react-native';
import { useDarkMode } from './DarkModeContext';
import AuthService from '../User-Auth/auth';
import { styles } from '../style/styles'; // Importiere die zentralisierten Styles

export default function HomepageScreen() {
  const { isDarkMode } = useDarkMode();
  const user = AuthService.getUser();

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
      <Text style={{ color: isDarkMode ? '#FFFDF3' : '#000000' }}>{user.email}</Text>
    </View>
  );
}
