import { StatusBar } from 'expo-status-bar';
import { View, Text, StyleSheet } from 'react-native';
import 'react-native-url-polyfill/auto'
import { useState, useEffect } from 'react'
import { supabase } from './User-Auth/supabase'
import SignInScreen from './pages/SignIn';
import SignUpScreen from './pages/SignUp';
import { Session } from '@supabase/supabase-js'

export default function App() {
  const {session, setSession} = useState < Session | null > (null)
    
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])


  return (
    <View>
      {session && session.user ? (
        <View style={styles.container}>
          <Text>Open up App.js to start working on your app!</Text>
          <StatusBar style="auto" />
        </View>

      ) : (
        <SignInScreen />
      )
      }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
