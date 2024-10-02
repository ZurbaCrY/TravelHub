import React, { useState } from 'react';
import { ActivityIndicator, View, Text, FlatList, TouchableOpacity, StyleSheet, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { useDarkMode } from '../context/DarkModeContext';
import { supabase } from '../services/supabase';
import AuthService from '../services/auth';
import Button from '../components/Button';
import { styles as st} from '../styles/styles.js'; // Relativer Pfad
import PropTypes from 'prop-types';
import { useFocusEffect } from '@react-navigation/native';

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
  const CURRENT_USER = AuthService.getUser();
  const CURRENT_USER_ID = CURRENT_USER.id;
  const { isDarkMode } = useDarkMode();
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [existingChatUserIds, setExistingChatUserIds] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchChatsAndUsers = async () => {
        try {
          await fetchChats();
          await fetchUsers();
        } catch (error) {
          console.error('Error fetching chats and users:', error);
        } finally {
          setLoading(false);
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
      return {
        ...chat,
        latestMessage: chatMap.get(chat.chat_id),
        chatPartnerUsername: chatPartnerUsername || 'Unknown User'
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
      Alert.alert('Fehler', 'Sie können keinen Chat mit sich selbst erstellen.');
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

    fetchChats();
    setModalVisible(false);
    navigation.navigate('ChatScreen', { chatId: newChat.chat_id, chatName: selectedUser.username });
  };

  const renderChatItem = ({ item }) => (
    <TouchableOpacity
      style={styles.chatItem}
      onPress={() => navigation.navigate('ChatScreen', { chatId: item.chat_id, chatName: item.chatPartnerUsername })}
    >
      <Text style={[styles.chatName, { color: isDarkMode ? '#FFF' : '#000' }]}>{item.chatPartnerUsername}</Text>
      <Text style={[styles.lastMessage, { color: isDarkMode ? '#AAA' : '#555' }]}>{item.latestMessage.content}</Text>
    </TouchableOpacity>
  );

  const renderUserItem = (user) => (
    <TouchableOpacity
      key={user.user_id}
      style={[
        styles.userItem,
        selectedUser && selectedUser.user_id === user.user_id && styles.selectedUserItem
      ]}
      onPress={() => setSelectedUser(user)}
    >
      <Text style={styles.userName}>{user.username}</Text>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={st.container}>
        <ActivityIndicator size="large" color="#3EAAE9" />
        <Text>Loading Chats...</Text>
      </View>
    );
  } else {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
        <Button mode="contained" onPress={() => {
          setSelectedUser(null); 
          fetchUsers();
          setModalVisible(true);
        }}>
          Neuen Chat erstellen
        </Button>
        <FlatList
          data={chats}
          keyExtractor={(item) => item.chat_id}
          renderItem={renderChatItem}
        />
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(!modalVisible)}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Wähle einen Benutzer für den Chat</Text>
            {users.length > 0 ? (
              users.map(renderUserItem)
            ) : (
              <Text style={styles.noUsersText}>Keine neuen Benutzer verfügbar</Text>
            )}
            <Button onPress={createNewChat} disabled={!selectedUser}>Chat starten</Button>
          </View>
        </Modal>
      </View>
    );
  }
}

ChatListScreen.propTypes = {
  navigation: PropTypes.shape({
    navigate: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  chatItem: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  chatName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  lastMessage: {
    fontSize: 14,
    marginTop: 5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  userItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  selectedUserItem: {
    backgroundColor: '#007BFF',
  },
  userName: {
    fontSize: 16,
  },
  noUsersText: {
    textAlign: 'center',
    marginTop: 20,
    fontSize: 16,
    color: '#999',
  },
});