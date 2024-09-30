import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, Image, TouchableOpacity } from 'react-native';
import { useDarkMode } from '../context/DarkModeContext';
import { supabase } from '../services/supabase';
import * as ImagePicker from 'expo-image-picker';
import AuthService from '../services/auth';
import { SUPABASE_URL, SUPABASE_KEY } from '@env';

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
      const { error } = await supabase.from('posts').insert([{ 
        content: newPostContent, 
        author: user_username, 
        image_url: imageUrl,  // Speichern der Bild-URL zusammen mit dem Post
        upvotes: 0, 
        downvotes: 0 
      }]);

      if (error) {
        console.error('Error creating post:', error.message);
      } else {
        setNewPostContent('');
        setImageUrl(null);  // Nach dem Post zurücksetzen
        fetchPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error.message);
    }
  };

  const handleUpvote = async (postId) => {
    try {
      const { data: postData, error } = await supabase.from('posts').select('upvotes', 'downvotes').eq('id', postId).single();
      if (error) {
        throw error;
      }
      const updatedUpvotes = postData.upvotes + 1;
      const { error: updateError } = await supabase.from('posts').update({ upvotes: updatedUpvotes }).eq('id', postId);
      if (updateError) {
        throw updateError;
      }
      fetchPosts();
    } catch (error) {
      console.error('Error upvoting post:', error.message);
    }
  };

  const handleDownvote = async (postId) => {
    try {
      const { data: postData, error } = await supabase.from('posts').select('downvotes').eq('id', postId).single();
      if (error) {
        throw error;
      }
      const updatedDownvotes = (postData.downvotes || 0) + 1;
      const { error: updateError } = await supabase.from('posts').update({ downvotes: updatedDownvotes }).eq('id', postId);
      if (updateError) {
        throw updateError;
      }
      fetchPosts();
    } catch (error) {
      console.error('Error downvoting post:', error.message);
    }
  };

  const handleImageUpload = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets.length > 0) {
        const firstAsset = result.assets[0];
        const fileUri = firstAsset.uri;
        const fileName = fileUri.substring(fileUri.lastIndexOf('/') + 1);

        const response = await fetch(fileUri);
        const blob = await response.blob();

        const { error } = await supabase.storage.from('Storage').upload(`images/${fileName}`, blob, {
          cacheControl: '3600',
          upsert: false,
        });

        if (error) {
          throw error;
        }

        const uploadedImageUrl = `${SUPABASE_URL}/storage/v1/object/public/Storage/images/${fileName}`;
        setImageUrl(uploadedImageUrl);  // Setze die Bild-URL für den neuen Post
      }
    } catch (error) {
      console.error('Fehler beim Hochladen des Bildes:', error.message);
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
            {/* Post Image, falls vorhanden */}
            {item.image_url && (
              <Image source={{ uri: item.image_url }} style={styles.postImage} />
            )}
            <Text style={styles.postText}>{item.content}</Text>
            {/* Post Footer mit Like/Dislike */}
            <View style={styles.postFooter}>
              <TouchableOpacity onPress={() => handleUpvote(item.id)}>
                <Image source={require('../assets/images/thumbs-up.png')} style={styles.icon} />
              </TouchableOpacity>
              <Text style={styles.upvoteText}>{item.upvotes}</Text>
              <TouchableOpacity onPress={() => handleDownvote(item.id)}>
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
    alignItems: 'center',
    paddingTop: 10,
  },
  postCard: {
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginVertical: 10,
    width: '95%',
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
  },
  postFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  icon: {
    width: 25,
    height: 25,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '95%',
    marginBottom: 20,
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
