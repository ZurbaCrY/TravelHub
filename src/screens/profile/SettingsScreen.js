import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Alert } from 'react-native';
import { useDarkMode } from '../../context/DarkModeContext';
import Button from '../../components/Button';
import AuthService from '../../services/auth';
import AnimatedSwitch from '../../components/AnimatedSwitch';
import PropTypes from 'prop-types';
import { handleFilePicker, handleNewProfilePicture } from '../../backend/community';
import { useLoading } from '../../context/LoadingContext';

const SettingsScreen = () => {
  const { isDarkMode, toggleDarkMode } = useDarkMode();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [imageUrl, setImageUrl] = useState(null); 
  const [modalVisible, setModalVisible] = useState(false); 
  const { showLoading, hideLoading } = useLoading();

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

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
      <Text style={[styles.header, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>Einstellungen</Text>
      <View style={styles.setting}>
        <Text style={[styles.settingLabel, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>Profilbild wechseln </Text>
        <TouchableOpacity onPress={handleImageChange}>
          <Image source={require('../../assets/images/picture.png')} style={styles.uploadIcon} />
        </TouchableOpacity>
      </View>

      <View style={styles.setting}>
        <Text style={[styles.settingLabel, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>Darkmode</Text>
        <AnimatedSwitch
          onValueChange={toggleDarkMode}
          value={isDarkMode}
        />
      </View>

      <View style={styles.setting}>
        <Text style={[styles.settingLabel, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>Benachrichtigungen</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 20,
  },
  setting: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  settingLabel: {
    fontSize: 18,
  },
  uploadIcon: {
    width: 40,
    height: 40,
    marginBottom: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent Hintergrund
  },
  modalView: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
});

export default SettingsScreen;