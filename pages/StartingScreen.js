import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Button } from 'react-native-elements';
import { useNavigation } from '@react-navigation/native';

export default function StartingScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TravelHub</Text>
      <Text style={styles.subtitle}>Welcome to our App!</Text>
      <View style={styles.buttonView}>
        <Button
          title="Sign In"
          onPress={() => navigation.navigate('SignInScreen')}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />
        <Button
          title="Sign Up"
          onPress={() => navigation.navigate('SignUpScreen')}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    textTransform: 'uppercase',
    marginBottom: 40,
    color: '#3EAAE9',
  },
  subtitle: {
    fontSize: 20,
    marginBottom: 40,
    color: '#3EAAE9',
  },
  buttonView: {
    width: '80%',
  },
  button: {
    height: 45,
    borderRadius: 7,
    marginBottom: 20,
  },
  buttonText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
