import React, { useState } from 'react';
import { View, TouchableOpacity, Text } from 'react-native';
import { Input } from 'react-native-elements';
import styles from '../../styles/style';
import AuthService from '../../services/auth';
import { useNavigation } from '@react-navigation/core';
import { useDarkMode } from '../../context/DarkModeContext';
import { useLoading } from '../../context/LoadingContext';
import CustomButton from '../../components/CustomButton';
import { useTranslation } from 'react-i18next';

const SignUpScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { showLoading, hideLoading } = useLoading();
  const { t } = useTranslation();

  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert("Passwords do not match", "Please ensure both passwords are the same.");
      return;
    }

    try {
      showLoading(t('LOADING_MESSAGE.SIGN_UP'));
      const user = await AuthService.signUp(username, email, password, confirmPassword);
    } catch (error) {
      Alert.alert("Sign-Up Error", "An error occurred during sign-up. Please try again.");
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  const authSwitchToSignIn = () => {
    navigation.navigate("SignIn");
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
        <CustomButton
          onPress={handleSignUp}
          title={"Sign Up"}
        />
      </View>
    </View>
  );
}

export default SignUpScreen;