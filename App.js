import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';

export default function App() {
  const [currentPage, setCurrentPage] = useState('Map');

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
      case 'Home':
        return <View style={styles.pageContainer}><Text>Home Page</Text></View>;
      default:
        return null;
    }
  };

  const renderTab = (tabName, iconName) => {
    const isActive = currentPage === tabName;
    return (
      <TouchableOpacity
        key={tabName}
        style={[styles.tab, isActive && styles.activeTab]}
        onPress={() => setCurrentPage(tabName)}
      >
        <FontAwesome5 name={iconName} size={24} color={isActive ? '#FFFFFF' : '#9BA3A6'} />
        <Text style={[styles.tabText, isActive && styles.activeTabText]}>{tabName}</Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {renderPage()}
      <View style={styles.tabBar}>
        {renderTab('Home', 'home')}
        {renderTab('Community', 'users')}
        {renderTab('Map', 'map-marker-alt')}
        {renderTab('Profile', 'user')}
        {renderTab('Settings', 'cog')}
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
  pageContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    position: 'absolute',
    bottom: 0,
    backgroundColor: '#0B3954',
    paddingVertical: 10,
  },
  tab: {
    alignItems: 'center',
  },
  activeTab: {
    borderBottomWidth: 2,
    borderColor: '#FFFFFF',
  },
  tabText: {
    color: '#9BA3A6',
    marginTop: 2,
  },
  activeTabText: {
    color: '#FFFFFF',
  },
});
