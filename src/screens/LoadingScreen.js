import React from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';


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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;
