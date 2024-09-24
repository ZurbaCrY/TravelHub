import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Animated, StyleSheet } from 'react-native';
import PropTypes from 'prop-types';

const AnimatedSwitch = ({ value, onValueChange }) => {
  const animValue = useRef(new Animated.Value(value ? 1 : 0)).current;

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: value ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [value]);

  const toggleSwitch = () => {
    if (onValueChange) {
      onValueChange(!value);
    }
  };

  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 22],
  });
  
  return (
    <TouchableOpacity onPress={toggleSwitch} activeOpacity={0.8}>
      <View style={styles.buttonView}>
        <View style={[styles.container, value && styles.containerActive]}>
          <View style={[styles.background, value && styles.backgroundActive]} />
          <Animated.View
            style={[styles.circle, { transform: [{ translateX }] }]}
            />
        </View>
      </View>
    </TouchableOpacity>
  );
};

// Definiere PropTypes für value und onValueChange
AnimatedSwitch.propTypes = {
  value: PropTypes.bool.isRequired,
  onValueChange: PropTypes.func.isRequired,
};

const styles = StyleSheet.create({
  buttonView: {
    width: '80%',
    margin: 5,
    marginTop: 0,
    marginBottom: 0,
  },
  container: {
    width: 50,
    height: 28,
    borderRadius: 36.5,
    backgroundColor: '#e0e0e0',
    justifyContent: 'center',
    paddingHorizontal: 2,
  },
  containerActive: {
    backgroundColor: '#3EAAE9',
  },
  background: {
    ...StyleSheet.absoluteFill,
    borderRadius: 36.5,
    backgroundColor: '#bdbdbd',
  },
  backgroundActive: {
    backgroundColor: '#3EAAE9',
  },
  circle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'white',
  },
});

export default AnimatedSwitch;