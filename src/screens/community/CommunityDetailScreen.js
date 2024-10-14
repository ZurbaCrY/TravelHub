import React, { useState, useEffect } from 'react';
import { View, Text, Image, TouchableOpacity, RefreshControl, FlatList, TextInput, Modal, TouchableWithoutFeedback,  SafeAreaView } from 'react-native';
import { handleDownvote, handleUpvote, fetchPosts, getUpvoters, getDownvoters, fetchComments, addComment, deletePost } from '../../backend/community';
import newStyle from '../../styles/style'; // Verwende die neue CSS-Datei
import { useAuth } from '../../context/AuthContext';
import PublicProfileModal from '../../components/PublicProfileModal';
import { useLoading } from '../../context/LoadingContext';
import { getUserStats } from '../../services/getUserStats';
import { useTranslation } from 'react-i18next';
import { useDarkMode } from '../../context/DarkModeContext';

export default function CommunityDetailScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { post } = route.params;
  const { user } = useAuth();
  const [refreshing, setRefreshing] = useState(false);
  const { isDarkMode } = useDarkMode();
  const [postData, setPostData] = useState(post);
  const [upvoters, setUpvoters] = useState([]);
  const [downvoters, setDownvoters] = useState([]);
  const [showUpvoters, setShowUpvoters] = useState(false);
  const [showDownvoters, setShowDownvoters] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [userProfileModal, setUserProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const { loading, showLoading, hideLoading } = useLoading();
  const [isModalVisible, setModalVisible] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
  const [isUpvoterModalVisible, setUpvoterModalVisible] = useState(false);
  const [isDownvoterModalVisible, setDownvoterModalVisible] = useState(false);



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
      console.error('Error loading posts: ', error);
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
        <View style={[newStyle.listItem, { backgroundColor: isDarkMode ? '#f8f8f8' : '#18171c' }]}>
          <Image source={{ uri: item.profilepicture_url }} style={newStyle.mediumProfileImage} />
          <Text style={[newStyle.listItemText, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>{item.username}</Text>
        </View>
      )}
    />
  );

  const handleUserPress = async (item) => {
    try {
      showLoading(t('LOADING_MESSAGE.USER'));
      const stats = await getUserStats(user_id = item.user_id);
      const selectedUserData = {
        user_id: item.user_id,
        username: item.users.username,
        profilepicture_url: item.users.profilepicture_url,
        friendCount: stats.friendCount,
        upvotes: stats.upvoteCount,
        downvotes: stats.downvoteCount,
        postCount: stats.postCount
      };
      setSelectedUser(selectedUserData);
      setUserProfileModal(true);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      hideLoading();
    }
  }

  const handleFriendRequestPress = async () => {
    try {
      showLoading(t('LOADING_MESSAGE.FRIEND_REQUEST'));
      await friendService.sendFriendRequest(selectedUser.user_id);
    } catch (error) {
      console.error('Error sending friend request:', error);
    } finally {
      hideLoading();
    }
  }

  const openUpvoterModal = () => setUpvoterModalVisible(true);
  const closeUpvoterModal = () => setUpvoterModalVisible(false);

  const openDownvoterModal = () => setDownvoterModalVisible(true);
  const closeDownvoterModal = () => setDownvoterModalVisible(false);


  return (
  <SafeAreaView style={{ flex: 1, backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8' }}>  
    <View style={[newStyle.containerNoMarginTop, { backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8' }]}>
      <FlatList
        data={[postData]}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={() => (
          <>
          <View style={[newStyle.containerRow, { backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8' }]}>
              {/* Username and Profilepicture */}
              <TouchableOpacity onPress={() => handleUserPress(postData)}>
                <View style={newStyle.postHeader}>
                  {postData.users.anonymous ? (
                    <>
                      <Image
                        source={require('../../assets/images/account.png')}
                        style={newStyle.extraSmallProfileImage}
                      />
                      <Text style={newStyle.boldTextBig}>Anonymous</Text>
                    </>
                  ) : (
                    <>
                      <Image
                        source={{ uri: postData.users.profilepicture_url }}
                        style={newStyle.extraSmallProfileImage}
                      />
                      <Text style={[newStyle.boldTextBig, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>{postData.users.username}</Text>
                    </>
                  )}
                </View>
              </TouchableOpacity>
  
              {/* Delete Button if the post belongs to the logged-in user */}
              {postData.users.username === user.user_metadata.username && (
                <TouchableOpacity
                  style={newStyle.deleteButton}
                  onPress={() => openDeleteModal(postData.id)}
                >
                  <Image
                    source={require('../../assets/images/trash.png')}
                    style={newStyle.icon}
                  />
                </TouchableOpacity>
              )}
            </View>
  
            {/* Country, City, Attraction Info */}
            {postData.Country && (
              <Text style={[newStyle.countryText, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>
                <Image
                  source={require('../../assets/images/globus.png')}
                  style={{ width: 20, height: 20 }}
                />
                {postData.Country.Countryname}
              </Text>
            )}
            {postData.City && (
              <Text style={[newStyle.cityText, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>
                <Image
                  source={require('../../assets/images/city.png')}
                  style={{ width: 20, height: 20 }}
                />
                {postData.City.Cityname}
              </Text>
            )}
            {postData.Attraction && (
              <Text style={[newStyle.cityText, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>
                <Image
                  source={require('../../assets/images/attractions/attraction.png')}
                  style={{ width: 20, height: 20 }}
                />
                {postData.Attraction.Attraction_Name}
              </Text>
            )}
  
            {/* Post Image and Content */}
            {postData.image_url && (
              <Image
                source={{ uri: postData.image_url }}
                style={newStyle.postImage}
              />
            )}
            <Text style={newStyle.bodyText}>{postData.content}</Text>
  
            {/* Upvotes and Downvotes Section */}
            <View style={newStyle.voteRow}>
              <View style={newStyle.voteContainer}>
                <TouchableOpacity
                  onPress={() => handleUpvote(postData.id, user.id, loadPosts)}
                >
                  <Image
                    source={require('../../assets/images/thumbs-up.png')}
                    style={newStyle.icon}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={openUpvoterModal}>
                  <Text style={[newStyle.voteCount, { color: isDarkMode ? '#CCCCCC' : '#555555' }]}>
                    {postData.upvotes}
                    {t('SCREENS.COMMUNITY.UPVOTES')}
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={newStyle.voteContainer}>
                <TouchableOpacity
                  onPress={() => handleDownvote(postData.id, user.id, loadPosts)}
                >
                  <Image
                    source={require('../../assets/images/thumbs-down.png')}
                    style={newStyle.icon}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={openDownvoterModal}>
                  <Text style={[newStyle.voteCount, { color: isDarkMode ? '#CCCCCC' : '#555555' }]}>
                    {postData.downvotes}
                    {t('SCREENS.COMMUNITY.DOWNVOTES')}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
  
            {/* Voters List */}
            {showUpvoters && (
              <View style={[newStyle.updropdown, { backgroundColor: isDarkMode ? '#333' : '#FFF' }]}>{renderVotersList(upvoters)}</View>
            )}
            {showDownvoters && (
              <View style={[newStyle.downdropdown, { backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8' }]}>
                {renderVotersList(downvoters)}
              </View>
            )}
  
            {/* Comments Section */}
            <View style={[newStyle.commentSection, { backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8' }]}>
              <TextInput
                style={[newStyle.commentInput, { backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8', color: isDarkMode ? '#FFFDF3' : '#000', borderColor: isDarkMode ? '#555' : '#CCC' }]}
                placeholder="Add a comment..."
                placeholderTextColor={isDarkMode ? '#777' : '#ccc'}
                value={newComment}
                onChangeText={setNewComment}
              />
              <TouchableOpacity onPress={handleSubmitComment}>
                <Image
                  source={require('../../assets/images/message_send.png')}
                  style={{ width: 50, height: 50 }}
                />
              </TouchableOpacity>
            </View>
  
            {/* Display Comments */}
            <FlatList
              data={comments}
              keyExtractor={(item) => item.id.toString()}
              renderItem={({ item }) => (
                <View style={[newStyle.commentItem, { backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8' }]}>
                  <TouchableOpacity onPress={() => handleUserPress(item)}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      {item.users.anonymous ? (
                        <Image
                          source={require('../../assets/images/account.png')}
                          style={newStyle.commentProfileImage}
                        />
                      ) : (
                        <Image
                          source={{ uri: item.users.profilepicture_url }}
                          style={newStyle.commentProfileImage}
                        />
                      )}
                      <Text style={[newStyle.commentUsername, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>
                        {item.users.anonymous ? 'Anonymous' : item.users.username}
                        :
                      </Text>
                    </View>
                  </TouchableOpacity>
                  <Text style={[newStyle.commentText, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}> {item.content}
    </Text>

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
            <View style={[newStyle.modalContent, { backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8' }]}>
              <Text style={[newStyle.modalTitleText, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>{t('CONFIRM_DELETE')}</Text>
              <View style={newStyle.row}>
                <TouchableOpacity
                  style={newStyle.averageRedButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={newStyle.smallButtonText}>{t('CANCEL')}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={newStyle.averageBlueButton}
                  onPress={handleDeletePost}
                >
                  <Text style={newStyle.smallButtonText}>{t('DELETE')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
  
      {/* Modal for Upvoters */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isUpvoterModalVisible}
        onRequestClose={closeUpvoterModal}
      >
        <View style={newStyle.modalBackground}>
          <TouchableWithoutFeedback onPress={closeUpvoterModal}>
            <View style={newStyle.modalContent}>
              <Text style={newStyle.modalTitleText}>Upvoters</Text>
              <View>{renderVotersList(upvoters)}</View>
              <View style={newStyle.row}>
                <TouchableOpacity
                  style={[newStyle.averageRedButton, { width: '100%' }]}
                  onPress={closeUpvoterModal}
                >
                  <Text style={newStyle.smallButtonText}>{t('BACK')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
  
      {/* Modal for Downvoters */}
      <Modal
        transparent={true}
        animationType="slide"
        visible={isDownvoterModalVisible}
        onRequestClose={closeDownvoterModal}
      >
        <View style={newStyle.modalBackground}>
          <TouchableWithoutFeedback onPress={closeDownvoterModal}>
            <View style={newStyle.modalContent}>
              <Text style={newStyle.modalTitleText}>
                {t('SCREENS.COMMUNITY.DOWNVOTERS')}
              </Text>
              <View>{renderVotersList(downvoters)}</View>
              <View style={newStyle.row}>
                <TouchableOpacity
                  style={[newStyle.averageRedButton, { width: '100%' }]}
                  onPress={closeDownvoterModal}
                >
                  <Text style={newStyle.smallButtonText}>{t('BACK')}</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    </View>
    </SafeAreaView>
  );  
}
