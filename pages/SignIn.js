import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Auth from '../User-Auth/auth'

export default function SignInScreen() {
    return (
        <View style={styles.container}>
            <Text>Sign In</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#BFD7EA',
    },
});