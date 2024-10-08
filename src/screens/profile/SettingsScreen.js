import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Modal, Alert, TouchableWithoutFeedback } from 'react-native';
import { useDarkMode } from '../../context/DarkModeContext';
import Button from '../../components/Button';
import AuthService from '../../services/auth';
import AnimatedSwitch from '../../components/AnimatedSwitch';
import styles from '../../styles/style';
import { handleFilePicker, handleNewProfilePicture } from '../../backend/community';
import { useLoading } from '../../context/LoadingContext';
import CustomButton from '../../components/CustomButton';

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
    <View style={[styles.containerNoMarginTop, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
      <Text style={[styles.titleText, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>Einstellungen</Text>
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