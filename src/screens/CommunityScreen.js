import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Image, TouchableOpacity, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { useDarkMode } from '../context/DarkModeContext';
import AuthService from '../services/auth';
import { handleUpvote, handleDownvote, fetchPosts, createNewPost, deletePost, handleFilePicker } from '../backend/community';
import { styles } from '../styles/styles'; 
import CustomButton from '../components/CustomButton';
import PublicProfileModal from '../components/PublicProfileModal';
import friendService from '../services/friendService';
import { getUserStats } from '../services/getUserStats';

export default function CommunityScreen({ navigation }) {
  const user = AuthService.getUser();
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
      loadPosts(); // Refresh posts after deletion
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
    navigation.navigate('CommunityDetailScreen', { post });
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
    <View style={[styles.communityContainer, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <TouchableOpacity onPress={() => handleUserPress(item)}>
              <View style={styles.postHeader}>
                <Image source={{ uri: item.users.profilepicture_url }} style={styles.profileImage} />
                <Text style={styles.username}>{item.users.username}</Text>
              </View>
            </TouchableOpacity>

            {/* Delete Button in Top Right */}
            {item.users.username === user_username && (
              <TouchableOpacity style={custom.deleteButton} onPress={() => confirmDeletePost(item.id)}>
                <Image source={require('../assets/images/trash.png')} style={styles.icon} />
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => handlePostPress(item)}>
              {item.image_url && (
                <Image source={{ uri: item.image_url }} style={styles.postImage} />
              )}
              <Text style={styles.postText}>{item.content}</Text>
            </TouchableOpacity>
            <View style={styles.postFooter}>
              <TouchableOpacity onPress={() => handleUpvote(item.id, user.id, () => loadPosts())}>
                <Image source={require('../assets/images/thumbs-up.png')} style={styles.icon} />
              </TouchableOpacity>
              <Text style={styles.upvoteText}>{item.upvotes}</Text>
              <TouchableOpacity onPress={() => handleDownvote(item.id, user.id, () => loadPosts())}>
                <Image source={require('../assets/images/thumbs-down.png')} style={styles.icon} />
              </TouchableOpacity>
              <Text style={styles.downvoteText}>{item.downvotes}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id.toString()}
        refreshing={refreshing}
        onRefresh={loadPosts}
        contentContainerStyle={{ paddingBottom: 20 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <TouchableOpacity style={styles.newPostButton} onPress={() => setNewPostModalVisible(true)}>
        <Text style={styles.newPostButtonText}>New Post</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={newPostModalVisible}
        onRequestClose={() => setNewPostModalVisible(false)}
      >
        <TouchableWithoutFeedback onPress={() => setNewPostModalVisible(false)}>
          <View style={styles.modalContainer}>
            <TouchableWithoutFeedback>
              <View style={styles.modalView}>
                <Text style={styles.modalText}>Create New Post</Text>
                <TextInput
                  style={styles.input}
                  placeholder="What's on your mind?"
                  value={newPostContent}
                  onChangeText={(text) => setNewPostContent(text)}
                />
                <TouchableOpacity
                  onPress={async () => {
                    const image = await handleFilePicker();
                    setImageUrl(image);
                  }}
                >
                  <Image source={require('../assets/images/picture.png')} style={styles.uploadIcon} />
                </TouchableOpacity>
                {imageUrl && <Image source={{ uri: imageUrl }} style={styles.previewImage} />}
                <View style={styles.modalButtons}>
                  <TouchableOpacity style={styles.cancelButton} onPress={() => setNewPostModalVisible(false)}>
                    <Text style={styles.cancelButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.submitButton} onPress={handleCreateNewPost}>
                    <Text style={styles.submitButtonText}>Post</Text>
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
        friendListVisible={friendListVisible}
        setFriendListVisible={setFriendListVisible}
      />
    </View>
  );
}

// Styles for the delete button at the top right
const custom = StyleSheet.create({
  deleteButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
  },
});
