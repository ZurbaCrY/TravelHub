import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Image, TouchableOpacity } from 'react-native';
import { useDarkMode } from '../context/DarkModeContext';
import AuthService from '../services/auth';
import { handleFileUpload } from '../backend/community/fileUpload';
import { handleUpvote, handleDownvote, fetchPosts, createNewPost } from '../backend/community/dataInserts';

export default function CommunityScreen() {
  const user = AuthService.getUser();
  const user_username = user.user_metadata.username;
  const { isDarkMode } = useDarkMode();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [imageUrl, setImageUrl] = useState(null);
  const [refreshing, setRefreshing] = useState(false);

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
    loadPosts(); 
  };
  
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={styles.postCard}>
            <View style={styles.postHeader}>
              <Image source={require('../assets/images/profilepicture.png')} style={styles.profileImage} />
              <Text style={styles.username}>{item.author}</Text>
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
        contentContainerStyle={{ paddingBottom: 20 }} // Ensure there's padding at the bottom
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type here.."
          value={newPostContent}
          onChangeText={text => setNewPostContent(text)}
        />
        <TouchableOpacity onPress={() => handleFileUpload()}>
          <Image source={require('../assets/images/picture.png')} style={styles.uploadIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleCreateNewPost}>
          <Image source={require('../assets/images/message_send.png')} style={styles.sendIcon} />
        </TouchableOpacity>
      </View>
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
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 20,
    borderTopWidth: 1,
    borderTopColor: '#E1E1E1',
    paddingTop: 10,
  },
  input: {
    flex: 1,
    height: 40,
    backgroundColor: '#F1F1F1',
    borderRadius: 20,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  uploadIcon: {
    width: 40,
    height: 40,
  },
  sendIcon: {
    width: 40,
    height: 40,
  },
});
