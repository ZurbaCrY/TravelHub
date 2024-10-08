import React, { useState } from 'react';
import { View, Text, StyleSheet, } from 'react-native';
import { useDarkMode } from './DarkModeContext';
import Button from '../components/Button';
import AuthService from '../User-Auth/auth'
import AnimatedSwitch from '../components/AnimatedSwitch';
import PropTypes from 'prop-types';

const SettingsScreen = ({ setUser, setLoading }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode(); // Verwende den globalen Dark Mode State
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleSignOut = async () => {
    try {
      setLoading(true, "Signing Out");
      const user = await AuthService.signOut();
      setUser(user);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
      <Text style={[styles.header, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>Einstellungen</Text>

      <View style={styles.setting}>
        <Text style={[styles.settingLabel, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>Darkmode</Text>
        <AnimatedSwitch
          onValueChange={toggleDarkMode}
          value={isDarkMode}
        />
      </View>

      <View style={styles.setting}>
        <Text style={[styles.settingLabel, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>Benachrichtigungen</Text>
        <AnimatedSwitch
          onValueChange={() => setNotificationsEnabled(previousState => !previousState)}
          value={notificationsEnabled}
        />
      </View>

      <View>
        <Button mode="contained" onPress={handleSignOut}>
          Sign out
        </Button>
      </View>
    </View>
  );
};

SettingsScreen.propTypes = {
  setUser: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
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
    marginTop: 20,
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
