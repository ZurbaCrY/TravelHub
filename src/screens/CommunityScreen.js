import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Image, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { useDarkMode } from '../context/DarkModeContext';
import AuthService from '../services/auth';
import { handleUpvote, handleDownvote, fetchPosts, createNewPost, handleFilePicker } from '../backend/community';
import newStyle from '../styles/style'; // Verwende die korrekte CSS-Datei
import CustomButton from '../components/CustomButton';
import PublicProfileModal from '../components/PublicProfileModal';
import friendService from '../services/friendService';
import {getUserStats} from '../services/getUserStats';

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
    <View style={[newStyle.container, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={newStyle.postContainer}>
            <TouchableOpacity onPress={() => handleUserPress(item)}>
              <View style={newStyle.postHeader}>
                <Image source={{ uri: item.users.profilepicture_url }} style={newStyle.commentProfileImage} />
                <Text style={newStyle.boldTextLeft}>{item.users.username}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePostPress(item)}>
              {item.image_url && (
                <Image source={{ uri: item.image_url }} style={newStyle.postImage} />
              )}
              <Text style={newStyle.postText}>{item.content}</Text>
            </TouchableOpacity>
            <View style={newStyle.voteRow}>
              <View style={newStyle.voteContainer}>
                <TouchableOpacity onPress={() => handleUpvote(item.id, loadPosts)}>
                  <Image source={require('../assets/images/thumbs-up.png')} style={newStyle.icon} />
                </TouchableOpacity>
                <Text style={newStyle.voteCount}>{item.upvotes}</Text>
              </View>
              <View style={newStyle.voteContainer}>
                <TouchableOpacity onPress={() => handleDownvote(item.id, loadPosts)}>
                  <Image source={require('../assets/images/thumbs-down.png')} style={newStyle.icon} />
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
      <Modal
        animationType="slide"
        transparent={true}
        visible={newPostModalVisible}
        onRequestClose={() => setNewPostModalVisible(false)}
      >
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
                <TouchableOpacity
                  onPress={async () => {
                    const image = await handleFilePicker();
                    setImageUrl(image);
                  }}
                >
                  <Image source={require('../assets/images/picture.png')} style={newStyle.iconBig} />
                </TouchableOpacity>
                {imageUrl && <Image source={{ uri: imageUrl }} style={newStyle.postImage} />}
                <View style={newStyle.row}>
                  <TouchableOpacity style={newStyle.smallButton} onPress={() => setNewPostModalVisible(false)}>
                    <Text style={newStyle.smallButtonText}>Cancel</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={newStyle.smallButton} onPress={handleCreateNewPost}>
                    <Text style={newStyle.smallButtonText}>Post</Text>
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