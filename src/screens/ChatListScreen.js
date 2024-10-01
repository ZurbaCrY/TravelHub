import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View, Text, FlatList, TouchableOpacity, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { useDarkMode } from './DarkModeContext';
import { supabase } from '../User-Auth/supabase';
import AuthService from '../User-Auth/auth';
import Button from '../components/Button';
import { styles } from '../style/styles.js'; // Relativer Pfad
import PropTypes from 'prop-types';

export default function ChatListScreen({ navigation }) {
  const CURRENT_USER = AuthService.getUser();
  const CURRENT_USER_ID = CURRENT_USER.id;
  const { isDarkMode } = useDarkMode();
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    const messageSubscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, payload => {
        console.log('Change received!', payload);
        fetchChats();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, []);

  // Funktion zum Abrufen der Chats des aktuellen Benutzers
  const fetchChats = async () => {
    const { data, error } = await supabase
      .from('chat_user')
      .select('chat_id')
      .eq('user_id', CURRENT_USER_ID);

    if (error) {
      console.error(error);
      return;
    }

    const chatIds = data.map(chatUser => chatUser.chat_id);

    if (chatIds.length === 0) {
      console.log("No chats found for the current user.");
      return;
    }

    const { data: messages, error: messageError } = await supabase
      .from('messages')
      .select('chat_id, content, created_at, user_id')
      .in('chat_id', chatIds)
      .order('created_at', { ascending: false });

    if (messageError) {
      console.error('Error fetching messages:', messageError);
      return;
    }

    const chatMap = new Map();
    messages.forEach(message => {
      if (!chatMap.has(message.chat_id)) {
        chatMap.set(message.chat_id, message);
      }
    });

    const { data: chatData, error: chatError } = await supabase
      .from('chat')
      .select('*')
      .in('chat_id', Array.from(chatMap.keys()));

    if (chatError) {
      console.error('Error fetching chats:', chatError);
      return;
    }

    const userIds = Array.from(new Set(messages.map(message => message.user_id)));
    await fetchUsernames(userIds);

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

  // Funktion zum Abrufen der Benutzernamen basierend auf Benutzer-IDs
  const fetchUsernames = async (userIds) => {
    if (userIds.length === 0) {
      console.log("No user IDs to fetch.");
      return;
    }

    const { data, error } = await supabase
      .from('users')
      .select('user_id, username')
      .in('user_id', userIds);

    if (error) {
      console.error('Error fetching usernames:', error);
      return;
    }

    const usernameMap = data.reduce((acc, user) => {
      acc[user.user_id] = user.username;
      return acc;
    }, {});

    setUsernames(usernameMap);
  };

  const fetchUsername = async (userId) => {
    const { data, error } = await supabase
      .from('users')
      .select('username')
      .eq('user_id', userId)
      .single();

    if (error) {
      console.error(`Error fetching username for user_id ${userId}:`, error);
      return null;
    }

    return data.username;
  };

  const fetchUsers = async () => {
    const { data: allUsers, error: userError } = await supabase
      .from('users')
      .select('user_id, username')
      .neq('user_id', CURRENT_USER_ID);

    if (userError) {
      console.error('Error fetching users:', userError);
      return;
    }

    const { data: existingChats, error: chatError } = await supabase
      .from('chat_user')
      .select('chat_id')
      .eq('user_id', CURRENT_USER_ID);

    if (chatError) {
      console.error('Error fetching existing chats:', chatError);
      return;
    }

    const existingChatUserIds = await Promise.all(
      existingChats.map(async (chat) => {
        const { data, error } = await supabase
          .from('chat_user')
          .select('user_id')
          .eq('chat_id', chat.chat_id)
          .neq('user_id', CURRENT_USER_ID);

        if (error) {
          console.error('Error fetching chat users:', error);
          return [];
        }

        return data.map(user => user.user_id);
      })
    );

    const flattenedUserIds = existingChatUserIds.flat();

    const filteredUsers = allUsers.filter(user => !flattenedUserIds.includes(user.user_id));

    setUsers(filteredUsers);
  };

  const getChatUsers = async (chatId) => {
    const { data, error } = await supabase
      .from('chat_user')
      .select('user_id')
      .eq('chat_id', chatId);

    if (error) {
      console.error('Error fetching chat users:', error);
      return [];
    }

    return data;
  };

  const createNewChat = async () => {
    if (!selectedUser) {
      console.error('No user selected');
      return;
    }

    if (selectedUser.user_id === CURRENT_USER_ID) {
      Alert.alert('Fehler', 'Sie können keinen Chat mit sich selbst erstellen.');
      return;
    }

    const { data: existingChatUsers, error: existingChatError } = await supabase
      .from('chat_user')
      .select('chat_id')
      .eq('user_id', CURRENT_USER_ID)
      .in('chat_id', await (async () => {
        const { data, error } = await supabase
          .from('chat_user')
          .select('chat_id')
          .eq('user_id', selectedUser.user_id);
        if (error) {
          console.error('Error checking existing chats:', error);
          return [];
        }
        return data.map(d => d.chat_id);
      })());

    if (existingChatError) {
      console.error('Error checking existing chats:', existingChatError);
      return;
    }

    if (existingChatUsers.length > 0) {
      Alert.alert('Fehler', 'Ein Chat mit diesem Benutzer existiert bereits.');
      return;
    }

    const newChat = {
      chat_id: Date.now().toString(),
      created_at: new Date().toISOString(),
    };

    const { error: chatError } = await supabase
      .from('chat')
      .insert([newChat]);

    if (chatError) {
      console.error('Error creating new chat:', chatError);
      return;
    }

    const newChatUser = [
      {
        chat_id: newChat.chat_id,
        user_id: CURRENT_USER_ID,
      },
      {
        chat_id: newChat.chat_id,
        user_id: selectedUser.user_id,
      },
    ];

    const { error: chatUserError } = await supabase
      .from('chat_user')
      .insert(newChatUser);

    if (chatUserError) {
      console.error('Error creating chat user link:', chatUserError);
      return;
    }

    const initialMessage = {
      chat_id: newChat.chat_id,
      content: `Hallo ${selectedUser.username}`,
      user_id: CURRENT_USER_ID,
      created_at: new Date().toISOString(),
    };

    const { error: messageError } = await supabase
      .from('messages')
      .insert([initialMessage]);

    if (messageError) {
      console.error('Error creating initial message:', messageError);
      return;
    }

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

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#3EAAE9" />
        <Text>Loading Chats...</Text>
      </View>
    );
  } else {
    return (
      <View style={[styles.container, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
        <Button mode="contained" onPress={() => setModalVisible(true)}>
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
          onRequestClose={() => {
            setModalVisible(!modalVisible);
          }}
        >
          <TouchableWithoutFeedback onPress={() => setModalVisible(false)}>
            <View style={styles.modalOverlay} />
          </TouchableWithoutFeedback>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Wähle einen Benutzer für den Chat</Text>
            {users.map((user) => (
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
            ))}
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
