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
import { useAuth } from '../../context/AuthContext';
import FriendService from '../../services/friendService';

const SignUpScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const { showLoading, hideLoading } = useLoading();
  const { t } = useTranslation();
  const { loadUser } = useAuth();

  const navigation = useNavigation();

  const handleSignUp = async () => {
    if (password !== confirmPassword) {
      Alert.alert(t('AUTH.PASSWORDS_NOT_MATCH'), t('AUTH.PASSWORDS_NOT_MATCH_MESSAGE'));
      return;
    }

    try {
      showLoading(t('LOADING_MESSAGE.SIGN_UP'));
      const user = await AuthService.signUp(username, email, password, confirmPassword);
      await loadUser();
      await FriendService.initialize();
      if (user) {
        navigation.navigate('EditProfile');
      }
    } catch (error) {
      Alert.alert(t('SIGN_UP_ERROR'), t('SIGN_UP_ERROR_MESSAGE'));
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
      <Text style={styles.titleTextBlue}>
        {t('AUTH.SIGN_UP')}
      </Text>
      <TouchableOpacity style={styles.authSwitchTouchable} onPress={authSwitchToSignIn}>
        <Text style={styles.blueText}>
          {t('AUTH.NAVIGATE_SIGN_IN')}
        </Text>
      </TouchableOpacity>
      <View style={styles.inputView}>
        <Input
          label={t('AUTH.USERNAME')}
          leftIcon={{ type: 'font-awesome', name: 'user' }}
          onChangeText={setUsername}
          value={username}
          placeholder={t('AUTH.USERNAME_PLACEHOLDER')}
          autoCapitalize="none"
          containerStyle={styles.inputLogin}
        />
        <Input
          label={t('AUTH.EMAIL')}
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={setEmail}
          value={email}
          placeholder={t('AUTH.EMAIL_PLACEHOLDER')}
          autoCapitalize="none"
          containerStyle={styles.inputLogin}
        />
        <Input
          label={t('AUTH.PASSWORD')}
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          placeholder={t('AUTH.PASSWORD_PLACEHOLDER')}
          autoCapitalize="none"
          containerStyle={styles.inputLogin}
        />
        <Input
          label={t('AUTH.CONFIRM_PASSWORD')}
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          secureTextEntry
          placeholder={t('AUTH.CONFIRM_PASSWORD_PLACEHOLDER')}
          autoCapitalize="none"
          containerStyle={styles.inputLogin}
        />
      </View>
      <View style={styles.buttonView}>
        <CustomButton
          onPress={handleSignUp}
          title={t('AUTH.SIGN_UP')}
        />
      </View>
    </View>
  );
}

export default SignUpScreen;