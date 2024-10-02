import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Image, TouchableOpacity, Modal} from 'react-native';
import { useDarkMode } from '../context/DarkModeContext';
import AuthService from '../services/auth';
import { handleUpvote, handleDownvote, fetchPosts, createNewPost, handleFilePicker } from '../backend/community';
import { styles } from '../style/styles'; // Importiere die zentralisierten Styles

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
      console.error("Error fetching posts: ", error);
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

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image source={{ uri: item.users.profilepicture_url }} style={styles.profileImage} />
              <Text style={styles.username}>{item.users.username}</Text>
            </View>
            {item.image_url && (
              <Image source={{ uri: item.image_url }} style={styles.postImage} />
            )}
            <Text style={styles.postText}>{item.content}</Text>
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
        keyExtractor={item => item.id.toString()}
        refreshing={refreshing}
        onRefresh={loadPosts}
        contentContainerStyle={{ paddingBottom: 20 }}
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
              onChangeText={text => setNewPostContent(text)}
            />
            <TouchableOpacity onPress={async () => {
              const image = await handleFilePicker(); 
              setImageUrl(image); 
            }}>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  postCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginVertical: 10,
    width: '100%',
    padding: 15,
  },
  newPostButton: {
    backgroundColor: '#3498DB',
    borderRadius: 20,
    padding: 15,
    marginBottom: 10,
    alignItems: 'center',
    width: '100%', 
  },
  newPostButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    textAlign: 'center', 
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  username: {
    marginLeft: 10,
    fontWeight: 'bold',
  },
  postImage: {
    width: '100%',
    height: 300,
    marginVertical: 10,
    borderRadius: 10,
  },
  postText: {
    marginVertical: 5,
    lineHeight: 20,
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  icon: {
    width: 25,
    height: 25,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    width: '90%',
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
  },
  modalText: {
    fontSize: 18,
    marginBottom: 10,
  },
  input: {
    width: '100%',
    height: 40,
    backgroundColor: '#F1F1F1',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginBottom: 15,
  },
  uploadIcon: {
    width: 40,
    height: 40,
    marginBottom: 15,
  },
  previewImage: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 15,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
  },
  cancelButton: {
    backgroundColor: '#E74C3C',
    borderRadius: 10,
    padding: 10,
    width: '48%',
    alignItems: 'center',
  },
  cancelButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  submitButton: {
    backgroundColor: '#3498DB',
    borderRadius: 10,
    padding: 10,
    width: '48%',
    alignItems: 'center',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

