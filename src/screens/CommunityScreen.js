import 'react-native-url-polyfill/auto';
import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, TextInput, Image, TouchableOpacity } from 'react-native';
import { useDarkMode } from './DarkModeContext';
import { supabase } from '../User-Auth/supabase';
import * as ImagePicker from 'expo-image-picker';
import AuthService from '../User-Auth/auth';
import { styles } from '../style/styles'; // Importiere die zentralisierten Styles

export default function CommunityScreen() {
  const user = AuthService.getUser();
  const user_username = user.user_metadata.username;
  const { isDarkMode } = useDarkMode();
  const [posts, setPosts] = useState([]);
  const [newPostContent, setNewPostContent] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  // Abrufen der geschriebenen Nachrichten
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

  // Abschicken einer Nachricht
  const createNewPost = async () => {
    try {
      const { error } = await supabase.from('posts').insert([{ content: newPostContent, author: user_username, upvotes: 0, downvotes: 0 }]);
      if (error) {
        console.error('Error creating post:', error.message);
      } else {
        setNewPostContent('');
        fetchPosts();
      }
    } catch (error) {
      console.error('Error creating post:', error.message);
    }
  };

  // Upvote geben für eine Nachricht
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

  // Downvote geben für eine Nachricht
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

  // Bild-Upload
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

        const { error } = await supabase
          .storage
          .from('Storage')
          .upload(`images/${fileName}`, blob, {
            cacheControl: '3600',
            upsert: false,
          });

        if (error) {
          throw error;
        }

        const imageUrl = `${process.env.REACT_APP_SUPABASE_URL}/storage/v1/object/public/Storage/images/${fileName}`;
        console.log('Image URL:', imageUrl);
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
          <View style={[styles.communityPostContainer, isDarkMode && styles.communityPostContainerDark]}>
            <View style={styles.postFooter}>
              <Text style={[styles.postContent, isDarkMode && styles.postContentDark]}>{item.content}</Text>
              <View style={styles.postActions}>
                <TouchableOpacity onPress={() => handleUpvote(item.id)} style={styles.voteButton}>
                  <Image source={require('./images/thumbs-up.png')} style={styles.voteIcon} />
                  <Text style={[styles.voteText, isDarkMode && styles.voteTextDark]}>{item.upvotes}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDownvote(item.id)} style={styles.voteButton}>
                  <Image source={require('./images/thumbs-down.png')} style={styles.voteIcon} />
                  <Text style={[styles.voteText, isDarkMode && styles.voteTextDark]}>{item.downvotes}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={[styles.postAuthor, isDarkMode && styles.postAuthorDark]}>{item.author}</Text>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <TextInput
          style={[styles.inputPost, { backgroundColor: isDarkMode ? '#374151' : '#E5E7EB', color: isDarkMode ? '#FFF' : '#000' }]}
          placeholder="Type here.."
          value={newPostContent}
          onChangeText={text => setNewPostContent(text)}
        />
        <TouchableOpacity onPress={handleImageUpload}>
          <Image source={require('./images/picture.png')} style={styles.imageIcon} />
        </TouchableOpacity>
        <TouchableOpacity onPress={createNewPost}>
          <Image source={require('./images/message_send.png')} style={styles.imageIcon} />
        </TouchableOpacity>
      </View>
    </View>
  );
}