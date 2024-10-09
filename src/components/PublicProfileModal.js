import React from 'react';
import { View, Text, Image, Modal, TouchableOpacity, TouchableWithoutFeedback, FlatList } from 'react-native';
import CustomButton from './CustomButton'; // Ensure CustomButton is imported correctly
import newStyle from '../styles/style'; // Updated to use the new styles variable name
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
                style={newStyle.profileImage}
              />

              {/* User Stats Section */}
              <View style={newStyle.userStatsContainer}>
                {/* Row 1: Friends and Posts */}
                <View style={newStyle.userStatsRow}>
                  <View style={newStyle.userStatColumn}>
                    <Text style={[newStyle.userStatLabel, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>Travel-Buddies</Text>
                    <Text style={[newStyle.userStatValue, { color: isDarkMode ? '#CCCCCC' : '#555' }]}>{user.friendCount != null ? user.friendCount : 'N/A'}</Text>
                  </View>
                  <View style={newStyle.userStatColumn}>
                    <Text style={[newStyle.userStatLabel, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>Posts</Text>
                    <Text style={[newStyle.userStatValue, { color: isDarkMode ? '#CCCCCC' : '#555' }]}>{user.postCount != null ? user.postCount : 'N/A'}</Text>
                  </View>
                </View>

                {/* Row 2: Upvotes and Downvotes */}
                <View style={newStyle.userStatsRow}>
                  <View style={newStyle.userStatColumn}>
                    <Text style={[newStyle.userStatLabel, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>Upvotes</Text>
                    <Text style={[newStyle.userStatValue, { color: isDarkMode ? '#CCCCCC' : '#555' }]}>{user.upvotes != null ? user.upvotes : 'N/A'}</Text>
                  </View>
                  <View style={newStyle.userStatColumn}>
                    <Text style={[newStyle.userStatLabel, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>Downvotes</Text>
                    <Text style={[newStyle.userStatValue, { color: isDarkMode ? '#CCCCCC' : '#555' }]}>{user.downvotes != null ? user.downvotes : 'N/A'}</Text>
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
                        <Text style={[newStyle.modalTitleText, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>Friend List</Text>
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
                          <Text style={{ color: isDarkMode ? '#FFFDF3' : '#000' }}>No friends available</Text>
                        )}
                        <TouchableOpacity onPress={() => setFriendListVisible(false)} style={[newStyle.closeModalButton, { backgroundColor: isDarkMode ? '#444' : '#CCC' }]}>
                          <Text style={[newStyle.closeModalButtonText, { color: isDarkMode ? '#FFFDF3' : '#000' }]}>Close</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableWithoutFeedback>
                </Modal>
              )}

              {/* Friend Request Button */}
              <CustomButton
                onPress={onFriendRequestPress}
                title="Send Friend Request"
                isLoading={isLoading}
                disabled={isLoading}
              />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default UserProfileModal;
