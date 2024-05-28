import React, { useState } from "react";
import { Alert, AppState } from "react-native";
import { supabase } from "../User-Auth/supabase";
import LoadingScreen from "../screens/LoadingScreen";

// Registering auto-refresh for Supabase Auth when app state changes
AppState.addEventListener("change", (state) => {
  if (state === "active") {
    supabase.auth.startAutoRefresh();
  } else {
    supabase.auth.stopAutoRefresh();
  }
});

export async function signInWithEmail(email, password) {
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      Alert.alert(error.message);
      return false;
    }

    return true;
  } catch (error) {
    Alert.alert("Error signing in");
    console.log(error);
    return false;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) {
      Alert.alert(error.message);
      return false;
    }
    return true;
  } catch (error) {
    Alert.alert("Error signing out");
    return false;
  }
}

export async function signUp(username, email, password, confirmPassword) {
  if (password !== confirmPassword) {
    alert.alert('Error', 'Passwords do not match')
    return false;
  }

  try {
    const { data: usernameData, error: usernameError } = await supabase
      .from("users")
      .select("id")
      .eq("username", username);

    if (usernameData && usernameData.length > 0) {
      throw new Error("Username is already taken");
    }

    // Check if email is unique
    const { data: emailData, error: emailError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email);

    if (emailData && emailData.length > 0) {
      throw new Error("Email is already taken");
    }

    // Sign up the user
    const { user, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      throw new Error(error.message);
    }

    return { success: true, message: "Sign up successful!" };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
