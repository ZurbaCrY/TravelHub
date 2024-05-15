import React, { useState } from 'react';
import { View, TouchableOpacity, ActivityIndicator} from 'react-native';
import { Button, Input, Text } from 'react-native-elements';
import { signUp } from '../User-Auth/auth';
import { styles } from '../styles/styles';

export default function SignUpScreen({ navigation }) {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSignUp = async () => {
    setLoading(true);
    try {
      // Additional validation if needed
      if (password !== confirmPassword) {
        throw new Error('Passwords do not match');
      }

      // Call signUp function for Supabase sign-up logic
      await signUp(username, email, password);
      // Handle successful sign-up, e.g., navigate to another screen
    } catch (error) {
      console.error('Sign-up error:', error.message);
      // Handle error, e.g., display error message to the user
    }
    setLoading(false);
  };

  const authSwitch = () => {
    navigation.navigate("SignInScreen");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      <TouchableOpacity style={styles.authSwitchTouchable} onPress={authSwitch}>
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
        <Button title="Sign Up" disabled={loading} onPress={handleSignUp} style={styles.button} />
        {loading && (
          <ActivityIndicator size="large" color="#0000ff" style={styles.loadingIndicator} />
        )}
      </View>
    </View>
  );
}

