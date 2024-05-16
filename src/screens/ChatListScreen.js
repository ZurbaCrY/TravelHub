import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { useDarkMode } from './DarkModeContext';

//Liste an Chats
const chats = [
  { id: '1', name: 'Linus', messages: [{ text: 'First message' }, { text: 'Last message in Chat 1' }] },
  { id: '2', name: 'Tom', messages: [{ text: 'First message' }, { text: 'Last message in Chat 2' }] },
  { id: '3', name: 'Kevin', messages: [{ text: 'First message' }, { text: 'Last message in Chat 3' }] },
];

export default function ChatListScreen({ navigation }) {
  const { isDarkMode } = useDarkMode();

  return (
    <View style={[styles.container, { backgroundColor: isDarkMode ? '#070A0F' : '#FFF' }]}>
      <FlatList
        data={chats}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const lastMessage = item.messages[item.messages.length - 1]?.text;
          return (
            <TouchableOpacity
              style={styles.chatItem}
              onPress={() => navigation.navigate('ChatScreen', { chatId: item.id, chatName: item.name })}
            >
              <Text style={[styles.chatName, { color: isDarkMode ? '#FFF' : '#000' }]}>{item.name}</Text>
              <Text style={[styles.lastMessage, { color: isDarkMode ? '#AAA' : '#555' }]}>{lastMessage}</Text>
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
