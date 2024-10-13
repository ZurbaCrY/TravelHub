import React, { useState } from "react";
import {
  Alert,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { Input } from "react-native-elements";
import styles from '../../styles/style';
import AuthService from "../../services/auth";
import AnimatedSwitch from "../../components/AnimatedSwitch";
import { useNavigation } from "@react-navigation/core";
import { useDarkMode } from '../../context/DarkModeContext';
import { useLoading } from "../../context/LoadingContext";
import CustomButton from "../../components/CustomButton";
import { useTranslation } from "react-i18next";
import { useAuth } from "../../context/AuthContext";
import FriendService from "../../services/friendService";

const SignInScreen = ({ navigation }) => {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  const { loadUser } = useAuth();

  navigation = useNavigation();

  const handleSignIn = async () => {
    try {
      showLoading(t('LOADING_MESSAGE.SIGN_IN'));
      const user = await AuthService.signIn(email, password, remember);
      await loadUser();
      if (user) {
        FriendService.setUser(user);
        navigation.navigate("Main");
      }
    } catch (error) {
      Alert.alert(t('AUTH.SIGN_IN_ERROR'), t('AUTH.SIGN_IN_ERROR_MESSAGE'));
      console.error('Sign-in error:', error);
    } finally {
      hideLoading();
    }
  };

  const handleForgetPasswordPress = () => {
    Alert.alert(t('FEATURE NOT IMPLEMENTED'));
  };

  const authSwitchToSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <View style={styles.centeredContainer}>
      <Text style={styles.titleTextBlue}>
        {t('AUTH.SIGN_IN')}
      </Text>
      <TouchableOpacity onPress={authSwitchToSignUp}>
        <Text style={styles.blueText}>
          {t('AUTH.NAVIGATE_SIGN_UP')}
        </Text>
      </TouchableOpacity>
      <View style={styles.inputView}>
        <Input
          style={styles.container}
          label={t('AUTH.EMAIL')}
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={setEmail}
          value={email}
          placeholder={t('AUTH.EMAIL_PLACEHOLDER')}
          autoCapitalize={"none"}
          containerStyle={styles.inputLogin}
        />
        <Input
          style={styles.container}
          label={t('AUTH.PASSWORD')}
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          placeholder={t('AUTH.PASSWORD_PLACEHOLDER')}
          autoCapitalize={"none"}
          containerStyle={styles.inputLogin}
        />
      </View>
      <View style={styles.rememberView}>
        <View style={styles.switch}>
          <AnimatedSwitch
            value={remember}
            onValueChange={setRemember}
          />
          <Text style={styles.smallBodyText}>
            {t('AUTH.REMEMBER_ME')}
          </Text>
        </View>
        <TouchableOpacity onPress={handleForgetPasswordPress}>
          <Text style={styles.blueText}>
            {t('AUTH.FORGOT_PASSWORD')}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonView}>
        <CustomButton
          onPress={handleSignIn}
          title={t('AUTH.SIGN_IN')}
        />
      </View>
    </View>
  );
};

export default SignInScreen;
