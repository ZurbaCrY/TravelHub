import React from 'react';
import { TouchableOpacity, Text, View, ActivityIndicator } from 'react-native';
import newStyle from '../styles/style';

const CustomButton = ({
  onPress,
  title,
  style,
  wrapperStyle,
  textStyle,
  isLoading = false,
  disabled = false,
  loadingColor = '#fff',
}) => {
  return (
    <View style={[newStyle.buttonWrapper, wrapperStyle, disabled && newStyle.disabledButtonWrapper]}>
      <TouchableOpacity
        style={[
          newStyle.primaryButton,
          style,
          disabled && newStyle.disabledButton
        ]}
        onPress={onPress}
        activeOpacity={0.8}
        disabled={disabled || isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color={loadingColor} />
        ) : (
          <Text style={[newStyle.primaryButtonText, textStyle]}>{title}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default CustomButton;
