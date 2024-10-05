import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, RefreshControl, FlatList, TextInput } from 'react-native';
import { handleDownvote, handleUpvote, fetchPosts, getUpvoters, getDownvoters, fetchComments, addComment } from '../../backend/community'; // Stelle sicher, dass addComment importiert wird
import AuthService from '../../services/auth';
import { styles } from '../../styles/styles';

export default function CommunityDetailScreen({ route, navigation }) {
  const { post } = route.params;
  const user = AuthService.getUser();
  const [refreshing, setRefreshing] = useState(false);
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
        const commentsData = await fetchComments(post.id); // Funktion zum Abrufen der Kommentare
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
        await addComment(post.id, user.id, newComment); // Funktion zum Hinzufügen eines Kommentars
        setNewComment('');
        // Kommentar nach dem Hinzufügen erneut abrufen
        const updatedComments = await fetchComments(post.id);
        setComments(updatedComments);
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    }
  };

  const renderVotersList = (voters) => (
    <FlatList
      data={voters}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.voterItem}>
          <Image source={{ uri: item.profilepicture_url }} style={styles.voterProfileImage} />
          <Text style={styles.voterUsername}>{item.username}</Text>
        </View>
      )}
    />
  );

  return (
    <View style={styles.CommunityDetailContainer}>
      <FlatList
        data={[postData]}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={() => (
          <>
            <View style={styles.postHeader}>
              <Image source={{ uri: postData.users.profilepicture_url }} style={styles.profileImage} />
              <Text style={styles.username}>{postData.users.username}</Text>
            </View>
            {postData.image_url && (
              <Image source={{ uri: postData.image_url }} style={styles.postImage} />
            )}
            <Text style={styles.postText}>{postData.content}</Text>

            {/* Upvotes and Downvotes Section */}
            <View style={styles.voteRow}>
              {/* Upvotes Section */}
              <View style={styles.voteContainer}>
                <TouchableOpacity onPress={() => handleUpvote(postData.id, user.id, loadPosts)}>
                  <Image source={require('../../assets/images/thumbs-up.png')} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowUpvoters(!showUpvoters)}>
                  <Text style={styles.voteCount}>{postData.upvotes} Upvotes</Text>
                </TouchableOpacity>
              </View>
              {/* Downvotes Section */}
              <View style={styles.voteContainer}>
                <TouchableOpacity onPress={() => handleDownvote(postData.id, user.id, loadPosts)}>
                  <Image source={require('../../assets/images/thumbs-down.png')} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowDownvoters(!showDownvoters)}>
                  <Text style={styles.voteCount}>{postData.downvotes} Downvotes</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Upvoters Dropdown */}
            {showUpvoters && (
              <View style={styles.updropdown}>
                {renderVotersList(upvoters)}
              </View>
            )}

            {/* Downvoters Dropdown */}
            {showDownvoters && (
              <View style={styles.downdropdown}>
                {renderVotersList(downvoters)}
              </View>
            )}

            {/* Comments Section */}
            <View style={styles.commentSection}>
              <TextInput
                style={styles.commentInput}
                placeholder="Add a comment..."
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity onPress={handleSubmitComment}>
                <Image source={require('../../assets/images/message_send.png')} style={{ width: 50, height: 50 }} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={styles.commentItem}>
                  <Image source={{ uri: item.users.profilepicture_url }} style={styles.commentProfileImage} />
                  <Text style={styles.commentUsername}>{item.users.username}:</Text>
                  <Text style={styles.commentText}>{item.content}</Text>
                </View>
              )}
            />
          </>
        )}
      />
    </View>
  );
}

