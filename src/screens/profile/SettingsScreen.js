import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Alert, TouchableWithoutFeedback } from 'react-native';
import { useDarkMode } from '../../context/DarkModeContext';
import AuthService from '../../services/auth';
import AnimatedSwitch from '../../components/AnimatedSwitch';
import styles from '../../styles/style';
import newStyle from '../../styles/style';
import { handleFilePicker, handleNewProfilePicture } from '../../backend/community';
import { useLoading } from '../../context/LoadingContext';
import CustomButton from '../../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';
import { useAuth } from '../../context/AuthContext';
import i18n from '../../assets/i18n/i18n';
import { useTranslation } from 'react-i18next';
import { handleAnonymousModeToggle } from '../../backend/Profile';
import { supabase } from '../../services/supabase';
import userDataHandler from '../../services/userDataHandler';

const SettingsScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const { loadUser } = useAuth();  
  const [anonymousEnabled, setAnonymousEnabled] = useState(false);
  const { user } = useAuth();

  const { t } = useTranslation();
  const [language, setLanguage] = useState('en');

  const languages = [
    { label: "English", value: "en" },
    { label: "Deutsch", value: "de" },
    { label: "Español", value: "es" },
    { label: "Français", value: "fr" },
    { label: "Italiano", value: "it" },
    { label: "中文", value: "zh" }
  ];
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    const fetchAnonymousStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('users')
          .select('anonymous')
          .eq('user_id', user.id)
          .single();

        if (error) {
          console.error('Error fetching anonymous status:', error.message);
        } else {
          setAnonymousEnabled(data.anonymous);
        }
      } catch (error) {
        console.error('Unexpected error:', error.message);
      }
    };

    fetchAnonymousStatus();
  }, []);


  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        showLoading(t('LOADING_MESSAGE.FETCHING_LANGUAGE'));
        const language = await AsyncStorage.getItem('language');
        if (language) {
          setSelectedLanguage(String(language));
          i18n.changeLanguage(language);
        }
      } catch (error) {
        console.error('Error fetching language:', error);
      } finally {
        hideLoading();
      };
    };

    navigation.setOptions({ title: t('SCREENS.SETTINGS.TITLE'),
      headerStyle: {
        backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8'  // Hintergrundfarbe des Headers
      },
      headerTitleStyle: {
        color: isDarkMode ? '#f8f8f8' : '#18171c'  // Textfarbe des Titels
      },
      headerTintColor: isDarkMode ? '#f8f8f8' : '#18171c'  // Farbe des "Zurück"-Pfeils
    });
    fetchLanguage();
  }, [isDarkMode]);  // Füge isDarkMode als Abhängigkeit hinzu
  

  const handleSignOut = async () => {
    Alert.alert(
      t('SCREENS.SETTINGS.LOGOUT_CONFIRM_TITLE'),
      t('SCREENS.SETTINGS.LOGOUT_CONFIRM_MESSAGE'),
      [
        {
          text: t('CANCEL'),
          onPress: () => console.log('Logout cancelled'),
          style: 'cancel',
        },
        {
          text: t('CONFIRM'),
          onPress: async () => {
            try {
              showLoading(t('LOADING_MESSAGE.SIGN_OUT'));
              await AuthService.signOut();
              await loadUser();
              await userDataHandler.removeUserData();
              navigation.navigate('Welcome');
            } catch (error) {
              console.error('Error signing out:', error);
            } finally {
              hideLoading();
            }
          },
        },
      ],
      { cancelable: false }
    );
  };

  const handleImageChange = async () => {
    const image = await handleFilePicker();
    if (image) {
      setImageUrl(image);
      setModalVisible(true);
    }
  };

  const languageSwitch = async (pressedLanguage) => {
    try {
      showLoading(t('LOADING_MESSAGE.CHANGING_LANGUAGE'));
      await AsyncStorage.setItem('language', pressedLanguage);
      setSelectedLanguage(pressedLanguage);
      i18n.changeLanguage(pressedLanguage);
      Alert.alert(t('SCREENS.SETTINGS.SUCCESS'), t('SCREENS.SETTINGS.LANGUAGE_CHANGE_SUCCESS'));
      navigation.setOptions({ title: t('SCREENS.SETTINGS.TITLE'),
        headerStyle: {
          backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8'  // Hintergrundfarbe des Headers
        },
        headerTitleStyle: {
          color: isDarkMode ? '#f8f8f8' : '#18171c'  // Textfarbe des Titels
        },
        headerTintColor: isDarkMode ? '#f8f8f8' : '#18171c'  // Farbe des "Zurück"-Pfeils
      });
    } catch (error) {
      Alert.alert(t('SCREENS.SETTINGS.ERROR'), t('SCREENS.SETTINGS.LANGUAGE_CHANGE_ERROR'));
      console.error('Language change error:', error);
    } finally {
      hideLoading();
    }
  }

  return (
    <View style={[styles.containerNoMarginTop, { backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8' }]}>
      <View style={styles.rowMarginBottom}>
        <Text style={[styles.bodyTextBig, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>{t('SCREENS.SETTINGS.CHANGE_PROFILE_PICTURE')} </Text>
        <TouchableOpacity onPress={handleImageChange}>
          <Image source={require('../../assets/images/picture.png')} style={styles.iconBig} />
        </TouchableOpacity>
      </View>

      <View style={styles.rowMarginBottom}>
        <Text style={[styles.bodyTextBig, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>{t('SCREENS.SETTINGS.DARKMODE')}</Text>
        <AnimatedSwitch
          onValueChange={toggleDarkMode}
          value={isDarkMode}
        />
      </View>

      <View style={styles.rowMarginBottom}>
        <Text style={[styles.bodyTextBig, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>
          Anonymous Mode
        </Text>
        <AnimatedSwitch
          onValueChange={(value) => {
            setAnonymousEnabled(value);  
            handleAnonymousModeToggle(value, user.id);  
          }}
          value={anonymousEnabled}  
        />
      </View>

      <View style={styles.rowMarginBottom}>
        <Text style={[styles.bodyTextBig, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>{t('SCREENS.SETTINGS.NOTIFICATIONS')}</Text>
        <AnimatedSwitch
          onValueChange={() => setAnonymousEnabled(previousState => !previousState)}
          value={notificationsEnabled}
        />
      </View>

      <View style={styles.rowMarginBottom}>
        <Text style={[styles.bodyTextBig, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>{t('SCREENS.SETTINGS.LANGUAGE')}</Text>
        <Picker
          selectedValue={selectedLanguage}
          style={{ height: 50, width: 150, color: isDarkMode ? '#f8f8f8' : '#18171c' }}
          onValueChange={(itemValue) => languageSwitch(itemValue)}
        >
          {languages.map((language, index) => (
            <Picker.Item key={index} label={language.label} value={language.value} />
          ))}
        </Picker>
      </View>

      <View>
        <CustomButton
          title={t('SCREENS.SETTINGS.LOGOUT')}
          onPress={handleSignOut}
        />
      </View>

      {/* Modal für die Bildvorschau */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={styles.modalContent}>
                <Text style={styles.modalTitleText}>{t('SCREENS.SETTINGS.CHANGE_PROFILE_PICTURE')}</Text>

                {imageUrl && (
                  <Image source={{ uri: imageUrl }} style={styles.postImage} />
                )}
                <View style={styles.row}>

                  <TouchableOpacity style={styles.averageRedButton} onPress={() => setModalVisible(false)}>
                    <Text style={styles.smallButtonText}>{t('SCREENS.SETTINGS.CANCEL')}</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.averageBlueButton}
                    onPress={async () => {
                      const success = await handleNewProfilePicture(imageUrl);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.smallButtonText}>{t('SCREENS.SETTINGS.POST')}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

    </View>
  );
};

export default SettingsScreen;