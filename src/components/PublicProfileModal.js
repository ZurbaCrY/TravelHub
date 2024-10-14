import React, { useEffect, useState } from 'react';
import { View, Text, Image, Modal, TouchableOpacity, TouchableWithoutFeedback, FlatList } from 'react-native';
import CustomButton from './CustomButton'; // Ensure CustomButton is imported correctly
import newStyle from '../styles/style'; // Updated to use the new styles variable name
import FriendService from '../services/friendService';
import { useTranslation } from 'react-i18next';
import { useDarkMode } from '../context/DarkModeContext'; // Import DarkMode context

const UserProfileModal = ({
  isVisible,
  onClose,
  user,
  onFriendRequestPress,
  isLoading,
  friendListVisible,
  setFriendListVisible
}) => {

  const { t } = useTranslation();
  const [friendshipState, setFriendshipState] = useState(null);

  useEffect(() => {
    const fetchFriendshipState = async () => {
      if (user && user.user_id) {
        try {
          const friendshipState = await FriendService.getFriendshipStatus(user.user_id);
          // Assuming you have a state to store the friendship state
          setFriendshipState(friendshipState);
          console.log('Friendship state:', friendshipState);
        } catch (error) {
          console.error('Failed to fetch friendship state:', error);
        }
      }
    };

    fetchFriendshipState();
  }, [user]);

  const handleFriendRequestSend = async () => {
    try {
      await FriendService.sendFriendRequest(user.user_id);
      const friendshipState = await FriendService.getFriendshipStatus(user.user_id);
      setFriendshipState(friendshipState);
    } catch (error) {
      console.error('Failed to send friend request:', error);
    }
  };

  const handleFriendRequestAccept = async () => {
    try {
      console.log(friendshipState.request)
      await FriendService.respondToFriendRequest(requestId = friendshipState.request.friend_request_id, action = 'accept');
      setFriendshipState({ isFriend: true });
    } catch (error) {
      console.error('Failed to accept friend request:', error);
    }
  };

  const handleFriendRequestDecline = async () => {
    try {
      await FriendService.respondToFriendRequest(requestId = friendshipState.request.friend_request_id, action = 'decline');
      setFriendshipState({ request: null });
    } catch (error) {
      console.error('Failed to decline friend request:', error);
    }
  };

  const handleFriendRequestRevoke = async () => {
    try {
      await FriendService.respondToFriendRequest(requestId = friendshipState.request.friend_request_id, action = 'revoke');
      setFriendshipState({ request: null });
    } catch (error) {
      console.error('Failed to revoke friend request:', error);
    }
  };

  const handleFriendRemove = async () => {
    try {
      console.log('Removing friend:', user.user_id);
      await FriendService.removeFriend(user.user_id);
      setFriendshipState({ isFriend: false });
    } catch (error) {
      console.error('Failed to remove friend:', error);
    }
  };
  const { isDarkMode } = useDarkMode(); // Access Dark Mode state

  if (!user) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={[newStyle.modalBackground, { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)' }]}>
          <TouchableWithoutFeedback>
            <View style={[newStyle.modalContent, { backgroundColor: isDarkMode ? '#1C1C1C' : '#FFF' }]}>
              {/* Close Button (X) */}
              <TouchableOpacity style={newStyle.closeButtonX} onPress={onClose}>
                <Text style={[newStyle.closeButtonX, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>✖</Text>
              </TouchableOpacity>

              {/* User Info Section */}
              <Text style={[newStyle.modalTitleText, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>{user.username || 'N/A'}</Text>
              <Image
                source={{ uri: user.profilepicture_url || 'https://via.placeholder.com/100' }}
                style={newStyle.mediumProfileImage}
              />

              {/* User Stats Section */}
              <View style={newStyle.userStatsContainer}>
                {/* Row 1: Friends and Posts */}
                <View style={newStyle.userStatsRow}>
                  <View style={newStyle.userStatColumn}>
                    <Text style={[newStyle.userStatLabel, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>
                      {t('SCREENS.PROFILE.TRAVEL_BUDDIES')}
                    </Text>
                    <Text style={[newStyle.userStatValue, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>{user.friendCount != null ? user.friendCount : 'N/A'}</Text>
                  </View>
                  <View style={newStyle.userStatColumn}>
                    <Text style={[newStyle.userStatLabel, { color: isDarkMode ? '#FFFDF3' : '#555' }]}>
                      {t('SCREENS.PROFILE.POSTS')}
                    </Text>
                    <Text style={[newStyle.userStatValue, { color: isDarkMode ? '#CCCCCC' : '#555' }]}>{user.postCount != null ? user.postCount : 'N/A'}</Text>
                  </View>
                </View>

                {/* Row 2: Upvotes and Downvotes */}
                <View style={newStyle.userStatsRow}>
                  <View style={newStyle.userStatColumn}>
                    <Text style={[newStyle.userStatLabel, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>
                      {t('SCREENS.PROFILE.UPVOTES')}
                    </Text>
                    <Text style={[newStyle.userStatValue, { color: isDarkMode ? '#CCCCCC' : '#555' }]}>{user.upvotes != null ? user.upvotes : 'N/A'}</Text>
                  </View>
                  <View style={newStyle.userStatColumn}>
                    <Text style={[newStyle.userStatLabel, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>
                      {t('SCREENS.PROFILE.DOWNVOTES')}
                    </Text>
                    <Text style={[newStyle.userStatValue, { color: isDarkMode ? '#CCCCCC' : '#' }]}>{user.downvotes != null ? user.downvotes : 'N/A'}</Text>
                  </View>
                </View>
              </View>

              {/* Friend List Modal */}
              {friendListVisible && (
                <Modal
                  animationType="slide"
                  transparent={true}
                  visible={friendListVisible}
                  onRequestClose={() => setFriendListVisible(false)}
                >
                  <TouchableWithoutFeedback onPress={() => setFriendListVisible(false)}>
                    <View style={[newStyle.modalBackground, { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)' }]}>
                      <View style={[newStyle.modalContent, { backgroundColor: isDarkMode ? '#1C1C1C' : '#FFF' }]}>
                        <Text style={[newStyle.modalTitleText, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>
                          {t('SCREENS.PROFILE.TRAVEL_BUDDIES')}
                        </Text>
                        {user.friends && user.friends.length > 0 ? (
                          <FlatList
                            data={user.friends}
                            renderItem={({ item }) => (
                              <View style={[newStyle.friendCard, { backgroundColor: isDarkMode ? '#333' : '#F5F5F5' }]}>
                                <Image
                                  source={{ uri: item.profilepicture_url || 'https://via.placeholder.com/40' }}
                                  style={newStyle.smallProfileImage} 
                                />
                                <Text style={[newStyle.friendName, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>{item.username || 'N/A'}</Text>
                              </View>
                            )}
                            keyExtractor={(item) => item.id.toString()}
                          />
                        ) : (
                          <Text style={{ color: isDarkMode ? '#FFFDF3' : '#000' }}>
                            {t('SCREENS.PROFILE.NO_TRAVEL_BUDDIES')}
                          </Text>
                        )}
                        <TouchableOpacity onPress={() => setFriendListVisible(false)} style={newStyle.closeModalButton}>
                          <Text style={[newStyle.closeModalButtonText, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>
                            {t('CLOSE')}
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
              )}

              {friendshipState && !friendshipState.isFriend && !friendshipState.request && (
                <CustomButton
                  onPress={handleFriendRequestSend}
                  title={t('FRIENDS.REQUESTS.SEND')}
                  isLoading={isLoading}
                  disabled={isLoading}
                />
              )}

              {friendshipState && !friendshipState.isFriend && friendshipState.request && friendshipState.request.type === 'received' && (
                <View style={newStyle.containerRow}>
                  <CustomButton
                    wrapperStyle={{ width: '45%', marginRight: 10 }}
                    style={{ backgroundColor: 'green' }}
                    onPress={handleFriendRequestAccept}
                    title={t('FRIENDS.REQUESTS.ACCEPT')}
                    isLoading={isLoading}
                    disabled={isLoading}
                  />
                  <CustomButton
                    wrapperStyle={{ width: '45%', marginLeft: 'auto', marginRight: 0 }}
                    style={{ backgroundColor: 'red' }}
                    onPress={handleFriendRequestDecline}
                    title={t('FRIENDS.REQUESTS.DECLINE')}
                    isLoading={isLoading}
                    disabled={isLoading}
                  />
                </View>
              )}

              {friendshipState && !friendshipState.isFriend && friendshipState.request && friendshipState.request.type === 'sent' && (
                <CustomButton
                  onPress={handleFriendRequestRevoke}
                  title={t('FRIENDS.REQUESTS.REVOKE')}
                  isLoading={isLoading}
                  disabled={isLoading}
                />
              )}

              {friendshipState && friendshipState.isFriend && (
                <CustomButton
                  onPress={handleFriendRemove}
                  style={{ backgroundColor: 'red' }}
                  title={t('FRIENDS.REMOVE')}
                  isLoading={isLoading}
                  disabled={isLoading}
                />
              )}
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default UserProfileModal;
