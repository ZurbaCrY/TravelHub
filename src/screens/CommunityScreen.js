import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Image, TouchableOpacity } from 'react-native';
import { useDarkMode } from '../context/DarkModeContext';
import { supabase } from '../services/supabase';
import AuthService from '../services/auth';
import { handleFileUpload } from '../backend/fileUpload';
import { handleUpvote, handleDownvote } from '../backend/voteHandler'; // Importiere die Vote-Funktionen

export default function CommunityScreen() {
  const user = AuthService.getUser();
  const user_username = user.user_metadata.username;
  const { isDarkMode } = useDarkMode();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const { data, error } = await supabase.from('posts').select('*').order('timestamp', { ascending: false });
      if (error) {
        console.error('Error fetching posts:', error.message);
      } else {
        setPosts(data);
      }
    } catch (error) {
      console.error('Error fetching posts:', error.message);
    }
  };

  const createNewPost = async () => {
    try {
      let uploadedImageUrl = null;
      if (imageUrl) {
        const { error } = await supabase.storage.from('Storage').upload(`images/${imageUrl}`, imageUrl);
        if (error) throw error;
        uploadedImageUrl = imageUrl;
      }

      const { error } = await supabase.from('posts').insert([{
        content: newPostContent,
        author: user_username,
        image_url: uploadedImageUrl,
        upvotes: 0,
        downvotes: 0
      }]);

      if (error) {
        console.error('Error creating post:', error.message);
      } else {
        setNewPostContent('');
        setImageUrl(null);
        fetchPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error.message);
    }
  };

  const handleImageUpload = async () => {
    const result = await handleFileUpload();
    if (result) {
      setImageUrl(result);
    }
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
              <TouchableOpacity onPress={() => handleUpvote(item.id, fetchPosts)}>
                <Image source={require('../assets/images/thumbs-up.png')} style={styles.icon} />
              </TouchableOpacity>
              <Text style={styles.upvoteText}>{item.upvotes}</Text>
              <TouchableOpacity onPress={() => handleDownvote(item.id, fetchPosts)}>
                <Image source={require('../assets/images/thumbs-down.png')} style={styles.icon} />
              </TouchableOpacity>
              <Text style={styles.downvoteText}>{item.downvotes}</Text>
            </View>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Type here.."
          value={newPostContent}
          onChangeText={text => setNewPostContent(text)}
        />
        <TouchableOpacity onPress={handleImageUpload}>
          <Image source={require('../assets/images/picture.png')} style={styles.uploadIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={createNewPost}>
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
    paddingHorizontal: 10, // Padding an den Seiten
  },
  postCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginVertical: 10,
    width: '100%', // Setze die Breite auf 100%
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
    lineHeight: 20, // Erhöhe den Zeilenabstand für bessere Lesbarkeit
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10, // Füge oben einen Abstand hinzu
  },
  icon: {
    width: 25,
    height: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%', // Setze die Breite auf 100%
    marginBottom: 20,
    borderTopWidth: 1, // Füge oben eine Trennlinie hinzu
    borderTopColor: '#E1E1E1', // Farbe der Trennlinie
    paddingTop: 10, // Füge oben Padding hinzu
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
