import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Image, TouchableOpacity, Modal } from 'react-native';
import { useDarkMode } from '../context/DarkModeContext';
import AuthService from '../services/auth';
import { handleUpvote, handleDownvote, fetchPosts, createNewPost, handleFilePicker } from '../backend/community';
import { styles } from '../styles/styles';

export default function CommunityScreen({ navigation }) {
  const user = AuthService.getUser();
  const user_username = user.user_metadata.username;
  const { isDarkMode } = useDarkMode();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);

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
    setModalVisible(false);
    loadPosts();
  };

  const navigateUserProfile = (user_id) => {
    navigation.navigate('PublicProfileScreen', { user_id: user_id })
  }

  const handlePostPress = (post) => {
    navigation.navigate('CommunityDetailScreen', { post });
  };

  return (
    <View style={[styles.communityContainer, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <TouchableOpacity onPress={() => navigateUserProfile(item.user_id)}>

              <View style={styles.postHeader}>
                <Image source={{ uri: item.users.profilepicture_url }} style={styles.profileImage} />
                <Text style={styles.username}>{item.users.username}</Text>
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handlePostPress(item)}>
              {item.image_url && (
                <Image source={{ uri: item.image_url }} style={styles.postImage} />
              )}
              <Text style={styles.postText}>{item.content}</Text>
            </TouchableOpacity>
            <View style={styles.postFooter}>
              <TouchableOpacity onPress={() => handleUpvote(item.id, loadPosts)}>
                <Image source={require('../assets/images/thumbs-up.png')} style={styles.icon} />
              </TouchableOpacity>
              <Text style={styles.upvoteText}>{item.upvotes}</Text>
              <TouchableOpacity onPress={() => handleDownvote(item.id, loadPosts)}>
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
        // Hier wird die graue Linie hinzugefügt
        ItemSeparatorComponent={() => <View style={styles.separator} />}
      />
      <TouchableOpacity style={styles.newPostButton} onPress={() => setModalVisible(true)}>
        <Text style={styles.newPostButtonText}>New Post</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
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
              <TouchableOpacity style={styles.cancelButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.submitButton} onPress={handleCreateNewPost}>
                <Text style={styles.submitButtonText}>Post</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
