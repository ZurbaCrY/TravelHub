import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import { useDarkMode } from '../context/DarkModeContext';
import Button from '../components/Button';
import AuthService from '../services/auth';
import AnimatedSwitch from '../components/AnimatedSwitch';
import PropTypes from 'prop-types';
import styles from '../styles/style';
import { handleFilePicker, handleNewProfilePicture } from '../backend/community';

const SettingsScreen = ({ setUser, setLoading }) => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [imageUrl, setImageUrl] = useState(null); 
  const [modalVisible, setModalVisible] = useState(false); 

  const handleSignOut = async () => {
    try {
      setLoading(true, "Signing Out");
      const user = await AuthService.signOut();
      setUser(user);
    } catch (error) {
      Alert.alert("Fehler", "Beim Abmelden ist ein Fehler aufgetreten.");
      console.error('Sign-out error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = async () => {
    const image = await handleFilePicker();
    if (image) {
      setImageUrl(image);
      setModalVisible(true);
    }
  };

  return (
    <View style={[styles.containerNoMarginTop, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
      <Text style={[styles.titleText, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>Einstellungen</Text>
      <View style={styles.rowMarginBottom}>
        <Text style={[styles.bodyTextBig, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>Profilbild wechseln </Text>
        <TouchableOpacity onPress={handleImageChange}>
          <Image source={require('../assets/images/picture.png')} style={styles.iconBig} />
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

      <View>
        <Button mode="contained" onPress={handleSignOut}>
          Sign out
        </Button>
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
        <View style={styles.modalContainer}>
          <View style={styles.modalView}>
            {imageUrl && (
              <Image source={{ uri: imageUrl }} style={styles.previewImage} />
            )}
            <Button mode="contained" onPress={() => setModalVisible(false)}>
              Schließen
            </Button>
            <TouchableOpacity
              style={styles.submitButton}
              onPress={async () => {
                const success = await handleNewProfilePicture(imageUrl);
                setModalVisible(false);
              }}
            >
              <Button mode="contained">
                Posten
              </Button>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

SettingsScreen.propTypes = {
  setUser: PropTypes.func.isRequired,
  setLoading: PropTypes.func.isRequired,
};

export default SettingsScreen;
