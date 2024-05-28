import React from 'react';
import { Text, View, ActivityIndicator, StyleSheet } from 'react-native';

const LoadingScreen = ({ loadingMessage }) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color="#3EAAE9" />
      <Text>{loadingMessage}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default LoadingScreen;
