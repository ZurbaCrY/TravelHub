import React, { useState } from "react";
import {
  Alert,
  View,
  ActivityIndicator,
  TouchableOpacity,
} from "react-native";
import { Button, Input, Switch, Text } from "react-native-elements";
import { signInWithEmail } from "../User-Auth/auth";
import { useNavigation } from "@react-navigation/native";
import { styles } from '../styles/styles';

export default function SigninScreen() {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [click, setClick] = useState(false);

  const handleSignIn = async () => {
    setLoading(true);
    const success = await signInWithEmail(email, password);
    setLoading(false);
  };

  const handleForgetPasswordPress = () => {
    Alert.alert("This Feature is not implemented yet. Please contact Support!");
  };

  const authSwitch = () => {
    navigation.navigate("SignUpScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <TouchableOpacity style={styles.authSwitchTouchable} onPress={authSwitch}>
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
        <Button
          title="Sign In"
          style={styles.button}
          disabled={loading}
          onPress={handleSignIn}
          buttonStyle={styles.button}
          titleStyle={styles.buttonText}
        />
        {loading && (
          <ActivityIndicator
            size="large"
            color="#0000ff"
            style={styles.loadingIndicator}
          />
        )}
      </View>
    </View>
  );
}

