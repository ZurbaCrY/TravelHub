import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { useDarkMode } from '../../context/DarkModeContext';
import { handleUpvote, handleDownvote, fetchPosts, createNewPost, handleFilePicker } from '../../backend/community';
import newStyle from '../../styles/style'; // Verwende die korrekte CSS-Datei
import CustomButton from '../../components/CustomButton';
import PublicProfileModal from '../../components/PublicProfileModal';
import friendService from '../../services/friendService';
import {getUserStats} from '../../services/getUserStats';
import { useAuth } from '../../context/AuthContext';

export default function CommunityScreen({ navigation }) {
  const {user } = useAuth();
  const user_username = user.user_metadata.username;
  const { isDarkMode } = useDarkMode();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [newPostModalVisible, setNewPostModalVisible] = useState(false);
  const [userProfileModal, setUserProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);
  const [friendListVisible, setFriendListVisible] = useState(false);

  useEffect(() => {
    loadPosts();
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

  const handleCreateNewPost = async () => {
    await createNewPost(newPostContent, user_username, imageUrl);
    setNewPostContent('');
    setImageUrl(null);
    setNewPostModalVisible(false);
    loadPosts();
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      loadPosts(); 
    } catch (error) {
      console.error('Error deleting post: ', error);
    }
  };

  const confirmDeletePost = (postId) => {
    Alert.alert(
      'Delete Post',
      'Are you sure you want to delete this post?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', onPress: () => handleDeletePost(postId), style: 'destructive' }
      ],
      { cancelable: true }
    );
  };

  const handlePostPress = (post) => {
    navigation.navigate('CommunityDetail', { post });
  };

  const handleUserPress = async (item) => {
    const stats = await getUserStats(user_id = item.user_id);
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
  };

  const handleFriendRequestPress = async () => {
    try {
      setLoading(true);
      await friendService.sendFriendRequest(selectedUser.user_id);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={[newStyle.container, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
  {/* FlatList to render all posts */}
  <FlatList
    data={posts}
    renderItem={({ item }) => (
      <View style={[newStyle.postContainer, { backgroundColor: isDarkMode ? '#333' : '#FFF' }]}>
        <TouchableOpacity onPress={() => handleUserPress(item)}>
          {/* Post header with user profile picture and username */}
          <View style={newStyle.postHeader}>
            <Image source={{ uri: item.users.profilepicture_url }} style={newStyle.smallProfileImage} />
            <Text style={[newStyle.boldTextBig, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>{item.users.username}</Text>
          </View>
        </TouchableOpacity>

        {/* Conditional delete button for posts owned by the user */}
        {item.users.username === user_username && (
          <TouchableOpacity onPress={() => confirmDeletePost(item.id)} style={newStyle.deleteButton}>
            {/* Trash icon with dynamic color */}
            <Image source={require('../../assets/images/trash.png')} style={[newStyle.icon, { tintColor: isDarkMode ? '#FFFDF3' : '#000' }]} />
          </TouchableOpacity>
        )}

        <TouchableOpacity onPress={() => handlePostPress(item)}>
          {/* Conditional post image display */}
          {item.image_url && (
            <Image source={{ uri: item.image_url }} style={[newStyle.postImage, { borderColor: isDarkMode ? '#555' : '#CCC' }]} />
          )}
          {/* Post content text */}
          <Text style={[newStyle.postText, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>{item.content}</Text>
        </TouchableOpacity>
        
        {/* Vote section for upvotes and downvotes */}
        <View style={newStyle.voteRow}>
          {/* Upvote button and count */}
          <View style={newStyle.voteContainer}>
            <TouchableOpacity onPress={() => handleUpvote(item.id, loadPosts)}>
              <Image source={require('../../assets/images/thumbs-up.png')} style={[newStyle.icon]} />
            </TouchableOpacity>
            <Text style={[newStyle.voteCount, { color: isDarkMode ? '#CCCCCC' : '#555555' }]}>{item.upvotes}</Text>
          </View>

          {/* Downvote button and count */}
          <View style={newStyle.voteContainer}>
            <TouchableOpacity onPress={() => handleDownvote(item.id, loadPosts)}>
              <Image source={require('../../assets/images/thumbs-down.png')} style={[newStyle.icon]} />
            </TouchableOpacity>
            <Text style={[newStyle.voteCount, { color: isDarkMode ? '#CCCCCC' : '#555555' }]}>{item.downvotes}</Text>
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

  {/* Button to create a new post */}
  <TouchableOpacity style={[newStyle.primaryButton, { backgroundColor: isDarkMode ? '#1E90FF' : '#007BFF' }]} onPress={() => setNewPostModalVisible(true)}>
    <Text style={[newStyle.primaryButtonText, { color: isDarkMode ? '#FFF' : '#FFF' }]}>New Post</Text>
  </TouchableOpacity>

  {/* Modal for creating a new post */}
  <Modal
    animationType="slide"
    transparent={true}
    visible={newPostModalVisible}
    onRequestClose={() => setNewPostModalVisible(false)}
  >
    <TouchableWithoutFeedback onPress={() => setNewPostModalVisible(false)}>
      <View style={[newStyle.modalBackground, { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)' }]}>
        <TouchableWithoutFeedback>
          <View style={[newStyle.modalContent, { backgroundColor: isDarkMode ? '#1C1C1C' : '#FFF' }]}>
            <Text style={[newStyle.modalTitleText, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>Create New Post</Text>

            {/* Text input for new post content */}
            <TextInput
              style={[newStyle.inputField, { backgroundColor: isDarkMode ? '#333' : '#F5F5F5', color: isDarkMode ? '#FFFDF3' : '#000', borderColor: isDarkMode ? '#555' : '#CCC' }]}
              placeholder="What's on your mind?"
              placeholderTextColor={isDarkMode ? '#777' : '#ccc'}
              value={newPostContent}
              onChangeText={(text) => setNewPostContent(text)}
            />

            {/* Image picker for new post */}
            <TouchableOpacity onPress={async () => {
              const image = await handleFilePicker();
              setImageUrl(image);
            }}>
              <Image source={require('../../assets/images/picture.png')} style={[newStyle.iconBigCenter, { tintColor: isDarkMode ? '#FFFDF3' : '#000' }]} />
            </TouchableOpacity>
            {imageUrl && <Image source={{ uri: imageUrl }} style={newStyle.postImage} />}

            {/* Buttons for canceling and posting new content */}
            <View style={newStyle.row}>
              <TouchableOpacity style={[newStyle.averageRedButton, { backgroundColor: isDarkMode ? '#8B0000' : '#FF6347' }]} onPress={() => setNewPostModalVisible(false)}>
                <Text style={[newStyle.smallButtonText, { color: isDarkMode ? '#FFFDF3' : '#FFF' }]}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[newStyle.averageBlueButton, { backgroundColor: isDarkMode ? '#1E90FF' : '#007BFF' }]} onPress={handleCreateNewPost}>
                <Text style={[newStyle.smallButtonText, { color: isDarkMode ? '#FFFDF3' : '#FFF' }]}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableWithoutFeedback>
      </View>
    </TouchableWithoutFeedback>
  </Modal>

  {/* Modal for public profile with dynamic friend request functionality */}
  <PublicProfileModal
    isVisible={userProfileModal}
    onClose={() => setUserProfileModal(false)}
    user={selectedUser}
    onFriendRequestPress={handleFriendRequestPress}
    isLoading={loading}
    friendListVisible={friendListVisible}
    setFriendListVisible={setFriendListVisible}
  />
</View>

  );
}
