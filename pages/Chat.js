import React, { useState, useCallback, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { GiftedChat } from 'react-native-gifted-chat';
import { useDarkMode } from './DarkModeContext';
import { supabase } from '../User-Auth/supabase';


export default function ChatScreen({ route, navigation }) {
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
            .select('id, username, content, created_at, chat_id')
            .eq('chat_id', chatId)
            .order('created_at', { ascending: true });

        if (error) {
          console.error('Error fetching messages:', error);
        } else {
          console.log('Fetched messages:', data);
          const formattedMessages = data.map(message => ({
            id: message.id,
            text: message.content,
            createdAt: new Date(message.created_at),
            user: {
              id: message.chat_id,
              name: message.username,
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
  }, [chatId, chatName, navigation]);

  const onSend = useCallback(async (newMessages = []) => {
    setMessages((previousMessages) => GiftedChat.append(previousMessages, newMessages));
    const message = newMessages[0];
    try {
      console.log('Sending message:', message);
      let { error } = await supabase
        .from('messages')
        .insert([
          {
            username: message.user.name,
            content: message.text,
            created_at: new Date().toISOString(), // Use ISO string format
            chat_id: chatId,
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
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
      <GiftedChat
        messages={messages}
        onSend={(messages) => onSend(messages)}
        user={{
          _id: 1,
          name: 'Ole',
        }}
        textInputStyle={{ color: isDarkMode ? '#FFF' : '#000' }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
