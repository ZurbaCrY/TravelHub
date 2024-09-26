import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { useDarkMode } from '../context/DarkModeContext';
import { supabase } from '../services/supabase';
import AuthService from '../services/auth';
import PropTypes from 'prop-types';


export default function ChatScreen({ route, navigation }) {
  const CURRENT_USER = AuthService.getUser();
  const CURRENT_USER_ID = CURRENT_USER.id;
  const { chatId, chatName } = route.params;
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null); // Nachricht für das Löschen
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false); // Sichtbarkeit des Lösch-Menüs
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    navigation.setOptions({ title: chatName });

    const fetchMessages = async () => {
      try {
        console.log(`Fetching messages for chatId: ${chatId}`);
        const { data, error } = await supabase
          .from('messages')
          .select('id, content, created_at, chat_id, user_id')
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
        };
        setMessages(previousMessages => GiftedChat.append(previousMessages, newMessage));
      })
      .subscribe();

    return () => {
      supabase.removeChannel(messageSubscription);
    };
  }, [chatId, chatName, navigation]);

  const formatMessages = (data) => {
    return data.map(message => ({
      _id: message.id,
      text: message.content,
      createdAt: new Date(message.created_at),
      user: { _id: message.user_id },
    }));
  };

  const onSend = useCallback(async (newMessages = []) => {
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
          },
        ]);
      if (error) {
        console.error('Error sending message:', error);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [chatId]);

  const deleteMessage = async () => {
    if (selectedMessage) {
      try {
        const { error } = await supabase
          .from('messages')
          .delete()
          .eq('id', selectedMessage._id);
          
        if (error) {
          console.error('Error deleting message:', error);
        } else {
          setMessages(prevMessages => prevMessages.filter(msg => msg._id !== selectedMessage._id));
          setDeleteModalVisible(false);
        }
      } catch (error) {
        console.error('Error deleting message:', error);
      }
    }
  };

  const openDeleteModal = (message) => {
    setSelectedMessage(message);
    setDeleteModalVisible(true);
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: CURRENT_USER_ID,
        }}
        textInputStyle={{ color: isDarkMode ? '#FFF' : '#000' }}
        onLongPress={(context, message) => openDeleteModal(message)}
      />

      <Modal
        transparent={true}
        visible={isDeleteModalVisible}
        animationType="slide"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Nachricht löschen?</Text>
            <TouchableOpacity style={styles.deleteButton} onPress={deleteMessage}>
              <Text style={styles.deleteButtonText}>Nachricht löschen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.cancelButton} onPress={() => setDeleteModalVisible(false)}>
              <Text style={styles.cancelButtonText}>Abbrechen</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

ChatScreen.propTypes = {
  route: PropTypes.shape({
    params: PropTypes.shape({
      chatId: PropTypes.string.isRequired,
      chatName: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  navigation: PropTypes.shape({
    setOptions: PropTypes.func.isRequired,
  }).isRequired,
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#FFF',
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  deleteButton: {
    backgroundColor: '#FF3B30',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  cancelButton: {
    backgroundColor: '#D3D3D3',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButtonText: {
    color: '#000',
    fontSize: 16,
    fontWeight: 'bold',
  },
});