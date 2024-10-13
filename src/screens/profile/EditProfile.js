import React, { useState, useEffect } from 'react';
import { Modal, TouchableWithoutFeedback, Keyboard, ScrollView, Alert } from 'react-native';
import { View, Text, TextInput, Image } from 'react-native';
import UserDataHandler from '../../services/userDataHandler';
import { useLoading } from '../../context/LoadingContext';
import styles from '../../styles/style';
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDarkMode } from '../../context/DarkModeContext';
import CustomButton from '../../components/CustomButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import { handleFilePicker, handleNewProfilePicture } from '../../backend/community';
import { useTranslation } from 'react-i18next';

const EditProfile = ({ navigation }) => {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const { showLoading, hideLoading } = useLoading();
  const [date, setDate] = useState(new Date());
  const [showDatepicker, setShowDatepicker] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const today = new Date();
  const [userData, setUserData] = useState({});
  const [country, setCountry] = useState();

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        showLoading(t('LOADING_MESSAGE.USER'));
        const data = await UserDataHandler.getUserData();
        // data.birthdate = new Date(data.birthdate); // Ensure birthdate is a Date object
        setUserData({ ...userData, ...data });
        setCountry(data.country.home_country);
        setDate(new Date(data.birthdate));
        console.log("User data fetched:", data);
      } catch (error) {
        console.error('EditProfile: Error fetching user data:', error);
      } finally {
        hideLoading();
      }
    };

    navigation.setOptions({ title: 'Edit Profile', headerStyle: { backgroundColor: '#f8f8f8' } });
    fetchUserData();
  }, [navigation]);

  const handleInputChange = (field, value) => {
    setUserData({ ...userData, [field]: value });
  };

  const handleImageChange = async () => {
    const image = await handleFilePicker();
    if (image) {
      setImageUrl(image);
      setModalVisible(true);
    }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatepicker(false);
    if (event.type === 'dismissed') {
      return;
    } else if (event.type === 'neutralButtonPressed') {
      setDate(new Date(0));
    } else if (event.type === 'set') {
      setDate(selectedDate);
    }
  };

  const handleSave = async () => {
    try {
      showLoading(t('LOADING_MESSAGE.SAVE_DATA'));
      userData.birthdate = date.toISOString().split('T')[0];
      userData.country = { home_country: country };
      await UserDataHandler.updateUserData(userData);
    }
    catch (error) {
      console.error('Error saving user data:', error);
      alert('Error saving user data');
    }
    finally {
      hideLoading();
      alert('User data saved successfully');
      navigation.goBack();
    }
  };

  return (
    <View style={[styles.containerNoMarginTop, styles.paddingHorizontalMedium]}>
      <TouchableWithoutFeedback onPress={() => {
        // Close the keyboard when the user taps outside of the input fields
        Keyboard.dismiss();
      }}>
        <ScrollView>

          <View style={styles.profileImageContainer}>
            <View style={styles.profileImageWrapper}>
              <TouchableWithoutFeedback onPress={() => handleImageChange()}>
                <Image
                  source={{ uri: userData.profilepicture_url }}
                  style={styles.largeProfileImage}
                />
              </TouchableWithoutFeedback>
              <View style={styles.roundButtonContainerBottomRight}>
                <TouchableOpacity style={styles.roundButton} onPress={() => handleImageChange()}>
                  <FontAwesome5 name="edit" size={20} color={isDarkMode ? '#070A0F' : '#f8f8f8'} />
                </TouchableOpacity>
              </View>
            </View>
          </View>


          <View style={styles.row}>
            <View style={styles.container45Percent}>
              <Text style={styles.bodyText}>
                {t('SCREENS.PROFILE.FIRST_NAME')}
              </Text>
              <TextInput
                style={styles.inputField}
                value={userData.first_name}
                onChangeText={(text) => handleInputChange('first_name', text)}
              />
            </View>
            <View style={styles.container45Percent}>
              <Text style={styles.bodyText}>
                {t('SCREENS.PROFILE.LAST_NAME')}
              </Text>
              <TextInput
                style={styles.inputField}
                value={userData.last_name}
                onChangeText={(text) => handleInputChange('last_name', text)}
              />
            </View>
          </View>

          <Text style={styles.bodyText}>
            {t('SCREENS.PROFILE.USERNAME')}
          </Text>
          <TextInput
            style={styles.inputField}
            value={userData.username}
            onChangeText={(text) => handleInputChange('username', text)}
          />

          <Text style={styles.bodyText}>
            {t('SCREENS.PROFILE.BIO')}
          </Text>
          <TextInput
            style={styles.inputField}
            value={userData.bio}
            onChangeText={(text) => handleInputChange('bio', text)}
          />

          <Text style={styles.bodyText}>
            {t('SCREENS.PROFILE.EMAIL')}
          </Text>
          <TextInput
            style={styles.inputField}
            value={userData.email}
            // onChangeText={(text) => handleInputChange('email', text)}
            onPress={() => Alert.alert('Error', 'There is a Problem with this feature. \nPlease Contact Support')}
            onChangeText={(text) => Alert.alert('Error', 'There is a Problem with this feature. \nPlease Contact Support')}
          />

          <Text style={styles.bodyText}>
            {t('SCREENS.PROFILE.BIRTHDATE')}
          </Text>
          <TouchableOpacity
            onPress={() => setShowDatepicker(true)}
            style={styles.inputField}
          >
            <Text style={styles.bodyText}>
              {date ? `${date.getDate()} ${date.toLocaleString('default', { month: 'long' })} ${date.getFullYear()}` : ''}
            </Text>
          </TouchableOpacity>
          {showDatepicker && (
            <DateTimePicker
              value={date}
              mode='date'
              display='spinner'
              onChange={onDateChange}
              minimumDate={new Date(0)}
              maximumDate={today}
              style={styles.datePicker}
            />
          )}

          <Text style={styles.bodyText}>
            {t('SCREENS.PROFILE.COUNTRY')}
          </Text>
          <TextInput
            style={styles.inputField}
            value={country}
            onChangeText={(text) => setCountry(text)}
          />

          <CustomButton title={"Save"} onPress={handleSave} />

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
                    <Text style={styles.modalTitleText}>
                      {t('SCREENS.SETTINGS.CHANGE_PROFILE_PICTURE')}
                    </Text>

                    {imageUrl && (
                      <Image source={{ uri: imageUrl }} style={styles.postImage} />
                    )}
                    <View style={styles.row}>

                      <TouchableOpacity style={styles.averageRedButton} onPress={() => setModalVisible(false)}>
                        <Text style={styles.smallButtonText}>
                          {t('CLOSE')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={styles.averageBlueButton}
                        onPress={async () => {
                          const success = await handleNewProfilePicture(imageUrl);
                          setModalVisible(false);
                        }}
                      >
                        <Text style={styles.smallButtonText}>
                          {t('POST')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </ScrollView>
      </TouchableWithoutFeedback>
    </View>
  );
};

export default EditProfile;