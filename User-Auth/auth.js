import React, { useState } from 'react'
import { Alert, AppState } from 'react-native'
import { supabase } from './supabase'

// Tells Supabase Auth to continuously refresh the session automatically if
// the app is in the foreground. When this is added, you will continue to receive
// `onAuthStateChange` events with the `TOKEN_REFRESHED` or `SIGNED_OUT` event
// if the user's session is terminated. This should only be registered once.
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

export async function signInWithEmail(email, password) {
    try {
        const { error } = await supabase.auth.signInWithPassword({
            email: email,
            password: password,
        })

        if (error) {
            Alert.alert(error.message)
            return false
        }

        return true
    } catch (error) {
        Alert.alert('Error signing in')
        console.log(error)
        return false
    }
}

export async function signUpWithEmail(email, password) {
    try {
        const { error } = await supabase.auth.signUp({
            email: email,
            password: password,
        })

        if (error) {
            Alert.alert(error.message)
            return false
        }

        return true
    } catch (error) {
        Alert.alert('Error signing up')
        return false
    }
}