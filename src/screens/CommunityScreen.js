import 'react-native-url-polyfill/auto'
import React, { useState, useEffect } from 'react'; import { View, Text, StyleSheet, FlatList, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import { useDarkMode } from './DarkModeContext';
import { createClient } from '@supabase/supabase-js';
import * as ImagePicker from 'expo-image-picker';
import AuthService from '../User-Auth/auth';
import { supabase } from '../User-Auth/supabase';

export default function CommunityScreen() {
  user = AuthService.getUser();
  const user_username = user.user_metadata.username;
  const { isDarkMode, toggleDarkMode } = useDarkMode();
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
      const { data, error } = await supabase.from('posts').insert([{ content: newPostContent, author: user_username, upvotes: 0, downvotes: 0 }]);
      if (error) {
        console.error('Error creating post:', error.message);
      } else {
        console.log('Post created successfully');
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
      const { data: postData, error } = await supabase
        .from('posts')
        .select('downvotes')
        .eq('id', postId)
        .single();

      if (error) {
        throw error;
      }
      const updatedDownvotes = (postData.downvotes || 0) + 1;
      const { error: updateError } = await supabase
        .from('posts')
        .update({ downvotes: updatedDownvotes })
        .eq('id', postId);

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
      // Öffne den Dateiauswähler für den Benutzer
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
  
      // Überprüfe, ob das Bild ausgewählt wurde und nicht abgebrochen wurde
        console.log(result)
        const firstAsset = result.assets[0];
        const fileUri = firstAsset.uri;
        console.log(fileUri)
        const fileName = fileUri.substring(fileUri.lastIndexOf('/') + 1);
        console.log(fileName)
  
        // Lade das Bild hoch zu Supabase Storage
        const response = await fetch(fileUri);
        const blob = await response.blob();
        // const avatarFile = event.target.files[0]
        console.log(blob)
        const { data, error } = await supabase
          .storage
          .from('Storage')
          .upload('./images/picture.png', blob, {
          cacheControl: '3600',
          upsert: false
        });
  
        if (error) {
          throw error;
        }
  
        // Konstruiere den URI des hochgeladenen Bildes
        const imageUrl = `${REACT_APP_SUPABASE_URL}/storage/v1/object/Storage/${fileName}`;
        console.log('Image URL:', imageUrl);
    } catch (error) {
      console.error('Fehler beim Hochladen des Bildes:', error.message);
    }
  };
  
  



  //Elemente der Communityseite  
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: isDarkMode ? '#374151' : '#E5E7EB', padding: 10, marginVertical: 5, width: 350 }}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5, alignItems: 'center' }}>
              <Text style={{ color: isDarkMode ? '#FFF' : '#000' }}>{item.content}</Text>
              <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => handleUpvote(item.id)} style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}>
                  <Image source={require('./images/thumbs-up.png')} style={{ width: 20, height: 20 }} />
                  <Text style={{ color: isDarkMode ? '#FFF' : '#000', fontSize: 12, marginLeft: 3 }}>{item.upvotes}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => handleDownvote(item.id)} style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Image source={require('./images/thumbs-down.png')} style={{ width: 20, height: 20 }} />
                  <Text style={{ color: isDarkMode ? '#FFF' : '#000', fontSize: 12, marginLeft: 3 }}>{item.downvotes}</Text>
                </TouchableOpacity>
              </View>
            </View>
            <Text style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}>{item.author}</Text>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', }}>
        <TextInput
          style={[styles.input, { backgroundColor: isDarkMode ? '#374151' : '#E5E7EB', color: isDarkMode ? '#FFF' : '#000' }]}
          placeholder="Type here.."
          value={newPostContent}
          onChangeText={text => setNewPostContent(text)}
        />
        <TouchableOpacity onPress={handleImageUpload}>
          <Image source={require('./images/picture.png')} style={{ width: 50, height: 50 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={createNewPost}>
          <Image source={require('./images/message_send.png')} style={{ width: 55, height: 55 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

//Design 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    paddingTop: 20,
    flex: 1,
    justifyContent: 'flex-end',
  },
  input: {
    width: '70%',
    height: 40,
    borderWidth: 3,
    borderRadius: 50,
    paddingHorizontal: 10,
    marginVertical: 10,
    marginTop: 'auto',
    borderColor: '#8a8a8a'
  },
});
