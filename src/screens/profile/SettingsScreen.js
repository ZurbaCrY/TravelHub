import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Alert, TouchableWithoutFeedback } from 'react-native';
import { useDarkMode } from '../../context/DarkModeContext';
import AuthService from '../../services/auth';
import AnimatedSwitch from '../../components/AnimatedSwitch';
import styles from '../../styles/style';
import { handleFilePicker, handleNewProfilePicture } from '../../backend/community';
import { useLoading } from '../../context/LoadingContext';
import CustomButton from '../../components/CustomButton';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Picker } from '@react-native-picker/picker';


const SettingsScreen = ({ navigation }) => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  const { isDarkMode, toggleDarkMode } = useDarkMode();

  const languages = [
    { label: "English", value: "en" },
    { label: "Deutsch", value: "de" },
    { label: "Español", value: "es" },
    { label: "Français", value: "fr" },
    { label: "中文", value: "zh" }
  ];
  const [selectedLanguage, setSelectedLanguage] = useState('en');

  useEffect(() => {
    const fetchLanguage = async () => {
      try {
        showLoading("Fetching Language");
        const language = await AsyncStorage.getItem('language');
        if (language) {
          setSelectedLanguage(String(language));
        }
      } catch (error) {
        console.error('Error fetching language:', error);
      } finally {
        hideLoading();
      };
    };

    navigation.setOptions({ title: 'settings', headerStyle: { backgroundColor: '#f8f8f8' } });
    fetchLanguage();
  }, []);


  const handleSignOut = async () => {
    try {
      showLoading("Signing Out");
      const user = await AuthService.signOut();
    } catch (error) {
      Alert.alert("Fehler", "Beim Abmelden ist ein Fehler aufgetreten.");
      console.error('Sign-out error:', error);
    } finally {
      hideLoading();
    }
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
      showLoading("Changing Language");
      await AsyncStorage.setItem('language', pressedLanguage);
      setSelectedLanguage(pressedLanguage);
      Alert.alert("Sprache geändert", `Die Sprache wurde erfolgreich geändert.`);
    } catch (error) {
      Alert.alert("Fehler", "Beim Ändern der Sprache ist ein Fehler aufgetreten.");
      console.error('Language change error:', error);
    } finally {
      hideLoading();
    }
  }


  return (
    <View style={[styles.containerNoMarginTop, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
      <Text style={[styles.titleText, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>settings</Text>
      <View style={styles.rowMarginBottom}>
        <Text style={[styles.bodyTextBig, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>Profilbild wechseln </Text>
        <TouchableOpacity onPress={handleImageChange}>
          <Image source={require('../../assets/images/picture.png')} style={styles.iconBig} />
        </TouchableOpacity>
      </View>

      <View style={styles.rowMarginBottom}>
        <Text style={[styles.bodyTextBig, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>Darkmode</Text>
        <AnimatedSwitch
          onValueChange={toggleDarkMode}
          value={isDarkMode}
        />
      </View>

      <View style={styles.rowMarginBottom}>
        <Text style={[styles.bodyTextBig, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>Benachrichtigungen</Text>
        <AnimatedSwitch
          onValueChange={() => setNotificationsEnabled(previousState => !previousState)}
          value={notificationsEnabled}
        />
      </View>

      <View style={styles.rowMarginBottom}>
        <Text style={[styles.bodyTextBig, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>Sprache</Text>
        <Picker
          selectedValue={selectedLanguage}
          style={{ height: 50, width: 150, color: isDarkMode ? '#FFFDF3' : '#000' }}
          onValueChange={(itemValue) => languageSwitch(itemValue)}
        >
          {languages.map((language, index) => (
            <Picker.Item key={index} label={language.label} value={language.value} />
          ))}
        </Picker>
      </View>

      <View>
        <CustomButton
          title={"Sign Out"}
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
                <Text style={styles.modalTitleText}>Profilbild ändern</Text>

                {imageUrl && (
                  <Image source={{ uri: imageUrl }} style={styles.postImage} />
                )}
                <View style={styles.row}>

                  <TouchableOpacity style={styles.averageRedButton} onPress={() => setModalVisible(false)}>
                    <Text style={styles.smallButtonText}>Schließen</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.averageBlueButton}
                    onPress={async () => {
                      const success = await handleNewProfilePicture(imageUrl);
                      setModalVisible(false);
                    }}
                  >
                    <Text style={styles.smallButtonText}>Posten</Text>
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