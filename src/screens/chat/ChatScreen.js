import React, { useState, useCallback, useEffect } from 'react';
import { View, Modal, Text, TouchableOpacity, Image } from 'react-native';
import { GiftedChat, MessageText } from 'react-native-gifted-chat';
import { useDarkMode } from '../../context/DarkModeContext.js';
import { supabase } from '../../services/supabase.js';
import PropTypes from 'prop-types';
import newStyle from '../../styles/style'; // Neuer relativer Pfad zu den Styles
import { useAuth } from '../../context/AuthContext.js';
import PublicProfileModal from '../../components/PublicProfileModal.js';
import { useLoading } from '../../context/LoadingContext.js';
import { getUserStats } from '../../services/getUserStats.js';
import FriendService from '../../services/friendService.js';
import { useTranslation } from 'react-i18next';

export default function ChatScreen({ route, navigation }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const CURRENT_USER = user;
  const CURRENT_USER_ID = CURRENT_USER.id;
  const { chatId, chatName, chatPartnerId, chatPartnerProfilePicutreUrl } = route.params;
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const { isDarkMode } = useDarkMode();
  const [userProfileModalVisible, setUserProfileModalVisible] = useState(false);
  const { showLoading, hideLoading } = useLoading();
  const [selectedUser, setSelectedUser] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: () => (
        <TouchableOpacity onPress={() => handleUserPress()} style={newStyle.headerTitleContainer}>
          <View style={[newStyle.containerRow, { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0)' : 'rgba(0, 0, 0, 0)' }]}>
            <View style={newStyle.marginTopMedium}>
              <Image source={{ uri: chatPartnerProfilePicutreUrl }} style={newStyle.extraSmallProfileImage} />
            </View>
            <View style={[newStyle.marginTopSmall, newStyle.marginLeftSmall]}>
            <Text style={[newStyle.titleText, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>{chatName}</Text>
            </View>
          </View>
        </TouchableOpacity>
      ),
      headerStyle: {
        backgroundColor: isDarkMode ? '#070A0F' : '#f8f8f8',
      },
      headerTintColor: isDarkMode ? '#f8f8f8' : '#18171c', // Farbe des Pfeils
    });
        
      
    const fetchMessages = async () => {
      try {
        const { data, error } = await supabase
          .from('messages')
          .select('id, content, created_at, chat_id, user_id, edited')
          .eq('chat_id', chatId)
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching messages:', error);
        } else {
          const formattedMessages = formatMessages(data);
          setMessages(formattedMessages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    const messageSubscription = supabase
      .channel(`public:messages:chat_id=eq.${chatId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` }, payload => {
        const newMessage = {
          _id: payload.new.id,
          text: payload.new.content,
          createdAt: new Date(payload.new.created_at),
          user: {
            _id: payload.new.user_id,
          },
          edited: payload.new.edited || false,
        };
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessage));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [chatId, chatName, navigation]);

  const handleUserPress = async () => {
    try {
      showLoading(t('LOADING.GETTING_USER_STATS'));
      const stats = await getUserStats(user_id = chatPartnerId);
      const selectedUserData = {
        user_id: chatPartnerId,
        username: chatName,
        profilepicture_url: chatPartnerProfilePicutreUrl,
        friendCount: stats.friendCount,
        upvotes: stats.upvoteCount,
        downvotes: stats.downvoteCount,
        postCount: stats.postCount
      };
      setSelectedUser(selectedUserData);
      setUserProfileModalVisible(true);
    } catch (error) {
      console.error('Error fetching user stats:', error);
    } finally {
      hideLoading();
    }
  };

  const formatMessages = (data) => {
    return data.map(message => ({
      _id: message.id,
      text: message.content,
      createdAt: new Date(message.created_at),
      user: { _id: message.user_id },
      edited: message.edited || false,
    }));
  };

  const onSend = useCallback(async (newMessages = []) => {
    if (isEditing && selectedMessage) {
      await updateMessage(selectedMessage._id, messageInput);
    } else {
      const message = newMessages[0];
      try {
        let { error } = await supabase
          .from('messages')
          .insert([
            {
              user_id: CURRENT_USER_ID,
              content: message.text,
              chat_id: chatId,
              created_at: new Date().toISOString(),
              edited: false,
            },
          ]);
        if (error) {
          console.error('Error sending message:', error);
        }
      } catch (error) {
        console.error('Error sending message:', error);
      }
    }
    setIsEditing(false);
    setMessageInput('');
  }, [isEditing, selectedMessage, messageInput]);

  const updateMessage = async (messageId, updatedContent) => {
    try {
      let { error } = await supabase
        .from('messages')
        .update({
          content: updatedContent,
          created_at: new Date().toISOString(),
          edited: true,
        })
        .eq('id', messageId);

      if (error) {
        console.error('Error updating message:', error);
      } else {
        setMessages(prevMessages =>
          prevMessages.map(msg => (msg._id === messageId ? { ...msg, text: updatedContent, edited: true } : msg))
        );
      }
    } catch (error) {
      console.error('Error updating message:', error);
    }
  };

  const deleteMessage = async () => {
    if (selectedMessage) {
      try {
        const { error } = await supabase
          .from('messages')
          .delete()
          .eq('id', selectedMessage._id)
          .eq('user_id', CURRENT_USER_ID);

        if (error) {
          console.error('Error deleting message:', error);
        } else {
          setMessages(prevMessages => prevMessages.filter(msg => msg._id !== selectedMessage._id));
          setDeleteModalVisible(false);

          const { count, error: countError } = await supabase
            .from('messages')
            .select('id', { count: 'exact' })
            .eq('chat_id', chatId);

          if (countError) {
            console.error('Error counting messages:', countError);
          } else if (count === 0) {
            const { error: chatDeleteError } = await supabase
              .from('chat_user')
              .delete()
              .eq('chat_id', chatId);

            if (chatDeleteError) {
              console.error('Error deleting chat:', chatDeleteError);
            } else {
              navigation.goBack();
            }
          }
        }
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const openEditModal = (message) => {
    setSelectedMessage(message);
    setMessageInput(message.text);
    setIsEditing(true);
    setDeleteModalVisible(false);
  };

  const handleLongPress = (context, message) => {
    if (message.user._id === CURRENT_USER_ID) {
      setSelectedMessage(message);
      setDeleteModalVisible(true);
    }
  };

  const renderMessageText = (props) => {
    const { currentMessage } = props;
    return (
      <View>
        <MessageText {...props} />
        {currentMessage.edited && (
          <Text style={newStyle.boldMiniText}>
            {t('CHAT.EDITED')}
          </Text>
        )}
      </View>
    );
  };

  const handleFriendRequestPress = async () => {
    try {
      showLoading(t('LOADING.SENDING_FRIEND_REQUEST'));
      await FriendService.sendFriendRequest(selectedUser.user_id);
    } catch (error) {
      console.error(error);
    } finally {
      hideLoading();
    }
  };

  return (
    <View style={[newStyle.containerNoMarginTop, { backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8' }]}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: CURRENT_USER_ID,
        }}
        text={messageInput}
        onInputTextChanged={(text) => setMessageInput(text)}
        textInputStyle={{ color: isDarkMode ? '#f8f8f8' : '#18171c' }}
        onLongPress={handleLongPress}
        renderMessageText={renderMessageText}
      />
  
      <Modal
        transparent={true}
        visible={isDeleteModalVisible}
        animationType="slide"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={[newStyle.modalBackground, { backgroundColor: isDarkMode ? 'rgba(0, 0, 0, 0.8)' : 'rgba(255, 255, 255, 0.8)' }]}>
          <View style={[newStyle.modalContent, { backgroundColor: isDarkMode ? '#18171c' : '#f8f8f8' }]}>
            <Text style={[newStyle.modalTitleText, { color: isDarkMode ? '#f8f8f8' : '#18171c' }]}>
              {t('SCREENS.CHAT.EDIT_OR_DELETE')}
            </Text>
            <TouchableOpacity style={[newStyle.primaryRedButton, { backgroundColor: isDarkMode ? '#8B0000' : '#FF6347' }]} onPress={deleteMessage}>
              <Text style={[newStyle.primaryButtonText, { color: isDarkMode ? '#f8f8f8' : '#f8f8f8' }]}>
                {t('SCREENS.CHAT.DELETE_MESSAGE')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={newStyle.primaryButton} onPress={() => openEditModal(selectedMessage)}>
              <Text style={newStyle.primaryButtonText}>
                {t('SCREENS.CHAT.EDIT_MESSAGE')}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity style={[newStyle.primaryButton, { backgroundColor: isDarkMode ? '#333' : '#DDD' }]} onPress={() => setDeleteModalVisible(false)}>
              <Text style={[newStyle.primaryButtonText, { color: isDarkMode ? '#f8f8f8' : '#000' }]}>
                {t('CANCEL')}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <PublicProfileModal
        isVisible={userProfileModalVisible}
        onClose={() => setUserProfileModalVisible(false)}
        user={selectedUser}
        onFriendRequestPress={handleFriendRequestPress}
        isLoading={loading}
      />
    </View>
  );
}  
ChatScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      chatId: PropTypes.number.isRequired || PropTypes.string.isRequired,
      chatName: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    setOptions: PropTypes.func.isRequired,
  }).isRequired,
};