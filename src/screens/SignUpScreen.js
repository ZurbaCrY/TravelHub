import React, { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { Input, Text } from 'react-native-elements';
import { signUp } from '../User-Auth/auth';
import { styles } from '../style/styles';
import Button from '../components/Button';

export default function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    try {
      setLoading(true);
      success = await signUp(username, email, password, confirmPassword)
      setLoading(false);
      // if sign up is successfull switch to login
      // else print message (for cases where no error occured but also no success)
      if (success.success == true) {
        authSwitchToSignIn
      } else {
        console.log(success.message)
      }
    } catch (error) {
      console.error(error)
    }
  };

  const authSwitchToSignIn = () => {
    navigation.navigate("SignInScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TouchableOpacity style={styles.authSwitchTouchable} onPress={authSwitchToSignIn}>
        <Text style={styles.switchText}>
          Already have an account? Sign In instead
        </Text>
      </TouchableOpacity>
      <View style={styles.inputView}>
        <Input
          label="Username"
          leftIcon={{ type: 'font-awesome', name: 'user' }}
          onChangeText={setUsername}
          value={username}
          placeholder="Username"
          autoCapitalize="none"
          containerStyle={styles.input}
        />
        <Input
          label="Email"
          leftIcon={{ type: 'font-awesome', name: 'envelope' }}
          onChangeText={setEmail}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
          containerStyle={styles.input}
        />
        <Input
          label="Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={setPassword}
          value={password}
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          containerStyle={styles.input}
        />
        <Input
          label="Confirm Password"
          leftIcon={{ type: 'font-awesome', name: 'lock' }}
          onChangeText={setConfirmPassword}
          value={confirmPassword}
          secureTextEntry
          placeholder="Confirm Password"
          autoCapitalize="none"
          containerStyle={styles.input}
        />
      </View>
      <View style={styles.buttonView}>
        <Button onPress={handleSignUp}>
          Sign Up
        </Button>
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

