import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Button, Modal, TouchableWithoutFeedback, Alert } from 'react-native';
import { useDarkMode } from './DarkModeContext';
import { supabase } from '../User-Auth/supabase';
import AuthService from '../User-Auth/auth';

const CURRENT_USER_ID = AuthService.user.id; 
const CURRENT_USER_NAME = AuthService.user.username; 

export default function ChatListScreen({ navigation }) {
  const { isDarkMode } = useDarkMode();
  const [chats, setChats] = useState([]);
  const [users, setUsers] = useState([]);
  const [usernames, setUsernames] = useState({});
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetchChats();
    fetchUsers();

    // Subscription einrichten
    const messageSubscription = supabase
      .channel('public:messages')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'messages' }, payload => {
        console.log('Change received!', payload);
        fetchChats();
      })
      .subscribe();

    // Cleanup function
    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, []);

  const fetchChats = async () => {
    const { data, error } = await supabase
      .from('messages')
      .select('chat_id, user_id, username, content, created_at')
      .order('created_at', { ascending: false });

    if (error) {
      console.error(error);
    } else {
      // Gruppen Nachrichten nach chat_id und extrahieren die letzte Nachricht
      const chatMap = new Map();
      data.forEach((message) => {
        if (!chatMap.has(message.chat_id)) {
          chatMap.set(message.chat_id, message);
        }
      });

      setChats(Array.from(chatMap.values()));

      // Benutzer-IDs abrufen und zu Namen auflösen
      const userIds = Array.from(new Set(data.map(message => message.user_id)));
      fetchUsernames(userIds);
    }
  };

  const fetchUsernames = async (userIds) => {
    const { data, error } = await supabase
      .from('users')
      .select('user_id, username')
      .in('user_id', userIds);

    if (error) {
      console.error('Error fetching usernames:', error);
    } else {
      const usernameMap = data.reduce((acc, user) => {
        acc[user.user_id] = user.username;
        return acc;
      }, {});
      setUsernames(usernameMap);
    }
  };

  const fetchUsers = async () => {
    const { data, error } = await supabase
      .from('users')
      .select('user_id, username');

    if (error) {
      console.error('Error fetching users:', error);
    } else {
      setUsers(data);
    }
  };

  const createNewChat = async () => {
    if (!selectedUser) {
      console.error('No user selected');
      return;
    }

    // Überprüfen, ob bereits ein Chat mit dem ausgewählten Benutzer existiert
    const existingChat = chats.find(chat => 
      (chat.user_id === selectedUser.user_id && chat.username === CURRENT_USER_NAME) ||
      (chat.user_id === CURRENT_USER_ID && chat.username === selectedUser.username)
    );

    if (existingChat) {
      Alert.alert('Chat existiert bereits', `Es gibt bereits einen Chat mit ${selectedUser.username}`);
      return;
    }

    const newChat = {
      user_id: CURRENT_USER_ID,
      username: selectedUser.username,
      content: `Hallo ${selectedUser.username}`, // Personalized first message
      chat_id: Date.now().toString(), // Use a unique identifier for the new chat
      created_at: new Date().toISOString(),
    };

    const { error } = await supabase
      .from('messages')
      .insert([newChat]);

    if (error) {
      console.error('Error creating new chat:', error);
    } else {
      fetchChats();
      setModalVisible(false);
      navigation.navigate('ChatScreen', { chatId: newChat.chat_id, chatName: selectedUser.username });
    }
  };

  const getChatPartnerUsername = (chat) => {
    // Hier sicherstellen, dass der Chatpartner angezeigt wird
    if (chat.user_id === CURRENT_USER_ID) {
      return chat.username;
    } else {
      return usernames[chat.user_id] || 'Unknown User';
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.newChatButton}>
        <Text style={styles.newChatButtonText}>Neuen Chat erstellen</Text>
      </TouchableOpacity>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.chat_id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() => navigation.navigate('ChatScreen', { chatId: item.chat_id, chatName: getChatPartnerUsername(item) })}
            >
              <Text style={[styles.chatName, { color: isDarkMode ? '#FFF' : '#000' }]}>{getChatPartnerUsername(item)}</Text>
              <Text style={[styles.lastMessage, { color: isDarkMode ? '#AAA' : '#555' }]}>{item.content}</Text>
            </TouchableOpacity>
          );
        }}
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
          <Button title="Chat starten" onPress={createNewChat} disabled={!selectedUser} />
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 20,
  },
  newChatButton: {
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 20,
  },
  newChatButtonText: {
    color: '#FFF',
    fontSize: 16,
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
});
