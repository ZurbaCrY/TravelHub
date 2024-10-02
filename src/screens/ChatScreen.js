import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet, Modal, Text, TouchableOpacity } from 'react-native';
import { GiftedChat, MessageText } from 'react-native-gifted-chat';
import { useDarkMode } from '../context/DarkModeContext';
import { supabase } from '../services/supabase';
import AuthService from '../services/auth';
import PropTypes from 'prop-types';
import { styles } from '../styles/styles.js'; // Relativer Pfad

export default function ChatScreen({ route, navigation }) {
  const CURRENT_USER = AuthService.getUser();
  const CURRENT_USER_ID = CURRENT_USER.id;
  const { chatId, chatName } = route.params;
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isDeleteModalVisible, setDeleteModalVisible] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [messageInput, setMessageInput] = useState('');
  const { isDarkMode } = useDarkMode();

  useEffect(() => {
    navigation.setOptions({ title: chatName });

    const fetchMessages = async () => {
      try {
        console.log(`Fetching messages for chatId: ${chatId}`);
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
      const error = console.error; 
        console.error = (...args) => {           
          if (/defaultProps/.test(args[0])) return;           
            error(...args);
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
          <Text style={styles.editedText}>Bearbeitet</Text>
        )}
      </View>
    );
  };

  return (
    <View style={[styles.chatContainer, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: CURRENT_USER_ID,
        }}
        text={messageInput}
        onInputTextChanged={(text) => setMessageInput(text)} 
        textInputStyle={{ color: isDarkMode ? '#FFF' : '#000' }}
        onLongPress={handleLongPress}
        renderMessageText={renderMessageText} 
      />

      <Modal
        transparent={true}
        visible={isDeleteModalVisible}
        animationType="slide"
        onRequestClose={() => setDeleteModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Bearbeiten oder Löschen</Text>
            <TouchableOpacity style={styles.modalButton} onPress={deleteMessage}>
              <Text style={styles.modalButtonText}>Nachricht löschen</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => openEditModal(selectedMessage)}>
              <Text style={styles.modalButtonText}>Text bearbeiten</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={() => setDeleteModalVisible(false)}>
              <Text style={styles.modalButtonText}>Abbrechen</Text>
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
      chatId: PropTypes.number.isRequired || PropTypes.string.isRequired,
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
  modalButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: 'bold',
  },
  modalButton: {
    backgroundColor: '#D3D3D3',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  editedText: {
    fontSize: 10,
    color: '#ffffff',
    marginTop: 2,
    marginRight: 8,
    textAlign: 'right',
  },
});