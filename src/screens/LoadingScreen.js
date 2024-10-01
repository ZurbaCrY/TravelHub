import React from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import PropTypes from 'prop-types';
import { styles } from '../style/styles.js'; // Relativer Pfad

const LoadingScreen = ({ loadingMessage }) => {
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
