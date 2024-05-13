import React, { useState } from "react";
import { View, StyleSheet, Text, SafeAreaView } from "react-native";
import { Button, Input } from "react-native-elements";

export default function StartingScreen() {
  <SafeAreaView>
    <Text style={styles.title}>TravelHub</Text>
    <Text style={styles.subtitle}>Welcome to our App!</Text>
    <View>
      <Button style={styles.authButton}>Sign In here!</Button>
      <Button style={styles.authButton}>Sign Up here!</Button>
    </View>
  </SafeAreaView>
}

const styles = StyleSheet.create({
  title: {
    fontSize: 28,
  },
})