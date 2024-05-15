import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../style/styles';

export default function StartingScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TravelHub</Text>
      <Text style={styles.subtitle}>Welcome to our App!</Text>
      <View style={styles.buttonView}>
        <Button onPress={() => navigation.navigate('SignInScreen')}>
          Sign In
        </Button>
        <Button onPress={() => navigation.navigate('SignUpScreen')}>
          Sign Up
        </Button>
      </View>
    </View>
  );
}