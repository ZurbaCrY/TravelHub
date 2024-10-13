import React from 'react';
import { View, Text } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { styles } from '../../styles/styles';
import { useDarkMode } from '../../context/DarkModeContext';
import CustomButton from '../../components/CustomButton';
import { useTranslation } from 'react-i18next';

export default function StartingScreen() {
  const { t } = useTranslation();
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {t('TRAVELHUB')}
      </Text>
      <Text style={styles.subtitle}>
        {t('WELCOME')}
      </Text>
      <View style={styles.buttonView}>
        <CustomButton
          onPress={() => navigation.navigate('SignIn')}
          title={t('AUTH.SIGN_IN')}
        />
        <CustomButton
          onPress={() => navigation.navigate('SignUp')}
          title={t('AUTH.SIGN_UP')}
        />
      </View>
    </View>
  );
}
