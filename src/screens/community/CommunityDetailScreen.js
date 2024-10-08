import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, RefreshControl, FlatList, TextInput, Modal, TouchableWithoutFeedback } from 'react-native';
import { handleDownvote, handleUpvote, fetchPosts, getUpvoters, getDownvoters, fetchComments, addComment, deletePost } from '../../backend/community';
import newStyle from '../../styles/style'; // Verwende die neue CSS-Datei
import { useAuth } from '../../context/AuthContext';

export default function CommunityDetailScreen({ route, navigation }) {
  const { post } = route.params;
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const [postData, setPostData] = useState(post);
  const [upvoters, setUpvoters] = useState([]);
  const [downvoters, setDownvoters] = useState([]);
  const [showUpvoters, setShowUpvoters] = useState(false);
  const [showDownvoters, setShowDownvoters] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [isModalVisible, setModalVisible] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);

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

  const handleDeletePost = async () => {
    try {
      await deletePost(postToDelete);
      navigation.goBack(); // Navigate back to community feed after deletion
    } catch (error) {
      console.error('Error deleting post:', error);
    } finally {
      setModalVisible(false);
      setPostToDelete(null);
    }
  };

  const openDeleteModal = (postId) => {
    setPostToDelete(postId);
    setModalVisible(true);
  };

  const renderVotersList = (voters) => (
    <FlatList
      data={voters}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={newStyle.listItem}>
          <Image source={{ uri: item.profilepicture_url }} style={newStyle.smallProfileImage} />
          <Text style={newStyle.listItemText}>{item.username}</Text>
        </View>
      )}
    />
  );

  return (
    <View style={newStyle.containerNoMarginTop}>
      <FlatList
        data={[postData]}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={() => (
          <>
            <View style={newStyle.containerRow}>
              <Image source={{ uri: postData.users.profilepicture_url }} style={newStyle.mediumProfileImage} />
              <Text style={newStyle.boldTextBig}>{postData.users.username}</Text>
              {/* Delete Button if the post belongs to the logged-in user */}
              {postData.users.username === user.user_metadata.username && (
                <TouchableOpacity style={newStyle.deleteButton} onPress={() => openDeleteModal(postData.id)}>
                  <Image source={require('../../assets/images/trash.png')} style={newStyle.icon} />
                </TouchableOpacity>
              )}
            </View>
            {postData.Country && (
              <Text style={newStyle.countryText}>
                <Image source={require('../../assets/images/globus.png')} style={{ width: 20, height: 20 }} />
                {postData.Country.Countryname}
              </Text>
            )}
            {postData.City && (
                <Text style={newStyle.cityText}>
                  <Image source={require('../../assets/images/city.png')} style={{ width: 20, height: 20 }} />
                  {postData.City.Cityname}
                </Text>
              )}
            {postData.Attraction && (
                <Text style={newStyle.cityText}>
                  <Image source={require('../../assets/images/attractions/attraction.png')} style={{ width: 20, height: 20 }} />
                  {postData.Attraction.Attraction_Name}
                </Text>
              )}
            {postData.image_url && (
              <Image source={{ uri: postData.image_url }} style={newStyle.postImage} />
            )}
            <Text style={newStyle.bodyText}>{postData.content}</Text>
            {/* Upvotes and Downvotes Section */}
            <View style={newStyle.voteRow}>
              <View style={newStyle.voteContainer}>
                <TouchableOpacity onPress={() => handleUpvote(postData.id, user.id, loadPosts)}>
                  <Image source={require('../../assets/images/thumbs-up.png')} style={newStyle.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowUpvoters(!showUpvoters)}>
                  <Text style={newStyle.voteCount}>{postData.upvotes} Upvotes</Text>
                </TouchableOpacity>
              </View>
              <View style={newStyle.voteContainer}>
                <TouchableOpacity onPress={() => handleDownvote(postData.id, user.id, loadPosts)}>
                  <Image source={require('../../assets/images/thumbs-down.png')} style={newStyle.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowDownvoters(!showDownvoters)}>
                  <Text style={newStyle.voteCount}>{postData.downvotes} Downvotes</Text>
                </TouchableOpacity>
              </View>
            </View>

            {showUpvoters && (
              <View style={newStyle.updropdown}>
                {renderVotersList(upvoters)}
              </View>
            )}

            {showDownvoters && (
              <View style={newStyle.downdropdown}>
                {renderVotersList(downvoters)}
              </View>
            )}

            <View style={newStyle.commentSection}>
              <TextInput
                style={newStyle.commentInput}
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
                <View style={newStyle.commentItem}>
                  <Image source={{ uri: item.users.profilepicture_url }} style={newStyle.commentProfileImage} />
                  <Text style={newStyle.commentUsername}>{item.users.username}:</Text>
                  <Text style={newStyle.commentText}>{item.content}</Text>
                </View>
              )}
            />
          </>
        )}
      />

      {/* Modal for Delete Confirmation */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={newStyle.modalBackground}>
          <TouchableWithoutFeedback>
            <View style={newStyle.modalContent}>
              <Text style={newStyle.modalTitleText}>Confirm Delete</Text>
              <View style={newStyle.row}>
                <TouchableOpacity style={newStyle.averageRedButton} onPress={() => setModalVisible(false)}>
                  <Text style={newStyle.smallButtonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={newStyle.averageBlueButton} onPress={handleDeletePost}>
                  <Text style={newStyle.smallButtonText}>Delete</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </View>
  );
}
