import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, RefreshControl, FlatList, TextInput, Alert } from 'react-native';
import { handleDownvote, handleUpvote, fetchPosts, getUpvoters, getDownvoters, fetchComments, addComment, deletePost } from '../../backend/community'; 
import newStyle from '../../styles/style'; // Verwende die neue CSS-Datei
import { useAuth } from '../../context/AuthContext';
import { useDarkMode } from '../../context/DarkModeContext';

export default function CommunityDetailScreen({ route, navigation }) {
  const { post } = route.params;
  const {user} = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const { isDarkMode } = useDarkMode();
  const [postData, setPostData] = useState(post);
  const [upvoters, setUpvoters] = useState([]);
  const [downvoters, setDownvoters] = useState([]);
  const [showUpvoters, setShowUpvoters] = useState(false);
  const [showDownvoters, setShowDownvoters] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const upvoterList = await getUpvoters(post.id);
        const downvoterList = await getDownvoters(post.id);
        setUpvoters(upvoterList);
        setDownvoters(downvoterList);
      } catch (error) {
        console.error('Error fetching voters:', error);
      }
    };

    const fetchCommentsData = async () => {
      try {
        const commentsData = await fetchComments(post.id);
        setComments(commentsData);
      } catch (error) {
        console.error('Error fetching comments:', error);
      }
    };

    fetchVoters();
    fetchCommentsData();
  }, [post.id]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setRefreshing(true);
    try {
      const postsData = await fetchPosts();
      const updatedPost = postsData.find(p => p.id === post.id);
      if (updatedPost) {
        setPostData(updatedPost);
      }
      const commentsData = await fetchComments(post.id); 
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching posts: ', error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    loadPosts();
  };

  const handleSubmitComment = async () => {
    if (newComment.trim()) {
      try {
        await addComment(post.id, user.id, newComment);
        setNewComment('');
        const updatedComments = await fetchComments(post.id);
        setComments(updatedComments);
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      navigation.goBack(); // Navigate back to community feed after deletion
    } catch (error) {
      console.error('Error deleting post:', error);
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

  const renderVotersList = (voters) => (
    <FlatList
      data={voters}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={[newStyle.listItem, { backgroundColor: isDarkMode ? '#000' : '#FFF' }]}>
          <Image source={{ uri: item.profilepicture_url }} style={newStyle.smallProfileImage} />
          <Text style={[newStyle.listItemText, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>{item.username}</Text>
        </View>
      )}
    />
  );
  


  return (
    <View style={[newStyle.containerNoMarginTop, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
      <FlatList
        data={[postData]}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={() => (
          <>
            <View style={[newStyle.containerRow, { backgroundColor: isDarkMode ? '#000' : '#FFF' }]}>
              <Image source={{ uri: postData.users.profilepicture_url }} style={newStyle.mediumProfileImage} />
              <Text style={[newStyle.boldText, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>{postData.users.username}</Text>
  
              {/* Delete Button if the post belongs to the logged-in user */}
              {postData.users.username === user.user_metadata.username && (
                <TouchableOpacity style={newStyle.deleteButton} onPress={() => confirmDeletePost(postData.id)}>
                  <Image source={require('../../assets/images/trash.png')} style={[newStyle.icon, { tintColor: isDarkMode ? '#FFFDF3' : '#000' }]} />
                </TouchableOpacity>
              )}
            </View>
  
            {/* Post Image */}
            {postData.image_url && (
              <Image source={{ uri: postData.image_url }} style={[newStyle.postImage, { borderColor: isDarkMode ? '#555' : '#CCC' }]} />
            )}
            
            {/* Post Content */}
            <Text style={[newStyle.bodyText, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>{postData.content}</Text>
  
            {/* Upvotes and Downvotes Section */}
            <View style={newStyle.voteRow}>
              <View style={newStyle.voteContainer}>
                <TouchableOpacity onPress={() => handleUpvote(postData.id, user.id, loadPosts)}>
                  <Image source={require('../../assets/images/thumbs-up.png')} style={[newStyle.icon]} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowUpvoters(!showUpvoters)}>
                  <Text style={[newStyle.voteCount, { color: isDarkMode ? '#CCCCCC' : '#555555' }]}>{postData.upvotes} Upvotes</Text>
                </TouchableOpacity>
              </View>
              <View style={newStyle.voteContainer}>
                <TouchableOpacity onPress={() => handleDownvote(postData.id, user.id, loadPosts)}>
                  <Image source={require('../../assets/images/thumbs-down.png')} style={[newStyle.icon]} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowDownvoters(!showDownvoters)}>
                  <Text style={[newStyle.voteCount, { color: isDarkMode ? '#CCCCCC' : '#555555' }]}>{postData.downvotes} Downvotes</Text>
                </TouchableOpacity>
              </View>
            </View>
  
            {/* Upvoters Dropdown */}
            {showUpvoters && (
              <View style={[newStyle.updropdown, { backgroundColor: isDarkMode ? '#333' : '#FFF' }]}>
                {renderVotersList(upvoters)}
              </View>
            )}
  
            {/* Downvoters Dropdown */}
            {showDownvoters && (
              <View style={[newStyle.downdropdown, { backgroundColor: isDarkMode ? '#333' : '#FFF' }]}>
                {renderVotersList(downvoters)}
              </View>
            )}
  
            {/* Comment Section */}
            <View style={[newStyle.commentSection, { backgroundColor: isDarkMode ? '#1C1C1C' : '#FFF' }]}>
              <TextInput
                style={[newStyle.commentInput, { backgroundColor: isDarkMode ? '#333' : '#F5F5F5', color: isDarkMode ? '#FFFDF3' : '#000', borderColor: isDarkMode ? '#555' : '#CCC' }]}
                placeholder="Add a comment..."
                placeholderTextColor={isDarkMode ? '#777' : '#ccc'}
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity onPress={handleSubmitComment}>
                <Image source={require('../../assets/images/message_send.png')} style={{ width: 50, height: 50, tintColor: isDarkMode ? '#FFFDF3' : '#000' }} />
              </TouchableOpacity>
            </View>
  
            {/* Comments List */}
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={[newStyle.commentItem, { backgroundColor: isDarkMode ? '#1C1C1C' : '#FFF' }]}>
                  <Image source={{ uri: item.users.profilepicture_url }} style={newStyle.commentProfileImage} />
                  <Text style={[newStyle.commentUsername, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>{item.users.username}:</Text>
                  <Text style={[newStyle.commentText, { color: isDarkMode ? '#CCCCCC' : '#555555' }]}>{item.content}</Text>
                </View>
              )}
            />
          </>
        )}
      />
    </View>
  );
}  

