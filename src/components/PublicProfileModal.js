import React from 'react';
import { View, Text, Image, Modal, TouchableOpacity, TouchableWithoutFeedback, FlatList } from 'react-native';
import CustomButton from './CustomButton'; // Ensure CustomButton is imported correctly
import newStyle from '../styles/style'; // Updated to use the new styles variable name

const UserProfileModal = ({
  isVisible,
  onClose,
  user,
  onFriendRequestPress,
  isLoading,
  friendListVisible,
  setFriendListVisible
}) => {
  if (!user) return null;

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={newStyle.modalBackground}>
          <TouchableWithoutFeedback>
            <View style={newStyle.modalContent}>
              {/* Close Button (X) */}
              <TouchableOpacity style={newStyle.closeButtonX} onPress={onClose}>
                <Text style={newStyle.closeButtonX}>✖</Text>
              </TouchableOpacity>

              {/* User Info Section */}
              <Text style={newStyle.modalTitleText}>{user.username || 'N/A'}</Text>
              <Image
                source={{ uri: user.profilepicture_url || 'https://via.placeholder.com/100' }}
                style={newStyle.profileImage}
              />

              {/* User Stats Section */}
              <View style={newStyle.userStatsContainer}>
                {/* Row 1: Upvotes and Downvotes */}
                <View style={newStyle.userStatsRow}>
                  <View style={newStyle.userStatColumn}>
                    <Text style={newStyle.userStatLabel}>Upvotes</Text>
                    <Text style={newStyle.userStatValue}>{user.upvotes != null ? user.upvotes : 'N/A'}</Text>
                  </View>
                  <View style={newStyle.userStatColumn}>
                    <Text style={newStyle.userStatLabel}>Downvotes</Text>
                    <Text style={newStyle.userStatValue}>{user.downvotes != null ? user.downvotes : 'N/A'}</Text>
                  </View>
                </View>

                {/* Row 2: Friends and Posts */}
                <View style={newStyle.userStatsRow}>
                  <View style={newStyle.userStatColumn}>
                    <Text style={newStyle.userStatLabel}>Friends</Text>
                    <Text style={newStyle.userStatValue}>{user.friendCount != null ? user.friendCount : 'N/A'}</Text>
                  </View>
                  <View style={newStyle.userStatColumn}>
                    <Text style={newStyle.userStatLabel}>Posts</Text>
                    <Text style={newStyle.userStatValue}>{user.postCount != null ? user.postCount : 'N/A'}</Text>
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
                    <View style={newStyle.modalBackground}>
                      <View style={newStyle.modalContent}>
                        <Text style={newStyle.modalTitleText}>Friend List</Text>
                        {user.friends && user.friends.length > 0 ? (
                          <FlatList
                            data={user.friends}
                            renderItem={({ item }) => (
                              <View style={newStyle.friendCard}>
                                <Image
                                  source={{ uri: item.profilepicture_url || 'https://via.placeholder.com/40' }}
                                  style={newStyle.smallProfileImage} // Use the smaller image style
                                />
                                <Text style={newStyle.friendName}>{item.username || 'N/A'}</Text>
                              </View>
                            )}
                            keyExtractor={(item) => item.id.toString()}
                          />
                        ) : (
                          <Text>No friends available</Text>
                        )}
                        <TouchableOpacity onPress={() => setFriendListVisible(false)} style={newStyle.closeModalButton}>
                          <Text style={newStyle.closeModalButtonText}>Close</Text>
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
