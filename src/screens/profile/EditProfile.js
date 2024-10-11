import React, { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { View, Text, TextInput, Image } from 'react-native';
import userDataHandler from '../../services/userDataHandler';
import { useLoading } from '../../context/LoadingContext';
import styles from '../../styles/style';
import { FontAwesome5 } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { useDarkMode } from '../../context/DarkModeContext';
import CustomButton from '../../components/CustomButton';
import DateTimePicker from '@react-native-community/datetimepicker';
import moment from 'moment-timezone';

const EditProfile = ({ navigation }) => {
  const { isDarkMode } = useDarkMode();
  const { showLoading, hideLoading } = useLoading();
  const sourceMoment = moment.unix(1636765200);
  const sourceDate = sourceMoment.local().toDate();
  const [date, setDate] = useState(sourceDate);
  const [showDatepicker, setShowDatepicker] = useState(false);
  const today = new Date();

  const [userData, setUserData] = useState({

  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        showLoading("Fetching user data");
        const data = await userDataHandler.getUserData();
        // data.birthdate = new Date(data.birthdate); // Ensure birthdate is a Date object
        setUserData({ ...userData, ...data })
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

  const handleSave = async () => {
    try {
      showLoading("Saving user data");
      await userDataHandler.updateUserData(userData);
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

  const handleImageChange = async () => {
    Alert.alert(
      'Feature Not Implemented',
      'Please contact Support!',
      [{ text: 'OK' }]
    );
    // try {
    //   showLoading("Changing profile picture");
    //   const image = await userDataHandler.handleFilePicker();
    //   if (image) {
    //     const imageUrl = await userDataHandler.handleNewProfilePicture(image);
    //     setUserData({ ...userData, profilepicture_url: imageUrl });
    //   }
    // } catch (error) {
    //   console.error('Error changing profile picture:', error);
    //   alert('This feature is not implemented yet. Please contact Support!');
    // } finally {
    //   hideLoading();
    // }
  };

  const onDateChange = (event, selectedDate) => {
    setShowDatepicker(false);
    if (event.type === 'dismissed') {
      Alert.alert(
        'picker was dismissed',
        undefined,
        [
          {
            text: 'great',
          },
        ],
        { cancelable: true },
      );
      return;
    }
    
    if (event.type === 'neutralButtonPressed') {
      setDate(new Date(0));
    } else {
      setDate(selectedDate);
    }
  };


  return (
    <View style={[styles.containerNoMarginTop, styles.paddingHorizontalMedium]}>

      <View style={styles.profileImageContainer}>
        <View style={styles.profileImageWrapper}>
          <Image
            source={{ uri: userData.profilepicture_url }}
            style={styles.largeProfileImage}
          />
          <View style={styles.roundButtonContainerBottomRight}>
            <TouchableOpacity style={styles.roundButton} onPress={() => handleImageChange()}>
              <FontAwesome5 name="edit" size={20} color={isDarkMode ? '#070A0F' : '#f8f8f8'} />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.row}>
        <View style={styles.container45Percent}>
          <Text style={styles.bodyText}>First Name</Text>
          <TextInput
            style={styles.inputField}
            value={userData.first_name}
            onChangeText={(text) => handleInputChange('first_name', text)}
          />
        </View>
        <View style={styles.container45Percent}>
          <Text style={styles.bodyText}>Last Name</Text>
          <TextInput
            style={styles.inputField}
            value={userData.last_name}
            onChangeText={(text) => handleInputChange('last_name', text)}
          />
        </View>
      </View>

      <Text style={styles.bodyText}>Username</Text>
      <TextInput
        style={styles.inputField}
        value={userData.username}
        onChangeText={(text) => handleInputChange('username', text)}
      />

      <Text style={styles.bodyText}>Bio</Text>
      <TextInput
        style={styles.inputField}
        value={userData.bio}
        onChangeText={(text) => handleInputChange('bio', text)}
      />

      <Text style={styles.bodyText}>Email</Text>
      <TextInput
        style={styles.inputField}
        value={userData.email}
        onChangeText={(text) => handleInputChange('email', text)}
      />

      <Text style={styles.bodyText}>Birthday</Text>
      <TouchableOpacity 
      onPress={() => setShowDatepicker(true)} 
      style={styles.inputField}
      >
        <Text>{date.toDateString()}</Text>
      </TouchableOpacity>
      {showDatepicker && (
        <DateTimePicker
        value={date}
        mode='date'
        display='spinner'
        onChange={onDateChange}
        minimumDate={new Date(0)}
        maximumDate={today}
      />
      )}

      <Text style={styles.bodyText}>Country</Text>
      <TextInput
        style={styles.inputField}
        value={userData.country ? userData.country.home_country : ''}
        onChangeText={(text) => handleInputChange('country.home_country', text)}
      />
      <CustomButton title={"Save"} onPress={handleSave} />
    </View>
  );
};

export default EditProfile;