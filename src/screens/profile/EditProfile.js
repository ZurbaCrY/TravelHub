import React, { useState, useEffect } from 'react';
import { Modal, TouchableWithoutFeedback, Keyboard, ScrollView, Alert } from 'react-native';
import { View, Text, TextInput, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
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
import { fetchCountries } from '../../backend/community';
import { color } from 'react-native-elements/dist/helpers';

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
  const [countryId, setCountryId] = useState();
  const [countries, setCountries] = useState([]);


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

    const loadCountries = async () => {
      try {
        showLoading(t('LOADING_MESSAGE.COUNTRIES'));
        const countriesData = await fetchCountries();
        setCountries(countriesData);
      } catch (error) {
        console.error('Error fetching countries: ', error);
      } finally {
        hideLoading();
      }
    };

    navigation.setOptions({
      title: 'Edit Profile',
      headerStyle: {
        backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8'  // Hintergrundfarbe des Headers
      },
      headerTitleStyle: {
        color: isDarkMode ? '#f8f8f8' : '#18171c'  // Textfarbe des Titels
      },
      headerTintColor: isDarkMode ? '#f8f8f8' : '#18171c'  // Farbe des "Zurück"-Pfeils
    });
  
    fetchUserData();
    loadCountries();
  }, [isDarkMode, navigation]);

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
    <View style={[styles.containerNoMarginTop, styles.paddingHorizontalMedium, { backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8' }]}>
    <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}>
      <ScrollView>

        <View style={[styles.profileImageContainer,{ backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8' }]}>
          <View style={[styles.profileImageWrapper,{ backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8' }]}>
            <TouchableWithoutFeedback onPress={handleImageChange}>
              <Image
                source={{ uri: userData.profilepicture_url }}
                style={styles.largeProfileImage}
              />
            </TouchableWithoutFeedback>
            <View style={styles.roundButtonContainerBottomRight}>
              <TouchableOpacity style={styles.roundButton} onPress={handleImageChange}>
                <FontAwesome5 name="edit" size={20} color={isDarkMode ? '#070A0F' : '#f8f8f8'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.row}>
          <View style={styles.container45Percent}>
            <Text style={[styles.bodyText, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>
              First Name
            </Text>
            <TextInput
              style={[styles.inputField, { color: isDarkMode ? '#f8f8f8' : '#18171c', backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8' }]}
              value={userData.first_name}
              onChangeText={(text) => handleInputChange('first_name', text)}
            />
          </View>
          <View style={styles.container45Percent}>
            <Text style={[styles.bodyText, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>
              Last Name
            </Text>
            <TextInput
              style={[styles.inputField, { color: isDarkMode ? '#f8f8f8' : '#18171c', backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8' }]}
              value={userData.last_name}
              onChangeText={(text) => handleInputChange('last_name', text)}
            />
          </View>
        </View>

        <Text style={[styles.bodyText, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>
          Username
        </Text>
        <TextInput
          style={[styles.inputField, { color: isDarkMode ? '#f8f8f8' : '#18171c', backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8' }]}
          value={userData.username}
          onChangeText={(text) => handleInputChange('username', text)}
        />

        <Text style={[styles.bodyText, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>
          Bio
        </Text>
        <TextInput
          style={[styles.inputField, { color: isDarkMode ? '#f8f8f8' : '#18171c', backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8' }]}
          value={userData.bio}
          onChangeText={(text) => handleInputChange('bio', text)}
        />

        <Text style={[styles.bodyText, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>
          Email
        </Text>
        <TextInput
          style={[styles.inputField, { color: isDarkMode ? '#f8f8f8' : '#18171c', backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8' }]}
          value={userData.email}
          onPress={() => Alert.alert('Error', 'There is a Problem with this feature. \nPlease Contact Support')}
          onChangeText={(text) => Alert.alert('Error', 'There is a Problem with this feature. \nPlease Contact Support')}
        />

        <Text style={[styles.bodyText, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>
          Birthdate
        </Text>
        <TouchableOpacity onPress={() => setShowDatepicker(true)} style={[styles.inputField, { backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8' }]}>
          <Text style={[styles.bodyText, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>
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

        <Text style={[styles.bodyText, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>
          Country
        </Text>
        <Picker
          style={[styles.inputField, { backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8', color: isDarkMode ? '#f8f8f8' : '#18171c' }]}
          selectedValue={country}
          onValueChange={(itemValue) => setCountry(itemValue)}
        >
          <Picker.Item label={country} value={country} />
          {countries.map((country) => (
            <Picker.Item key={country.id} label={country.name} value={country.id} />
          ))}
        </Picker>

        <CustomButton title={"Save"} onPress={handleSave} />

        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={[styles.modalBackground, { backgroundColor: isDarkMode ? 'rgba(24, 23, 28, 0.8)' : 'rgba(248, 248, 248, 0.8)' }]}>
              <TouchableWithoutFeedback>
                <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8' }]}>
                  <Text style={[styles.modalTitleText, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>
                    Change Profile Picture
                  </Text>

                  {imageUrl && (
                    <Image source={{ uri: imageUrl }} style={styles.postImage} />
                  )}
                  <View style={styles.row}>

                    <TouchableOpacity style={styles.averageRedButton} onPress={() => setModalVisible(false)}>
                      <Text style={[styles.smallButtonText, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>
                        Close
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.averageBlueButton} onPress={async () => {
                      const success = await handleNewProfilePicture(imageUrl);
                      setModalVisible(false);
                    }}>
                      <Text style={[styles.smallButtonText, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>
                        Post
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