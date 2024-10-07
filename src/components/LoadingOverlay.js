import React from 'react';
import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useLoading } from '../context/LoadingContext';

const LoadingOverlay = () => {
  const { loading, loadingMessage } = useLoading();  // Access loading state and message

  if (!loading) return null;  // If not loading, return nothing

  return (
    <View style={styles.overlay}>
      <ActivityIndicator size="large" color="#ffffff" />
      {loadingMessage && <Text style={styles.message}>{loadingMessage}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  message: {
    color: '#ffffff',
    fontSize: 16,
    marginTop: 20,
  },
});

export default LoadingOverlay;
