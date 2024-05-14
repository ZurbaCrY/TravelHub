import React, { useState } from 'react'
import { Alert, AppState } from 'react-native'
import { supabase } from './supabase'
import LoadingScreen from '../pages/LoadingScreen'

// Registering auto-refresh for Supabase Auth when app state changes
AppState.addEventListener('change', (state) => {
    if (state === 'active') {
        supabase.auth.startAutoRefresh()
    } else {
        supabase.auth.stopAutoRefresh()
    }
})

export async function signInWithEmail(email, password) {
    try {
        const { error } = await supabase.auth.signInWithPassword({email, password})

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

export async function signOut() {
    try {
        const { error } = await supabase.auth.signOut()
        if (error) {
            Alert.alert(error.message)
            return false
        }

        return true
    } catch (error) {
        Alert.alert('Error signing out')
        return false
    }
}