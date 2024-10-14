import React, { useState, useEffect, useCallback } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import {
  View,
  Text,
  Image,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Keyboard,
  TouchableWithoutFeedback,
  Modal,
  FlatList,
  RefreshControl
} from 'react-native';
import ExtendedModal from "react-native-modal";
import Flag from 'react-native-flags';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useDarkMode } from '../../context/DarkModeContext';
import { useNavigation } from '@react-navigation/native';
import Button from '../../components/Button';
import { styles } from '../../styles/styles';
import newStyle from '../../styles/style';
import { getProfilePictureUrlByUserId } from '../../services/getProfilePictureUrlByUserId';
import {
  fetchVisitedCountries,
  fetchWishListCountries,
  validateCountry,
  addVisitedCountry,
  removeVisitedCountry,
  addWishListCountry,
  removeWishListCountry,
} from '../../backend/Profile';
import FriendService from '../../services/friendService';
import UserDataHandler from '../../services/userDataHandler';
import getUsernamesByUserIds from '../../services/getUsernamesByUserIds'
import { getUserStats } from '../../services/getUserStats';
import { useAuth } from '../../context/AuthContext';
import { useLoading } from '../../context/LoadingContext';
import PublicProfileModal from '../../components/PublicProfileModal';
import { handleFilePicker, handleNewProfilePicture } from '../../backend/community';
import { FontAwesome5 } from '@expo/vector-icons';
import { useTranslation } from 'react-i18next';

export default function ProfileScreen() {
  const { t } = useTranslation();
  const { isDarkMode } = useDarkMode();
  const [visitedCountries, setVisitedCountries] = useState([]);
  const [wishListCountries, setWishListCountries] = useState([]);
  const [newVisited, setNewVisited] = useState('');
  const [newWishList, setNewWishList] = useState('');
  const [showVisitedInput, setShowVisitedInput] = useState(false);
  const [showWishListInput, setShowWishListInput] = useState(false);
  const [profilePictureUrl, setProfilePictureUrl] = useState(null);
  const [travelBuddiesModalVisible, setTravelBuddiesModalVisible] = useState(false);
  const [travelBuddies, setTravelBuddies] = useState([]);
  const [postCount, setPostCount] = useState(0);
  const [upvoteCount, setUpvoteCount] = useState(0);
  const [downvoteCount, setDownvoteCount] = useState(0);
  const { user } = useAuth();
  const { showLoading, hideLoading } = useLoading();
  const [userProfileModal, setUserProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [requestModalVisible, setRequestModalVisible] = useState(false);
  const [friendRequests, setFriendRequests] = useState([]);
  const [userData, setUserData] = useState(null);
  const [imageUrl, setImageUrl] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [isProfileLoaded, setIsProfileLoaded] = useState(false);

  const navigation = useNavigation();


  useEffect(() => {
    if (!user || !user.id) return; // Exit if user is not yet defined or has no id

    const fetchProfilePictureUrl = async () => {
      try {
        showLoading(t('LOADING_MESSAGE.PROFILE_PICTURE'));
        const url = await getProfilePictureUrlByUserId(user.id);
        setProfilePictureUrl(url);
      } catch (error) {
        console.error("Error fetching Profile Picture URL:", error);
      }
    };

    const fetchUserStats = async () => {
      try {
        showLoading(t('LOADING_MESSAGE.USER_STATS'));
        const visitedCountriesData = await fetchVisitedCountries(user.id);
        setVisitedCountries(visitedCountriesData);

        const wishListCountriesData = await fetchWishListCountries(user.id);
        setWishListCountries(wishListCountriesData);

        // Fetch travel buddies
        const travelBuddiesData = await FriendService.getFriends();
        const travelBuddiesIds = travelBuddiesData.map(buddy => buddy.friend_id);
        const travelBuddiesNames = await getUsernamesByUserIds(travelBuddiesIds);
        setTravelBuddies(travelBuddiesNames);

        // Fetch user stats
        const stats = await getUserStats(user.id, getFriendCount = false);
        setPostCount(stats.postCount);
        setUpvoteCount(stats.upvoteCount);
        setDownvoteCount(stats.downvoteCount);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    const fetchRequests = async () => {
      try {
        await FriendService.initialize();
        const requests = await FriendService.getIncomingRequests(pending = true, accepted = false, declined = false, revoked = false);
        const senderIds = requests.map(request => request.sender_id);
        const senderUsernames = await getUsernamesByUserIds(senderIds);
        const requestsWithUsernames = requests.map((request, index) => ({
          friend_request_id: request.friend_request_id,
          sender_id: request.sender_id,
          sender_username: senderUsernames[index].username
        }));
        setFriendRequests(requestsWithUsernames);
      } catch (error) {
        console.error('Fetch Requests: Error fetching friend requests:', error);
      }
    };

    const fetchUserData = async () => {
      try {
        showLoading(t('LOADING_MESSAGE.USER_DATA'));
        const fetcheduserData = await UserDataHandler.getUserData(user.id);
        setUserData(fetcheduserData);
      } catch (error) {
        console.error('ProfileScreen: Error fetching user data:', error);
      }
    };

    try {
      showLoading(t('LOADING_MESSAGE.PROFILE'));
      fetchUserData();
      fetchProfilePictureUrl();
      fetchUserStats();
      fetchRequests();
    } catch (error) {
      console.error('Error fetching profile data:', error);
    } finally {
      hideLoading();
    }
  }, [user]);

  const reloadUserData = async () => {
    try {
      const fetcheduserData = await UserDataHandler.getUserData(user.id);
      setUserData(fetcheduserData);
    } catch (error) {
      console.error('ProfileScreen: Error fetching user data:', error);
    }
  };

  useFocusEffect(
    useCallback(() => {
      if (user && user.id) {
        reloadUserData();
      }
    }, [user])
  );

  const handleAddVisitedCountry = async () => {
    if (newVisited) {
      if (visitedCountries.some(country => country.name.toLowerCase() === newVisited.toLowerCase())) {
        alert('Das Land ist bereits in der Liste der besuchten Länder.');
        return;
      }

      const countryId = await validateCountry(newVisited);
      if (!countryId) {
        alert('Das eingegebene Land ist nicht in der Tabelle "Country" vorhanden.');
        return;
      }

      const updatedVisited = [...visitedCountries, { name: newVisited, verified: false }];
      setVisitedCountries(updatedVisited);
      setNewVisited('');

      try {
        await addVisitedCountry(user.id, countryId);
      } catch (error) {
        console.error('Error adding visited country:', error);
      }
    }
    setShowVisitedInput(false);
  };

  const handleAddWishListCountry = async () => {
    if (newWishList) {
      if (wishListCountries.some(country => country.toLowerCase() === newWishList.toLowerCase())) {
        alert('Das Land ist bereits in der Wunschliste.');
        return;
      }

      const countryId = await validateCountry(newWishList);
      if (!countryId) {
        alert('Das eingegebene Land ist nicht in der Tabelle "Country" vorhanden.');
        return;
      }

      const updatedWishList = [...wishListCountries, newWishList];
      setWishListCountries(updatedWishList);
      setNewWishList('');

      try {
        await addWishListCountry(user.id, updatedWishList);
      } catch (error) {
        console.error('Error updating wishlist countries:', error);
      }
    }
    setShowWishListInput(false);
  };

  const handleRemoveVisitedCountry = async (index) => {
    const countryToRemove = visitedCountries[index];
    const updatedCountries = [...visitedCountries];
    updatedCountries.splice(index, 1);
    setVisitedCountries(updatedCountries);

    try {
      const countryData = await validateCountry(countryToRemove.name);
      await removeVisitedCountry(user.id, countryData);
    } catch (error) {
      console.error('Error deleting visited country:', error);
    }
  };

  const getUserProfileData = async (userId) => {
    try {
      // Lade alle Daten parallel
      const [
        profilePictureUrl,
        visitedCountriesData,
        wishListCountriesData,
        travelBuddiesData,
        userStats,
        friendRequests
      ] = await Promise.all([
        getProfilePictureUrlByUserId(userId),
        fetchVisitedCountries(userId),
        fetchWishListCountries(userId),
        FriendService.getFriends(),
        getUserStats(userId, false),
        FriendService.getIncomingRequests(true, false, false, false)
      ]);
      // Verarbeite die Freundschaftsanfragen mit den Nutzernamen
      const senderIds = friendRequests.map(request => request.sender_id);
      const senderUsernames = await getUsernamesByUserIds(senderIds);
      const requestsWithUsernames = friendRequests.map((request, index) => ({
        friend_request_id: request.friend_request_id,
        sender_id: request.sender_id,
        sender_username: senderUsernames[index].username
      }));
      // Reisebuddies mit Nutzernamen verknüpfen
      const travelBuddiesIds = travelBuddiesData.map(buddy => buddy.friend_id);
      const travelBuddiesNames = await getUsernamesByUserIds(travelBuddiesIds);
      return {
        profilePictureUrl,
        visitedCountriesData,
        wishListCountriesData,
        travelBuddiesNames,
        userStats,
        requestsWithUsernames
      };
    } catch (error) {
      console.error("Error fetching user profile data:", error);
      throw error;
    }
  };
  
  useEffect(() => {
    console.log('ProfileScreen: ', user.id);
    if (!user || !user.id) return;
  
    const loadUserProfileData = async () => {
      try {
        showLoading(t('LOADING_MESSAGE.PROFILE'));
        const profileData = await getUserProfileData(user.id);
  
        // Setze die geladenen Daten in den State
        setProfilePictureUrl(profileData.profilePictureUrl);
        setVisitedCountries(profileData.visitedCountriesData);
        setWishListCountries(profileData.wishListCountriesData);
        setTravelBuddies(profileData.travelBuddiesNames);
        setPostCount(profileData.userStats.postCount);
        setUpvoteCount(profileData.userStats.upvoteCount);
        setDownvoteCount(profileData.userStats.downvoteCount);
        setFriendRequests(profileData.requestsWithUsernames);
      } catch (error) {
        console.error('Error loading profile data:', error);
      } finally {
        hideLoading();
      }
    };
  
    loadUserProfileData();
  }, [user]);

  const onRefresh = async () => {
    setRefreshing(true); 
    try {
      const profileData = await getUserProfileData(user.id); 
  
      // Aktualisiere den State mit den neu geladenen Daten
      setProfilePictureUrl(profileData.profilePictureUrl);
      setVisitedCountries(profileData.visitedCountriesData);
      setWishListCountries(profileData.wishListCountriesData);
      setTravelBuddies(profileData.travelBuddiesNames);
      setPostCount(profileData.userStats.postCount);
      setUpvoteCount(profileData.userStats.upvoteCount);
      setDownvoteCount(profileData.userStats.downvoteCount);
      setFriendRequests(profileData.requestsWithUsernames);
    } catch (error) {
      console.error('Error refreshing profile data:', error);
    } finally {
      setRefreshing(false); 
    }
  };

  const handleRemoveWishListCountry = async (index) => {
    const updatedCountries = [...wishListCountries];
    updatedCountries.splice(index, 1);
    setWishListCountries(updatedCountries);

    try {
      if (updatedCountries.length === 0) {
        await removeWishListCountry(user.id);
      } else {
        await addWishListCountry(user.id, updatedCountries);
      }
    } catch (error) {
      console.error('Error updating wishlist countries:', error);
    }
  };

  const handleUserPress = async (item) => {
    try {
      showLoading('LOADING_MESSAGE.USER');
      const stats = await getUserStats(item.user_id);
      const profilePictureUrl = await getProfilePictureUrlByUserId(item.user_id);
      const selectedUserData = {
        user_id: item.user_id,
        username: item.username,
        profilepicture_url: profilePictureUrl,
        friendCount: stats.friendCount,
        upvotes: stats.upvoteCount,
        downvotes: stats.downvoteCount,
        postCount: stats.postCount
      };
      setSelectedUser(selectedUserData);
      setUserProfileModal(true);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      hideLoading();
    }
  }

  const handleFriendRequestPress = async () => {
    try {
      showLoading(t('LOADING_MESSAGE.FRIEND_REQUEST_SEND'));
      await FriendService.sendFriendRequest(selectedUser.user_id);
    } catch (error) {
      console.error('Error sending friend request:', error);
    } finally {
      hideLoading();
    }
  }

  const handleRequestButtonPress = async () => {
    try {
      showLoading(t('LOADING_MESSAGE.FRIEND_REQUEST'));
      setRequestModalVisible(true);
    } catch (error) {
      console.error('Error navigating to friend requests:', error);
    } finally {
      hideLoading();
    }
  }

  const respondToFriendRequest = async (requestId, action) => {
    try {
      if (action === "accept") {
        showLoading(t('LOADING_MESSAGE.FRIEND_REQUEST_ACCEPT'));
      } else if (action === "decline") {
        showLoading(t('LOADING_MESSAGE.FRIEND_REQUEST_DECLINE'));
      } else {
        console.error('Invalid action:', action);
        return;
      }
      await FriendService.respondToFriendRequest(requestId, action);
      setFriendRequests(friendRequests.filter(request => request.friend_request_id !== requestId));
    } catch (error) {
      console.error('Error responding to friend request:', error);
    } finally {
      hideLoading();
    }
  }

  const handleImageChange = async () => {
    const image = await handleFilePicker();
    if (image) {
      setImageUrl(image);
      setModalVisible(true);
    }
  };

  return (
    <View style={[newStyle.centeredContainer, { backgroundColor: isDarkMode ? '#070A0F' : '#f8f8f8' }]}>
      <TouchableWithoutFeedback onPress={() => {
        // Close the keyboard when the user taps outside of the input fields
        Keyboard.dismiss();
        setShowVisitedInput(false);
        setShowWishListInput(false);
      }}>
        <ScrollView
          style={[newStyle.container, { backgroundColor: isDarkMode ? '#070A0F' : '#f8f8f8' }]}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }>
          <View style={[newStyle.centeredContainer, { backgroundColor: isDarkMode ? '#070A0F' : '#f8f8f8' }]}>

            <View style={newStyle.roundButtonContainerTopRight}>
              {/* Settings Button */}
              <View style={newStyle.roundButtonWrapper}>
                <TouchableOpacity style={newStyle.roundButtonAbsolute} onPress={() => navigation.navigate('Settings')}>
                  <FontAwesome5 name="cog" size={20} color={isDarkMode ? '#070A0F' : '#f8f8f8'} />
                </TouchableOpacity>
              </View>

              {/* Edit Profile Button */}
              <View style={newStyle.roundButtonWrapper}>
                <TouchableOpacity style={newStyle.roundButtonAbsolute} onPress={() => navigation.navigate('EditProfile')}>
                  <FontAwesome5 name="edit" size={20} color={isDarkMode ? '#070A0F' : '#f8f8f8'} />
                </TouchableOpacity>
              </View>

              {/* Friend Request Button */}
              <View style={newStyle.roundButtonWrapper}>
                <TouchableOpacity style={newStyle.roundButtonAbsolute} onPress={handleRequestButtonPress}>
                  {friendRequests.length > 0 && (
                    <View style={newStyle.notificationCircle}>
                      <Text style={newStyle.notificationText}>{friendRequests.length < 10 ? friendRequests.length : '9+'}</Text>
                    </View>
                  )}
                  <FontAwesome5 name="user-plus" size={20} color={isDarkMode ? '#070A0F' : '#f8f8f8'} />
                </TouchableOpacity>
              </View>
            </View>

            {/* Profile Picture, Username, Email, Birthday, Country */}
            <TouchableOpacity onPress={handleImageChange}>
              <Image
                source={{ uri: profilePictureUrl }}
                style={newStyle.largeProfileImage}
              />
            </TouchableOpacity>
            <Text style={[newStyle.titleText, { color: isDarkMode ? '#FFFDF3' : '#000000' }]}>{user.user_metadata.username}</Text>

            {/* Bio */}
            <Text style={[newStyle.bodyTextBig, { color: isDarkMode ? '#FFFDF3' : '#000000' }]}>
              {userData && userData.bio ? '"' + userData.bio + '"' :  t('SCREENS.PROFILE.NO_BIO') }
            </Text>


            {/* Email */}
            <Text style={[newStyle.bodyText, { color: isDarkMode ? '#FFFDF3' : '#000000' }]}>
              {userData && userData.email ? userData.email : t('SCREENS.PROFILE.NO_EMAIL')}
            </Text>

            {/* Birthday */}
            <View style={newStyle.row}>
              <Icon name="birthday-cake" size={14} style={[newStyle.marginRightExtraSmall, { color: isDarkMode ? '#FFFDF3' : '#000000' }]} />
              <Text style={[newStyle.bodyText, { color: isDarkMode ? '#FFFDF3' : '#000000' }]}>
                {userData && userData.birthdate ? new Date(userData.birthdate).toLocaleDateString('en-GB', { day: '2-digit', month: 'long', year: 'numeric' }) : t('SCREENS.PROFILE.NO_BIRTHDATE')}
              </Text>
            </View>

            {/* Flag & Home Country */}
            {userData && userData.country.home_country && userData.country.home_country_code ?
              <View style={newStyle.row}>
                <Flag code={userData.country.home_country_code} size={16} style={newStyle.marginRightExtraSmall} />
                <Text style={[newStyle.bodyText, { color: isDarkMode ? '#FFFDF3' : '#000000' }]}>
                  {userData.country.home_country}
                </Text>
              </View> :
              <View style={newStyle.row}>
                <Flag code="DE" size={16} style={newStyle.marginRightExtraSmall} />
                <Text style={[newStyle.bodyText, { color: isDarkMode ? '#FFFDF3' : '#000000' }]}>
                  {t('SCREENS.PROFILE.NO_COUNTRY')}
                </Text>
              </View>
            }

          </View>

          {/* User Stats */}
          <View style={newStyle.userStatsContainer}>
            {/* Row 1: Friends and Posts */}
            <View style={newStyle.userStatsRow}>
              <View style={newStyle.userStatColumn}>
                <TouchableOpacity onPress={() => setTravelBuddiesModalVisible(true)} style={[{ justifyContent: 'center', alignItems: 'center' }]}>
                  <Text style={newStyle.userStatLabel}>
                    {t('SCREENS.PROFILE.TRAVEL_BUDDIES')}
                  </Text>
                  <Text style={newStyle.userStatValue}>{travelBuddies.length != null ? travelBuddies.length : 'N/A'}</Text>
                </TouchableOpacity>
              </View>
              <View style={newStyle.userStatColumn}>
                <Text style={newStyle.userStatLabel}>
                  {t('SCREENS.PROFILE.POSTS')}
                </Text>
                <Text style={newStyle.userStatValue}>{postCount != null ? postCount : 'N/A'}</Text>
              </View>
            </View>

            {/* Row 2: Upvotes and Downvotes */}
            <View style={newStyle.userStatsRow}>
              <View style={newStyle.userStatColumn}>
                <Text style={newStyle.userStatLabel}>
                  {t('SCREENS.PROFILE.UPVOTES')}
                </Text>
                <Text style={newStyle.userStatValue}>{upvoteCount != null ? upvoteCount : 'N/A'}</Text>
              </View>
              <View style={newStyle.userStatColumn}>
                <Text style={newStyle.userStatLabel}>
                  {t('SCREENS.PROFILE.DOWNVOTES')}
                </Text>
                <Text style={newStyle.userStatValue}>{downvoteCount != null ? downvoteCount : 'N/A'}</Text>
              </View>
            </View>
          </View>

          {/* Visited and Wish List Countries */}
          <View style={newStyle.infoSection}>
            <Text style={newStyle.header}>
              {t('SCREENS.PROFILE.VISITED_COUNTRIES')}
            </Text>
            {visitedCountries.length === 0 ? (
              <Text style={newStyle.details}>
                {t('SCREENS.PROFILE.NO_VISITED_COUNTRIES')}
              </Text>
            ) : (
              visitedCountries.map((country, index) => (
                <View key={index} style={styles.countryItem}>
                  <View style={styles.countryTextContainer}>
                    <Text style={newStyle.details}>{country.name}</Text>
                    {country.verified && <Icon name="check-circle" size={16} color="green" style={styles.verifiedIcon} />}
                  </View>
                  <TouchableOpacity onPress={() => handleRemoveVisitedCountry(index)} style={styles.removeButton}>
                    <Icon name="trash" size={20} color="#FFFDF3" />
                  </TouchableOpacity>
                </View>
              ))
            )}
            {showVisitedInput && (
              <>
                <TextInput
                  style={styles.input}
                  onChangeText={setNewVisited}
                  value={newVisited}
                  placeholder={t('SCREENS.PROFILE.ADD_VISITED_COUNTRY')}
                  placeholderTextColor="#cccccc"
                />
                <Button onPress={handleAddVisitedCountry} color="#58CFEC">
                  {t('ADD')}
                </Button>
              </>
            )}
            {!showVisitedInput && (
              <TouchableOpacity onPress={() => setShowVisitedInput(true)} style={styles.addButton}>
                <Icon name="plus" size={20} color="#FFFDF3" />
                <Text style={styles.addButtonText}>
                  {t('SCREENS.PROFILE.ADD_VISITED_COUNTRY')}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          <View style={styles.infoSection}>
            <Text style={styles.header}>
              {t('SCREENS.PROFILE.WISHLIST_COUNTRIES')}
            </Text>
            {wishListCountries.length === 0 ? (
              <Text style={styles.details}>
                {t('SCREENS.PROFILE.NO_WISHLIST_COUNTRIES')}
              </Text>
            ) : (
              wishListCountries.map((country, index) => (
                <View key={index} style={styles.countryItem}>
                  <Text style={styles.details}>{country}</Text>
                  <TouchableOpacity onPress={() => handleRemoveWishListCountry(index)} style={styles.removeButton}>
                    <Icon name="trash" size={20} color="#FFFDF3" />
                  </TouchableOpacity>
                </View>
              ))
            )}
            {showWishListInput && (
              <>
                <TextInput
                  style={styles.input}
                  onChangeText={setNewWishList}
                  value={newWishList}
                  placeholder={t('SCREENS.PROFILE.ADD_WISHLIST_COUNTRY')}
                  placeholderTextColor="#cccccc"
                />
                <Button onPress={handleAddWishListCountry} color="#58CFEC">
                  {t('ADD')}
                </Button>
              </>
            )}
            {!showWishListInput && (
              <TouchableOpacity onPress={() => setShowWishListInput(true)} style={styles.addButton}>
                <Icon name="plus" size={20} color="#FFFDF3" />
                <Text style={styles.addButtonText}>
                  {t('SCREENS.PROFILE.ADD_WISHLIST_COUNTRY')}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Placeholder for the bottom of the screen */}
          <View style={[styles.infoSection, { backgroundColor: isDarkMode ? '#070A0F' : '#f8f8f8' }]} />
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
              <View style={newStyle.modalBackground}>
                <TouchableWithoutFeedback>
                  <View style={newStyle.modalContent}>
                    <Text style={newStyle.modalTitleText}>
                      {t('SCREENS.PROFILE.CHANGE_PROFILE_PICTURE')}
                    </Text>

                    {imageUrl && (
                      <Image source={{ uri: imageUrl }} style={newStyle.postImage} />
                    )}
                    <View style={styles.row}>

                      <TouchableOpacity style={newStyle.averageRedButton} onPress={() => setModalVisible(false)}>
                        <Text style={newStyle.smallButtonText}>
                          {t('CLOSE')}
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={newStyle.averageBlueButton}
                        onPress={async () => {
                          const success = await handleNewProfilePicture(imageUrl);
                          onRefresh();
                          setModalVisible(false);
                        }}
                      >
                        <Text style={newStyle.smallButtonText}>
                          {t('POST')}
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
          {/* Travel Buddies Modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={travelBuddiesModalVisible}
            onRequestClose={() => setTravelBuddiesModalVisible(false)}
          >
            <TouchableWithoutFeedback onPress={() => setTravelBuddiesModalVisible(false)}>
              <View style={newStyle.modalBackground}>
                <TouchableWithoutFeedback>
                  <View style={newStyle.modalContent}>
                    {/* Close Button (X) */}
                    <TouchableOpacity style={newStyle.closeButtonX} onPress={() => setTravelBuddiesModalVisible(false)}>
                      <Text style={newStyle.closeButtonX}>✖</Text>
                    </TouchableOpacity>

                    {/* Travel Buddies listed */}
                    <Text style={newStyle.modalTitleText}>
                      {t('SCREENS.PROFILE.TRAVEL_BUDDIES')}
                    </Text>
                    {travelBuddies.length === 0 ? (
                      <Text style={newStyle.bodyText}>
                        {t('SCREENS.PROFILE.NO_TRAVEL_BUDDIES')}
                      </Text>
                    ) : (
                      <FlatList
                        data={travelBuddies}
                        keyExtractor={(item) => item.user_id}
                        renderItem={({ item }) => (
                          <View>
                            <TouchableOpacity onPress={() => handleUserPress(item)}>
                              <Text style={newStyle.bodyText}>{item.username.toString()}</Text>
                            </TouchableOpacity>
                          </View>
                        )}
                      />
                    )}
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </TouchableWithoutFeedback>
          </Modal>
        </ScrollView>
      </TouchableWithoutFeedback>

      {/* Friend Requests */}
      <ExtendedModal
        isVisible={requestModalVisible}
        onBackdropPress={() => setRequestModalVisible(false)}
        onBackButtonPress={() => setRequestModalVisible(false)}
        animationIn="slideInRight"
        animationOut="slideOutRight"
        backdropOpacity={0.5}
        style={newStyle.friendRequestModal}
      >
        <View style={newStyle.container}>
          <Text style={newStyle.titleText}>
            {t('FRIENDS.REQUESTS.FRIEND_REQUESTS')}
          </Text>
          {friendRequests.length === 0 ? (
            <Text style={newStyle.bodyText}>
              {t('FRIENDS.REQUESTS.NO_FRIEND_REQUESTS')}
            </Text>
          ) : (
            <FlatList
              data={friendRequests}
              keyExtractor={(item) => item.friend_request_id}
              renderItem={({ item }) => (
                <View>
                  <TouchableOpacity
                    style={newStyle.containerNoMarginTop}
                    onPress={() => handleUserPress({ user_id: item.sender_id, username: item.sender_username })}
                  >
                    <Text style={newStyle.bodyText}>{item.sender_username}</Text>
                  </TouchableOpacity>
                  <View style={newStyle.row}>
                    <TouchableOpacity
                      style={newStyle.containerNoMarginTop}
                      onPress={() => respondToFriendRequest(item.friend_request_id, "accept")}
                    >
                      <Text style={newStyle.bodyText}>{t('ACCEPT')}</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={newStyle.containerNoMarginTop}
                      onPress={() => respondToFriendRequest(item.friend_request_id, "decline")}
                    >
                      <Text style={newStyle.bodyText}>{t('DECLINE')}</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            />
          )}
          {/* <View style={newStyle.marginBottomLarge}/> 
          <Text style={newStyle.titleText}>{t('SCREENS.PROFILE.SUGGESTED_FRIENDS)}</Text>
          <Text style={newStyle.bodyText}>This feature will be added in the future.</Text> */}
        </View>
      </ExtendedModal>

      {/* User Profile Modal */}
      <PublicProfileModal
        user={selectedUser}
        visible={userProfileModal}
        onClose={() => {
          setUserProfileModal(false);
          setSelectedUser(null);
        }}
        onFriendRequestPress={handleFriendRequestPress}
      />
    </View>
  );
}