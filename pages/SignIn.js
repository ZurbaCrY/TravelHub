import React, { useState } from "react";
import { Alert, View, StyleSheet, ActivityIndicator } from "react-native";
import { Button, Input, Switch, Pressable, Text } from "react-native-elements";
import { signInWithEmail } from "../User-Auth/auth";

export default function SigninScreen() {
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

  return (
    //  medium creating a stylish login form in react native
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>
      <View style={styles.inputView}>
        <Input
          style={styles.input}
          label="Email"
          leftIcon={{ type: "font-awesome", name: "envelope" }}
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize={"none"}
        />
        <Input
          label="Password"
          leftIcon={{ type: "font-awesome", name: "lock" }}
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry={true}
          placeholder="Password"
          autoCapitalize={"none"}
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
        <View>
          <Text onPress={handleForgetPasswordPress} style={styles.forgetText}>
            Forgot password?
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <View style={[styles.verticallySpaced, styles.mt20]}>
          <Button title="Sign in" disabled={loading} onPress={handleSignIn} />
        </View>
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

const styles = StyleSheet.create({
  container: {
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: "stretch",
  },
  mt20: {
    marginTop: 20,
  },
});
