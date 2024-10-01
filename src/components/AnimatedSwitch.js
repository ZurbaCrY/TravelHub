import React, { useState, useEffect } from 'react';
import { View, TouchableOpacity, Animated } from 'react-native';
import PropTypes from 'prop-types';
import { styles } from '../style/styles.js'; // Relativer Pfad

const AnimatedSwitch = ({ value, onValueChange }) => {
  const [animValue] = useState(new Animated.Value(value ? 1 : 0));

  useEffect(() => {
    Animated.timing(animValue, {
      toValue: value ? 1 : 0,
      duration: 300,
      useNativeDriver: true,
    }).start();
  }, [value]);

  const toggleSwitch = () => {
    onValueChange && onValueChange(!value);
  };

  const translateX = animValue.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 22],
  });

  return (
    <TouchableOpacity onPress={toggleSwitch} activeOpacity={0.8}>
      <View style={styles.buttonViewAnimatedSwitch}>
        <View style={[styles.containerAnimatedSwitch, value && styles.containerActiveAnimatedSwitch]}>
          <View style={[styles.backgroundAnimatedSwitch, value && styles.backgroundActiveAnimatedSwitch]} />
          <Animated.View
            style={[styles.circleAnimatedSwitch, { transform: [{ translateX }] }]}
          />
        </View>
      </View>
    </TouchableOpacity>
  );
};

AnimatedSwitch.propTypes = {
  value: PropTypes.bool.isRequired,
  onValueChange: PropTypes.func.isRequired,
};

export default AnimatedSwitch;
