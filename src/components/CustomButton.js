import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import { styles } from '../styles/styles';

const CustomButton = ({
  onPress,
  title,
  style,
  textStyle,
  isLoading = false,
  disabled = false,
  loadingColor = '#fff',
}) => {
  return (
    <View style={[styles.buttonWrapper, disabled && styles.disabledWrapper]}>
      <TouchableOpacity
        style={[
          styles.newPostButton,
          style,
          disabled && styles.disabledButton
        ]}
        onPress={onPress}
        activeOpacity={0.8}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={loadingColor} />
        ) : (
          <Text style={[styles.newPostButtonText, textStyle]}>{title}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;
