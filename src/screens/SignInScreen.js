import React, { useState } from "react";
import {
  Alert,
  View,
  TouchableOpacity,
} from "react-native";
import { Input, Text } from "react-native-elements";
// import { useNavigation } from "@react-navigation/native";
import { styles } from '../style/styles';
import Button from "../components/Button";
import AuthService from "../User-Auth/auth"
import AnimatedSwitch from "../components/AnimatedSwitch";
import PropTypes from 'prop-types';

const SignInScreen = ({ navigation, setUser, setLoading }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);

  const handleSignIn = async () => {
    try {
      setLoading(true, "Signing in")
      const user = await AuthService.signIn(email, password, remember);
      setUser(user);
    } catch (error) {
      throw Error;
    } finally {
      setLoading(false);
    }
  };

  const handleForgetPasswordPress = () => {
    Alert.alert("This Feature is not implemented yet. Please contact Support!");
  };

  const authSwitchToSignUp = () => {
    navigation.navigate("SignUpScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TouchableOpacity style={styles.authSwitchTouchable} onPress={authSwitchToSignUp}>
        <Text style={styles.switchText}>
          Dont have an account? Sign Up instead
        </Text>
      </TouchableOpacity>
      <View style={styles.inputView}>
        <Input
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
          containerStyle={styles.input}
        />
        <Input
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
          containerStyle={styles.input}
        />
      </View>
      <View style={styles.rememberView}>
        <View style={styles.switch}>
          <AnimatedSwitch
            value={remember}
            onValueChange={setRemember}
            // trackColor={{ true: "green", false: "gray" }}
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
}

SignInScreen.propTypes = {
  navigation: PropTypes.object.isRequired,
  setUser: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired
};

export default SignInScreen;
