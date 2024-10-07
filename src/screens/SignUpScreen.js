import React, { useState } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Input, Text } from 'react-native-elements';
import styles from '../styles/style';
import Button from '../components/Button';
import AuthService from '../services/auth';
import PropTypes from 'prop-types';
import { useDarkMode } from '../context/DarkModeContext';

const SignUpScreen = ({ navigation, setUser, setLoading }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match", "Please ensure both passwords are the same.");
      return;
    }

    try {
      setLoading(true, "Signing Up");
      const user = await AuthService.signUp(username, email, password, confirmPassword);
      setUser(user);
    } catch (error) {
      Alert.alert("Sign-Up Error", "An error occurred during sign-up. Please try again.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const authSwitchToSignIn = () => {
    navigation.navigate("SignInScreen");
  };

  return (
    <View style={styles.centeredContainer}>
      <Text style={styles.titleTextBlue}>Sign Up</Text>
      <TouchableOpacity style={styles.authSwitchTouchable} onPress={authSwitchToSignIn}>
        <Text style={styles.blueText}>
          Already have an account? Sign In instead
        </Text>
      </TouchableOpacity>
      <View style={styles.inputView}>
        <Input
          label="Username"
          leftIcon={{ type: 'font-awesome', name: 'user' }}
          onChangeText={setUsername}
          value={username}
          placeholder="Give yourself a Username"
          autoCapitalize="none"
          containerStyle={styles.inputLogin}
        />
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={setEmail}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
          containerStyle={styles.inputLogin}
        />
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          containerStyle={styles.inputLogin}
        />
        <Input
          label="Confirm Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          secureTextEntry
          placeholder="Confirm Password"
          autoCapitalize="none"
          containerStyle={styles.inputLogin}
        />
      </View>
      <View style={styles.buttonView}>
        <Button mode='contained' onPress={handleSignUp}>
          Sign Up
        </Button>
      </View>
    </View>
  );
}

SignUpScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired
};

export default SignUpScreen;
