import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../styles/styles';
import { useDarkMode } from '../../context/DarkModeContext';
import CustomButton from '../../components/CustomButton';

export default function StartingScreen() {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>TravelHub</Text>
      <Text style={styles.subtitle}>Welcome to our App!</Text>
      <View style={styles.buttonView}>
        <CustomButton 
        onPress={() => navigation.navigate('SignIn')}
        title={'Sign In'} 
        />
        <CustomButton
        onPress={() => navigation.navigate('SignUp')}
        title={'Sign Up'}
        />
      </View>
    </View>
  );
}
