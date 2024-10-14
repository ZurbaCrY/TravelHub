import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, SafeAreaView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDarkMode } from '../../context/DarkModeContext';
import { handleUpvote, handleDownvote, fetchPosts, createNewPost, handleFilePicker, deletePost, fetchCountries, fetchCitiesByCountry, fetchAttractionsByCity } from '../../backend/community';
import newStyle from '../../styles/style';
import CustomButton from '../../components/CustomButton';
import PublicProfileModal from '../../components/PublicProfileModal';
import FriendService from '../../services/friendService';
import { getUserStats } from '../../services/getUserStats';
import { useAuth } from '../../context/AuthContext';
import { useLoading } from '../../context/LoadingContext';

export default function CommunityScreen({ navigation }) {
  const { user } = useAuth();
  const user_username = user.user_metadata.username;
  const { isDarkMode } = useDarkMode();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [newPostModalVisible, setNewPostModalVisible] = useState(false);
  const [deletePostModalVisible, setDeletePostModalVisible] = useState(false);
  const [userProfileModal, setUserProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedPostId, setSelectedPostId] = useState(null);
  const [loading, setLoading] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);
  const [attractions, setAttractions] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCity, setSelectedCity] = useState(''); 
  const [selectedAttraction, setSelectedAttraction] = useState('');

  useEffect(() => {
    loadPosts();
    loadCountries(); 
  }, []);

  const loadPosts = async () => {
    setRefreshing(true);
    try {
      const postsData = await fetchPosts();
      setPosts(postsData);
    } catch (error) {
      console.error('Error fetching posts: ', error);
    } finally {
      setRefreshing(false);
    }
  };

  const loadCountries = async () => {
    try {
      const countriesData = await fetchCountries();
      setCountries(countriesData);
    } catch (error) {
      console.error('Error fetching countries: ', error);
    }
  };

  // Funktion zum Abrufen der Städte basierend auf dem ausgewählten Land
  const loadCities = async (countryId) => {
    try {
      const citiesData = await fetchCitiesByCountry(countryId);
      setCities(citiesData);
      setAttractions([]);
      setSelectedCity('');
    } catch (error) {
      console.error('Error fetching cities: ', error);
    }
  };

  // Funktion zum Abrufen der Attraktionen basierend auf der ausgewählten Stadt
  const loadAttractions = async (cityId) => {
    try {
      const attractionsData = await fetchAttractionsByCity(cityId);
      setAttractions(attractionsData);
    } catch (error) {
      console.error('Error fetching attractions: ', error);
    }
  };

  const handleCreateNewPost = async () => {
    await createNewPost(newPostContent, user_username, imageUrl, selectedCountry, selectedCity, selectedAttraction);
    setNewPostContent('');
    setImageUrl(null);
    setSelectedCountry('');
    setSelectedCity('');
    setSelectedAttraction('');
    setNewPostModalVisible(false);
    loadPosts();
  };

  const handleDeletePost = async () => {
    try {
      await deletePost(postId);
      loadPosts();
      await deletePost(selectedPostId);
      setDeletePostModalVisible(false);
      loadPosts();
    } catch (error) {
      console.error('Error deleting post: ', error);
    }
  };

  const confirmDeletePost = (postId) => {
    setSelectedPostId(postId);
    setDeletePostModalVisible(true);
  };

  const handlePostPress = (post) => {
    navigation.navigate('CommunityDetail', { post });
  };

  const handleUserPress = async (item) => {
    try {
      showLoading("Loading User Stats");
      const stats = await getUserStats(item.user_id);
      const selectedUserData = {
        user_id: item.user_id,
        username: item.users.username,
        profilepicture_url: item.users.profilepicture_url,
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
  };

  const handleFriendRequestPress = async () => {
    try {
      setLoading(true);
      await FriendService.sendFriendRequest(selectedUser.user_id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
  <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8' }}>
    <View style={[newStyle.container, { backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8' }]}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={[newStyle.postContainer, { backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8' }]}>
            <TouchableOpacity onPress={() => handleUserPress(item)}>
              <View style={newStyle.postHeader}>
                <Image source={{ uri: item.users.profilepicture_url }} style={newStyle.extraSmallProfileImage} />
                <Text style={[newStyle.boldTextBig, { color: isDarkMode ? '#FFFDF3' : '#18171c' }]}> {item.users.username}
</Text>

              </View>
            </TouchableOpacity>
            {item.users.username === user_username && (
              <TouchableOpacity onPress={() => confirmDeletePost(item.id)} style={newStyle.deleteButton}>
            <Image source={require('../../assets/images/trash.png')} style={[newStyle.icon, { tintColor: isDarkMode ? '#18171c' : '#f8f8f8' }]} />

              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => handlePostPress(item)}>
              {item.Country && (
                <Text style={[newStyle.countryText, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>
                  <Image source={require('../../assets/images/globus.png')} style={{ width: 20, height: 20 }} />
                  {item.Country.Countryname}
                </Text>
              )}
              {item.City && (
                <Text style={[newStyle.cityText, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>
                  <Image source={require('../../assets/images/city.png')} style={{ width: 20, height: 20 }} />
                  {item.City.Cityname}
                </Text>
              )}
              {item.Attraction && (
                <Text style={[newStyle.cityText, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>
                  <Image source={require('../../assets/images/attractions/attraction.png')} style={{ width: 20, height: 20 }} />
                  {item.Attraction.Attraction_Name}
                </Text>
              )}
           <Image source={{ uri: item.image_url }} style={[newStyle.postImage, { borderColor: isDarkMode ? '#555' : '#CCC' }]} />
           <Text style={[newStyle.postText, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>{item.content}</Text>
            </TouchableOpacity>
            <View style={newStyle.voteRow}>
              <View style={[newStyle.voteContainer, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>
                <TouchableOpacity onPress={() => handleUpvote(item.id, user.id, loadPosts)}>
                  <Image source={require('../../assets/images/thumbs-up.png')} style={newStyle.icon} />
                </TouchableOpacity>
                <Text style={[newStyle.voteCount, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>{item.upvotes}</Text>
              </View>
              <View style={newStyle.voteContainer}>
                <TouchableOpacity onPress={() => handleDownvote(item.id, user.id, loadPosts)}>
                  <Image source={require('../../assets/images/thumbs-down.png')} style={newStyle.icon} />
                </TouchableOpacity>
                <Text style={[newStyle.voteCount, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>{item.upvotes}</Text>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={loadPosts}
        contentContainerStyle={{ paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
      />

       <TouchableOpacity style={[newStyle.primaryButton, { backgroundColor: isDarkMode ? '#1E90FF' : '#007BFF' }]} onPress={() => setNewPostModalVisible(true)}>
    <Text style={[newStyle.primaryButtonText, { color: isDarkMode ? '#FFF' : '#FFF' }]}>New Post</Text>
  </TouchableOpacity>

      {/* New Post Modal */}
      <Modal animationType="slide" transparent={true} visible={newPostModalVisible} onRequestClose={() => setNewPostModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setNewPostModalVisible(false)}>
          <View style={newStyle.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={[newStyle.modalContent, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>
                <Text style={[newStyle.modalTitleText, { color: isDarkMode ? '#18171c' : '#18171c' }]}>Create New Post</Text>
                <TextInput
                  style={newStyle.inputField}
                  placeholder="What's on your mind?"
                  value={newPostContent}
                  onChangeText={(text) => setNewPostContent(text)}
                />
                <TouchableOpacity onPress={async () => { const image = await handleFilePicker(); setImageUrl(image); }}>
                  <Image source={require('../../assets/images/picture.png')} style={newStyle.iconBigCenter} />
                </TouchableOpacity>
                {imageUrl && <Image source={{ uri: imageUrl }} style={newStyle.postImage} />}

                {/* Country Picker */}
                <Picker selectedValue={selectedCountry} onValueChange={(itemValue) => {
                  setSelectedCountry(itemValue);
                  loadCities(itemValue); 
                  setSelectedCity(''); // Zurücksetzen der ausgewählten Stadt
                }}>
                  <Picker.Item label="Select a country" value="" />
                  {countries.map((country) => (
                    <Picker.Item key={country.id} label={country.name} value={country.id} />
                  ))}
                </Picker>

                {/* City Picker, nur sichtbar, wenn ein Land ausgewählt wurde */}
                {selectedCountry ? (
                  <Picker selectedValue={selectedCity} onValueChange={(itemValue) => {
                    setSelectedCity(itemValue);
                    loadAttractions(itemValue); // Lade die Attraktionen für die ausgewählte Stadt
                  }}>
                    <Picker.Item label="Select a city" value="" />
                    {cities.map((city) => (
                      <Picker.Item key={city.City_ID} label={city.Cityname} value={city.City_ID} />
                    ))}
                  </Picker>
                ) : null}

                {/* Attraction Dropdown, nur wenn ein Land und eine Stadt ausgewählt sind */}
                {selectedCountry && selectedCity && (
                  <Picker
                    selectedValue={selectedAttraction}
                    onValueChange={setSelectedAttraction}
                    style={newStyle.picker}
                  >
                    <Picker.Item label="Select Attraction" value="" />
                    {attractions.map((attraction) => (
                      <Picker.Item key={attraction.Attraction_ID} label={attraction.Attraction_Name} value={attraction.Attraction_ID} />
                    ))}
                  </Picker>
                )}
                <View style={newStyle.row}>
                  <TouchableOpacity style={newStyle.averageRedButton} onPress={() => setNewPostModalVisible(false)}>
                    <Text style={newStyle.smallButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={newStyle.averageBlueButton} onPress={handleCreateNewPost}>
                    <Text style={newStyle.smallButtonText}>Post</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      {/* Delete Post Modal */}
      <Modal animationType="slide" transparent={true} visible={deletePostModalVisible} onRequestClose={() => setDeletePostModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setDeletePostModalVisible(false)}>
          <View style={newStyle.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={newStyle.modalContent}>
                <Text style={newStyle.modalTitleText}>Confirm Delete</Text>
                <View style={newStyle.row}>
                  <TouchableOpacity style={newStyle.averageRedButton} onPress={() => setDeletePostModalVisible(false)}>
                    <Text style={newStyle.smallButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={newStyle.averageBlueButton} onPress={handleDeletePost}>
                    <Text style={newStyle.smallButtonText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>

      <PublicProfileModal
        isVisible={userProfileModal}
        onClose={() => setUserProfileModal(false)}
        user={selectedUser}
        onFriendRequestPress={handleFriendRequestPress}
        isLoading={loading}
      />
    </View>
    </SafeAreaView>
  );
}
