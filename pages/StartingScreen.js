import React, { useState } from "react";
import { View, StyleSheet, Text, TouchableOpacity } from "react-native";
import { Button, Input } from "react-native-elements";
import { useNavigation } from "@react-navigation/native"; // Importiere useNavigation

export default function StartingScreen() {
  const navigation = useNavigation(); // Navigation Hook

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TravelHub</Text>
      <Text style={styles.subtitle}>Welcome to our App!</Text>
      <View style={styles.container}>
        <TouchableOpacity
          onPress={() => navigation.navigate("SignInScreen")}
          style={styles.navButton}
        >
          <Text style={styles.navButtonText}>Sign In here!</Text>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate("SignUpScreen")}
          style={styles.navButton}
        >
          <Text style={styles.navButtonText}>Sign Up here!</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    paddingTop: 70,
  },
  image: {
    height: 160,
    width: 170,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    textTransform: "uppercase",
    textAlign: "center",
    paddingVertical: 40,
    color: "#3EAAE9",
  },
  button: {
    backgroundColor: "red",
    height: 45,
    borderColor: "gray",
    borderWidth: 1,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  buttonView: {
    width: "100%",
    paddingHorizontal: 50,
  },
});
