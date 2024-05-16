import 'react-native-url-polyfill/auto'
import React, { useState, useEffect } from 'react';import { View, Text, StyleSheet, FlatList, TextInput, Button, Image, TouchableOpacity } from 'react-native';
import { useDarkMode } from './DarkModeContext';
import { createClient } from '@supabase/supabase-js';

const REACT_APP_SUPABASE_URL = "https://zjnvamrbnqzefncmdpaf.supabase.co";
const REACT_APP_ANON_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpqbnZhbXJibnF6ZWZuY21kcGFmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTQ0NjgzMDIsImV4cCI6MjAzMDA0NDMwMn0.O4S0x7F-5df2hR218qrO4VJbDOLK1Gzsvb3a8SGqwvY";

const supabase = createClient(REACT_APP_SUPABASE_URL, REACT_APP_ANON_KEY);

export default function CommunityScreen() {
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
      const { data, error } = await supabase.from('posts').insert([{ content: newPostContent, author: 'Anonymous', upvotes: 0, downvotes: 0 }]);
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


  //Elemente der Communityseite  
  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
      <FlatList
        data={posts}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: isDarkMode ? '#374151' : '#E5E7EB', padding: 10, marginVertical: 5, width: 350, }}>
            <Text style={{ color: isDarkMode ? '#FFF' : '#000' }}>{item.content}</Text>
            <Text style={{ color: isDarkMode ? '#9CA3AF' : '#6B7280', fontSize: 12 }}>{item.author}</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 5 }}>
              <TouchableOpacity onPress={() => handleUpvote(item.id)}>
                <Image source={require('./images/thumbs-up.png')} style={{ width: 20, height: 20 }} />
                <Text style={{ color: isDarkMode ? '#FFF' : '#000', fontSize: 12, marginLeft: 3 }}>{item.upvotes}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => handleDownvote(item.id)}>
                <Image source={require('./images/thumbs-down.png')} style={{ width: 20, height: 20 }} />
                <Text style={{ color: isDarkMode ? '#FFF' : '#000', fontSize: 12, marginLeft: 3 }}>{item.downvotes}</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        keyExtractor={item => item.id.toString()}
      />
      <View style={{ flexDirection: 'row', alignItems: 'center', }}>
        <TextInput
          style={[styles.input, { backgroundColor: isDarkMode ? '#374151' : '#E5E7EB', color: isDarkMode ? '#FFF' : '#000' }]}
          placeholder="Was möchtest du teilen?"
          value={newPostContent}
          onChangeText={text => setNewPostContent(text)}
        />
        <Button
          title="Post"
          onPress={createNewPost}
        />
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
    width: '80%',
    height: 40,
    borderWidth: 1,
    borderRadius: 50,
    paddingHorizontal: 10,
    marginVertical: 10,
    marginTop: 'auto',
  },
});
