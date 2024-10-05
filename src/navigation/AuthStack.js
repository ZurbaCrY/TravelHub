import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { SignInScreen, SignUpScreen, StartingScreen } from '../screens/auth/';

const AuthStack = createStackNavigator();

export default function AuthStackNavigator({ setUser, setLoadingStatus }) {
  return (
    <AuthStack.Navigator initialRouteName="Welcome">
      <AuthStack.Screen
        name="Welcome"
        component={StartingScreen}
        options={{ headerShown: false }}
      />
      <AuthStack.Screen name="SignIn" options={{ headerShown: false }}>
        {props => <SignInScreen {...props} setUser={setUser} setLoading={setLoadingStatus} />}
      </AuthStack.Screen>
      <AuthStack.Screen name="SignUp" options={{ headerShown: false }}>
        {props => <SignUpScreen {...props} setUser={setUser} setLoading={setLoadingStatus} />}
      </AuthStack.Screen>
    </AuthStack.Navigator>
  );
}
