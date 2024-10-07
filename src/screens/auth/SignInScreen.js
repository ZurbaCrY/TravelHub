import React, { useState } from "react";
import {
  Alert,
  View,
  TouchableOpacity,
  Text,
} from "react-native";
import { Input } from "react-native-elements";
import { styles } from '../../styles/styles';
import Button from "../../components/Button";
import AuthService from "../../services/auth";
import AnimatedSwitch from "../../components/AnimatedSwitch";
import PropTypes from 'prop-types';
import { useNavigation, useNavigationBuilder } from "@react-navigation/core";
import { useDarkMode } from '../../context/DarkModeContext';
import { useLoading } from "../../context/LoadingContext";

const SignInScreen = ({ navigation }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const { showLoading, hideLoading } = useLoading();

  navigation = useNavigation();

  const handleSignIn = async () => {
    try {
      showLoading(true, "Signing in");
      const user = await AuthService.signIn(email, password, remember);
    } catch (error) {
      Alert.alert("Sign-In Error", "Unable to sign in. Please check your credentials and try again.");
      console.error('Sign-in error:', error);
    } finally {
      hideLoading();
    }
  };

  const handleForgetPasswordPress = () => {
    Alert.alert("This Feature is not implemented yet. Please contact Support!");
  };

  const authSwitchToSignUp = () => {
    navigation.navigate("SignUp");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TouchableOpacity style={styles.authSwitchTouchable} onPress={authSwitchToSignUp}>
        <Text style={styles.switchText}>
          Don't have an account? Sign Up instead
        </Text>
      </TouchableOpacity>
      <View style={styles.inputView}>
        <Input
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={setEmail}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
          containerStyle={styles.inputLogin}
        />
        <Input
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={setPassword}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
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
          <Text style={styles.rememberText}>Remember Me</Text>
        </View>
        <TouchableOpacity onPress={handleForgetPasswordPress}>
          <Text style={styles.forgetText}>Forgot password?</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.buttonView}>
        <Button mode='contained' onPress={handleSignIn}>
          Sign In
        </Button>
      </View>
    </View>
  );
};

export default SignInScreen;
