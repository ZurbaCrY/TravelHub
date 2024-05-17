import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useDarkMode } from './DarkModeContext';
import { supabase } from '../User-Auth/supabase';

export default function ChatListScreen({ navigation }) {
  const { isDarkMode } = useDarkMode();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    fetchChats();

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
      // Filter nach Nachrichten mit vorhandener user_id oder username
      const filteredData = data.filter((message) => message.user_id || message.username);

      // Gruppen Nachrichten nach chat_id und extrahieren die letzte Nachricht
      const chatMap = new Map();
      filteredData.forEach((message) => {
        if (!chatMap.has(message.chat_id)) {
          chatMap.set(message.chat_id, message);
        }
      });

      setChats(Array.from(chatMap.values()));
    }
  };

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.chat_id}
        renderItem={({ item }) => {
          return (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() => navigation.navigate('ChatScreen', { chatId: item.chat_id, chatName: item.username })}
            >
              <Text style={[styles.chatName, { color: isDarkMode ? '#FFF' : '#000' }]}>{item.username}</Text>
              <Text style={[styles.lastMessage, { color: isDarkMode ? '#AAA' : '#555' }]}>{item.content}</Text>
            </TouchableOpacity>
          );
        }}
      />
    </View>
  );
}

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
});
