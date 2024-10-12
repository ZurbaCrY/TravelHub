import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback, Alert, Image } from 'react-native';
import { useDarkMode } from '../../context/DarkModeContext';
import { supabase } from '../../services/supabase';
import AuthService from '../../services/auth';
import Button from '../../components/Button';
import styles from '../../styles/style';
import PropTypes from 'prop-types';
import { useFocusEffect } from '@react-navigation/native';
import { useLoading } from '../../context/LoadingContext.js'
import { useAuth } from '../../context/AuthContext.js';
import { getProfilePictureUrlByUserId } from '../../services/getProfilePictureUrlByUserId';
import { useTranslation } from 'react-i18next';

const fetchFromSupabase = async (table, select, filters = []) => {
  let query = supabase.from(table).select(select);
  filters.forEach(([key, operator, value]) => {
    query = query[key](operator, value);
  });

  const { data, error } = await query;
  if (error) {
    console.error(`Error fetching data from ${table}:`, error);
    return [];
  }
  return data;
};

export default function ChatListScreen({ navigation }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const CURRENT_USER = user;
  const CURRENT_USER_ID = CURRENT_USER.id;
  const { isDarkMode } = useDarkMode();
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [existingChatUserIds, setExistingChatUserIds] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const { loading, showLoading, hideLoading } = useLoading();

  useFocusEffect(
    React.useCallback(() => {
      const fetchChatsAndUsers = async () => {
        try {
          showLoading(t('LOADING_MESSAGE.CHATS'));
          await fetchChats();
          await fetchUsers();
        } catch (error) {
          console.error('Error fetching chats and users:', error);
        } finally {
          hideLoading();
        }
      };
      fetchChatsAndUsers();
    }, [])
  );

  const fetchChats = async () => {
    const chatUserData = await fetchFromSupabase('chat_user', 'chat_id', [['eq', 'user_id', CURRENT_USER_ID]]);
    const chatIds = chatUserData.map(chatUser => chatUser.chat_id);

    if (chatIds.length === 0) {
      console.log("No chats found for the current user.");
      return;
    }

    const messages = await fetchFromSupabase('messages', 'chat_id, content, created_at, user_id', [['in', 'chat_id', chatIds]]);
    const chatMap = new Map();
    messages.forEach(message => {
      if (!chatMap.has(message.chat_id) || new Date(message.created_at) > new Date(chatMap.get(message.chat_id).created_at)) {
        chatMap.set(message.chat_id, message);
      }
    });

    const chatData = await fetchFromSupabase('chat', '*', [['in', 'chat_id', Array.from(chatMap.keys())]]);
    const userIds = Array.from(new Set(messages.map(message => message.user_id)));

    const chatList = await Promise.all(chatData.map(async (chat) => {
      const chatUsers = await getChatUsers(chat.chat_id);
      const chatPartner = chatUsers.find(user => user.user_id !== CURRENT_USER_ID);
      const chatPartnerUsername = await fetchUsername(chatPartner.user_id);
      const chatPartnerProfilePicutreUrl = await getProfilePictureUrlByUserId(chatPartner.user_id);
      return {
        ...chat,
        latestMessage: chatMap.get(chat.chat_id),
        chatPartnerId: chatPartner.user_id || null,
        chatPartnerUsername: chatPartnerUsername || 'Unknown User',
        chatPartnerProfilePicutreUrl: chatPartnerProfilePicutreUrl || null,
      };
    }));

    chatList.sort((a, b) => new Date(b.latestMessage.created_at) - new Date(a.latestMessage.created_at));
    setChats(chatList);
  };


  const fetchUsers = async () => {
    const allUsers = await fetchFromSupabase('users', 'user_id, username', [['neq', 'user_id', CURRENT_USER_ID]]);
    const existingChats = await fetchFromSupabase('chat_user', 'chat_id', [['eq', 'user_id', CURRENT_USER_ID]]);

    const existingChatUserIds = await Promise.all(
      existingChats.map(async (chat) => {
        const chatUsers = await fetchFromSupabase('chat_user', 'user_id', [['eq', 'chat_id', chat.chat_id], ['neq', 'user_id', CURRENT_USER_ID]]);
        return chatUsers.map(user => user.user_id);
      })
    );

    const flattenedUserIds = existingChatUserIds.flat();
    setExistingChatUserIds(flattenedUserIds);

    const availableUsers = allUsers.filter(user => !flattenedUserIds.includes(user.user_id));
    setUsers(availableUsers);
  };

  const getChatUsers = async (chatId) => {
    return await fetchFromSupabase('chat_user', 'user_id', [['eq', 'chat_id', chatId]]);
  };

  const fetchUsername = async (userId) => {
    const [user] = await fetchFromSupabase('users', 'username', [['eq', 'user_id', userId]]);
    return user ? user.username : null;
  };

  const createNewChat = async () => {
    if (!selectedUser || selectedUser.user_id === CURRENT_USER_ID) {
      Alert.alert(t('ERROR'), t('SCREENS.CHAT.NEW_CHAT_OWN_USER'));
      return;
    }
    const newChat = { chat_id: Date.now(), created_at: new Date().toISOString() };
    await supabase.from('chat').insert([newChat]);
    const newChatUser = [
      { chat_id: newChat.chat_id, user_id: CURRENT_USER_ID },
      { chat_id: newChat.chat_id, user_id: selectedUser.user_id },
    ];
    await supabase.from('chat_user').insert(newChatUser);

    const initialMessage = { chat_id: newChat.chat_id, content: `Hallo ${selectedUser.username}`, user_id: CURRENT_USER_ID, created_at: new Date().toISOString(), edited: false };
    await supabase.from('messages').insert([initialMessage]);

    const chatPartnerProfilePicutreUrl = await getProfilePictureUrlByUserId(selectedUser.user_id);

    fetchChats();
    setModalVisible(false);
    navigation.navigate('Chat', { chatId: newChat.chat_id, chatName: selectedUser.username, chatPartnerId: selectedUser.user_id, chatPartnerProfilePicutreUrl: chatPartnerProfilePicutreUrl });
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.postContainer, styles.containerRow]}
      onPress={() => navigation.navigate('Chat',
        {
          chatId: item.chat_id,
          chatName: item.chatPartnerUsername,
          chatPartnerId: item.chatPartnerId,
          chatPartnerProfilePicutreUrl: item.chatPartnerProfilePicutreUrl
        }
      )}
    >
      <View style={styles.marginTopMedium}>
        <Image source={{ uri: item.chatPartnerProfilePicutreUrl }} style={styles.smallProfileImage} />
      </View>
      <View style={styles.containerNoMarginTop}>
        <Text style={styles.titleText}>{item.chatPartnerUsername}</Text>
        <Text style={styles.smallBodyText}>{item.latestMessage.content}</Text>
      </View>
    </TouchableOpacity>
  );

  const renderUserItem = (user) => (
    <TouchableOpacity
      key={user.user_id}
      style={[
        styles.postContainer,
        selectedUser && selectedUser.user_id === user.user_id && styles.selectedUserItem
      ]}
      onPress={() => setSelectedUser(user)}
    >
      <Text style={selectedUser && selectedUser.user_id === user.user_id ? styles.selectedText : styles.bodyText}>{user.username}</Text>
    </TouchableOpacity>
  );

  if (loading) return null;

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#070A0F' : '#f8f8f8' }]}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.chat_id.toString()}
        renderItem={renderChatItem}
      />
      <TouchableOpacity
        style={styles.newChatButton}
        onPress={() => {
          setSelectedUser(null);
          fetchUsers();
          setModalVisible(true);
        }}
      >
        <Text style={styles.newChatButtonText}>+</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(!modalVisible)}
      >
        <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
          <View style={styles.modalBackground} />
        </TouchableWithoutFeedback>
        <View style={styles.modalContentWidth}>
          <Text style={styles.modalTitleText}>
            {t('SCREENS.CHAT.NEW_CHAT_CHOOSE_USER')}
          </Text>
          {users.length > 0 ? (
            users.map(renderUserItem)
          ) : (
            <Text style={styles.bodyText}>
              {t('SCREENS.CHAT.NEW_CHAT_NO_USERS')}
              </Text>
          )}
          <Button onPress={createNewChat} disabled={!selectedUser}>
            {t('SCREENS.CHAT.NEW_CHAT_CREATE_CHAT')}
          </Button>
        </View>
      </Modal>
    </View>
  );
}


ChatListScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};