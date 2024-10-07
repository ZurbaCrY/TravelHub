import React from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { useDarkMode } from '../context/DarkModeContext';
import styles from '../styles/style'; // Relativer Pfad


const LoadingScreen = ({ loadingMessage = 'Loading...' }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3EAAE9" />
      <Text>{loadingMessage}</Text>
    </View>
  );
};

LoadingScreen.propTypes = {
  loadingMessage: PropTypes.string.isRequired,
};

export default LoadingScreen;

