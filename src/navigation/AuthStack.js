import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SignInScreen, SignUpScreen, StartingScreen } from '../screens/auth/';

const AuthStack = createStackNavigator();

export default function AuthStackNavigator() {
  return (
    <AuthStack.Navigator initialRouteName="Welcome">
      <AuthStack.Screen
        name="Welcome"
        component={StartingScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen name="SignIn" options={{ headerShown: false }}>
        {props => <SignInScreen />}
      </AuthStack.Screen>
      <AuthStack.Screen name="SignUp" options={{ headerShown: false }}>
        {props => <SignUpScreen />}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  );
}
