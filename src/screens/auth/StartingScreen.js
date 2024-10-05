import React from 'react';
import { View, Text } from 'react-native';
import Button from '../../components/Button';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../styles/styles';
import { useDarkMode } from '../../context/DarkModeContext';

export default function StartingScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TravelHub</Text>
      <Text style={styles.subtitle}>Welcome to our App!</Text>
      <View style={styles.buttonView}>
        <Button mode='contained' onPress={() => navigation.navigate('SignIn')}>
          Sign In
        </Button>
        <Button mode='contained' onPress={() => navigation.navigate('SignUp')}>
          Sign Up
        </Button>
      </View>
    </View>
  );
}
