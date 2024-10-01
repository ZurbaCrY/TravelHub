import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

export default function PostDetailScreen({ route, navigation }) {
  const { post } = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.postHeader}>
        <Image source={{ uri: post.users.profilepicture_url }} style={styles.profileImage} />
        <Text style={styles.username}>{post.users.username}</Text>
      </View>
      {post.image_url && (
        <Image source={{ uri: post.image_url }} style={styles.postImage} />
      )}
      <Text style={styles.postText}>{post.content}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFF',
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
  },
  username: {
    marginLeft: 10,
    fontWeight: 'bold',
    fontSize: 16,
  },
  postImage: {
    width: '100%',
    height: 300,
    marginVertical: 10,
    borderRadius: 10,
  },
  postText: {
    fontSize: 16,
    lineHeight: 22,
  },
});
