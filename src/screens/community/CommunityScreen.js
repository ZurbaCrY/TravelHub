import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Image, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useDarkMode } from '../../context/DarkModeContext';
import { handleUpvote, handleDownvote, fetchPosts, createNewPost, handleFilePicker, deletePost, fetchCountries } from '../../backend/community';
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
  const [selectedCountry, setSelectedCountry] = useState('');

  useEffect(() => {
    loadPosts();
    loadCountries(); // Lade die Länder beim Start
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

  const handleCreateNewPost = async () => {
    await createNewPost(newPostContent, user_username, imageUrl, selectedCountry);
    setNewPostContent('');
    setImageUrl(null);
    setSelectedCountry('');
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
    <View style={[newStyle.container, { backgroundColor: isDarkMode ? '#070A0F' : '#f8f8f8' }]}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={newStyle.postContainer}>
            <TouchableOpacity onPress={() => handleUserPress(item)}>
              <View style={newStyle.postHeader}>
                <Image source={{ uri: item.users.profilepicture_url }} style={newStyle.extraSmallProfileImage} />
                <Text style={newStyle.boldTextBig}>{item.users.username}</Text>
              </View>
            </TouchableOpacity>
            {item.users.username === user_username && (
              <TouchableOpacity onPress={() => confirmDeletePost(item.id)} style={newStyle.deleteButton}>
                <Image source={require('../../assets/images/trash.png')} style={newStyle.icon} />
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => handlePostPress(item)}>
                {item.Country && (
                  <Text style={newStyle.countryText}>
                    <Image source={require('../../assets/images/globus.png')} style={{width: 20, height: 20}} />
                    {item.Country.Countryname}
                  </Text>
                )}
              {item.image_url && <Image source={{ uri: item.image_url }} style={newStyle.postImage} />}
              <Text style={newStyle.postText}>{item.content}</Text>
            </TouchableOpacity>
            <View style={newStyle.voteRow}>
              <View style={newStyle.voteContainer}>
                <TouchableOpacity onPress={() => handleUpvote(item.id, loadPosts)}>
                  <Image source={require('../../assets/images/thumbs-up.png')} style={newStyle.icon} />
                </TouchableOpacity>
                <Text style={newStyle.voteCount}>{item.upvotes}</Text>
              </View>
              <View style={newStyle.voteContainer}>
                <TouchableOpacity onPress={() => handleDownvote(item.id, loadPosts)}>
                  <Image source={require('../../assets/images/thumbs-down.png')} style={newStyle.icon} />
                </TouchableOpacity>
                <Text style={newStyle.voteCount}>{item.downvotes}</Text>
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

      <TouchableOpacity style={newStyle.primaryButton} onPress={() => setNewPostModalVisible(true)}>
        <Text style={newStyle.primaryButtonText}>New Post</Text>
      </TouchableOpacity>

      {/* New Post Modal */}
      <Modal animationType="slide" transparent={true} visible={newPostModalVisible} onRequestClose={() => setNewPostModalVisible(false)}>
        <TouchableWithoutFeedback onPress={() => setNewPostModalVisible(false)}>
          <View style={newStyle.modalBackground}>
            <TouchableWithoutFeedback>
              <View style={newStyle.modalContent}>
                <Text style={newStyle.modalTitleText}>Create New Post</Text>
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
                <Picker selectedValue={selectedCountry} onValueChange={(itemValue) => setSelectedCountry(itemValue)}>
                  <Picker.Item label="Select a country" value="" />
                  {countries.map((country) => (
                    <Picker.Item key={country.id} label={country.name} value={country.id} />
                  ))}
                </Picker>
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
  );
}
