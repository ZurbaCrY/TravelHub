import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {
  const [currentPage, setCurrentPage] = useState('Home');

  const renderPage = () => {
    switch (currentPage) {
      case 'Map':
        return <View style={styles.pageContainer}><Text>Map Page</Text></View>;
      case 'Community':
        return <View style={styles.pageContainer}><Text>Community Page</Text></View>;
      case 'Profile':
        return <View style={styles.pageContainer}><Text>Profile Page</Text></View>;
      case 'Settings':
        return <View style={styles.pageContainer}><Text>Settings Page</Text></View>;
      default:
        return <View style={styles.pageContainer}><Text>Home Page</Text></View>;
    }
  };

  return (
    <View style={styles.container}>
      {renderPage()}
      <View style={styles.buttonContainer}>
        <Button title="Map" onPress={() => setCurrentPage('Map')} />
        <Button title="Community" onPress={() => setCurrentPage('Community')} />
        <Button title="Profile" onPress={() => setCurrentPage('Profile')} />
        <Button title="Settings" onPress={() => setCurrentPage('Settings')} />
      </View>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#BFD7EA',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#0B3954',
    paddingVertical: 10,
  },
  pageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
