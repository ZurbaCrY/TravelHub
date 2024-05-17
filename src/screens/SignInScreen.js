import React, { useState } from "react";
import {
  Alert,
  View,
  TouchableOpacity,
} from "react-native";
import { Input, Switch, Text } from "react-native-elements";
import { useNavigation } from "@react-navigation/native";
import { styles } from '../style/styles';
import Button from "../components/Button";
import AuthService from "../User-Auth/auth"

export default function SigninScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [click, setClick] = useState(false);

  const handleSignIn = async () => {
    await AuthService.signIn(email, password);
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
          Don't have an account? Sign Up instead
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
          <Switch
            value={click}
            onValueChange={setClick}
            trackColor={{ true: "green", false: "gray" }}
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

