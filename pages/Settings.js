// SettingsScreen.js
import React, { useState } from 'react';
import { View, Text, Switch, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useDarkMode } from './DarkModeContext'; // Importiere den Hook und Context

const SettingsScreen = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode(); // Verwende den globalen Dark Mode State
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
      <Text style={[styles.header, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>Einstellungen</Text>

      <View style={styles.setting}>
        <Text style={[styles.settingLabel, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>Darkmode</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isDarkMode ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={toggleDarkMode}
          value={isDarkMode}
        />
      </View>

      <View style={styles.setting}>
        <Text style={[styles.settingLabel, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>Benachrichtigungen</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={notificationsEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={() => setNotificationsEnabled(previousState => !previousState)}
          value={notificationsEnabled}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 18,
  },
  input: {
    padding: 10,
    borderRadius: 5,
    fontSize: 16,
    flex: 1,
  },
  button: {
    backgroundColor: '#3D52D5',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFDF3',
    fontSize: 18,
  }
});

export default SettingsScreen;
