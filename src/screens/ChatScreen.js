import React, { useState, useCallback, useEffect } from 'react';
import { View } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { useDarkMode } from './DarkModeContext';
import { supabase } from '../User-Auth/supabase';
import AuthService from '../User-Auth/auth';
import PropTypes from 'prop-types';
import { styles } from '../style/styles.js'; // Relativer Pfad

export default function ChatScreen({ route, navigation }) {
  const CURRENT_USER = AuthService.getUser();
  const CURRENT_USER_ID = CURRENT_USER.id;
  const { chatId, chatName } = route.params;
  const [messages, setMessages] = useState([]);
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
          console.log('Fetched messages:', data);
          const formattedMessages = data.map(message => ({
            _id: message.id,
            text: message.content,
            createdAt: new Date(message.created_at),
            user: {
              _id: message.user_id,
            },
          }));
          setMessages(formattedMessages);
          console.log('Formatted messages:', formattedMessages);
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();

    const messageSubscription = supabase
      .channel(`public:messages:chat_id=eq.${chatId}`)
      .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'messages', filter: `chat_id=eq.${chatId}` }, payload => {
        console.log('New message received!', payload);
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

  const onSend = useCallback(async (newMessages = []) => {
    const message = newMessages[0];
    try {
      console.log('Sending message:', message);
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
      } else {
        console.log('Message sent:', message);
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  }, [chatId]);

  return (
    <View style={[styles.chatContainer, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: CURRENT_USER_ID,
        }}
        textInputStyle={{ color: isDarkMode ? '#FFF' : '#000' }}
      />
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
