import React, { useState, useEffect } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, RefreshControl, FlatList } from 'react-native';
import { handleDownvote, handleUpvote, fetchPosts, getUpvoters, getDownvoters } from '../backend/community';
import AuthService from '../services/auth';

export default function CommunityDetailScreen({ route, navigation }) {
  const { post } = route.params;
  const user = AuthService.getUser();
  const [refreshing, setRefreshing] = useState(false);
  const [postData, setPostData] = useState(post);
  const [upvoters, setUpvoters] = useState([]);
  const [downvoters, setDownvoters] = useState([]);
  const [showUpvoters, setShowUpvoters] = useState(false);
  const [showDownvoters, setShowDownvoters] = useState(false);

  useEffect(() => {
    const fetchVoters = async () => {
      try {
        const upvoterList = await getUpvoters(post.id);
        const downvoterList = await getDownvoters(post.id);
        setUpvoters(upvoterList);
        setDownvoters(downvoterList);
      } catch (error) {
        console.error('Error fetching voters:', error);
      }
    };

    fetchVoters();
  }, [post.id]);

  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setRefreshing(true);
    try {
      const postsData = await fetchPosts();
      const updatedPost = postsData.find(p => p.id === post.id);
      if (updatedPost) {
        setPostData(updatedPost);
      }
    } catch (error) {
      console.error('Error fetching posts: ', error);
    } finally {
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    loadPosts(); // Funktion zum Neuladen der Posts bei "Pull-to-Refresh"
  };

  const renderVotersList = (voters) => (
    <FlatList
      data={voters}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <View style={styles.voterItem}>
          <Image source={{ uri: item.profilepicture_url }} style={styles.voterProfileImage} />
          <Text style={styles.voterUsername}>{item.username}</Text>
        </View>
      )}
    />
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={[postData]} // Nur das aktuelle Post-Objekt wird angezeigt
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={() => (
          <>
            <View style={styles.postHeader}>
              <Image source={{ uri: postData.users.profilepicture_url }} style={styles.profileImage} />
              <Text style={styles.username}>{postData.users.username}</Text>
            </View>
            {postData.image_url && (
              <Image source={{ uri: postData.image_url }} style={styles.postImage} />
            )}
            <Text style={styles.postText}>{postData.content}</Text>

            {/* Upvotes and Downvotes Section */}
            <View style={styles.voteRow}>
              {/* Upvotes Section */}
              <View style={styles.voteContainer}>
                <TouchableOpacity onPress={() => handleUpvote(postData.id, user.id, loadPosts)}>
                  <Image source={require('../assets/images/thumbs-up.png')} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowUpvoters(!showUpvoters)}>
                  <Text style={styles.voteCount}>{postData.upvotes} Upvotes</Text>
                </TouchableOpacity>
              </View>

              {/* Downvotes Section */}
              <View style={styles.voteContainer}>
                <TouchableOpacity onPress={() => handleDownvote(postData.id, user.id, loadPosts)}>
                  <Image source={require('../assets/images/thumbs-down.png')} style={styles.icon} />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setShowDownvoters(!showDownvoters)}>
                  <Text style={styles.voteCount}>{postData.downvotes} Downvotes</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Upvoters Dropdown */}
            {showUpvoters && (
              <View style={styles.updropdown}>
                {renderVotersList(upvoters)}
              </View>
            )}

            {/* Downvoters Dropdown */}
            {showDownvoters && (
              <View style={styles.downdropdown}>
                {renderVotersList(downvoters)}
              </View>
            )}
          </>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: '#FFF',
  },
  icon: {
    width: 25,
    height: 25,
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
  voteRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteCount: {
    marginHorizontal: 10,
    fontSize: 16,
    fontWeight: 'bold',
  },
  updropdown: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    width: '50%',
  },
  downdropdown: {
    backgroundColor: '#F0F0F0',
    padding: 10,
    borderRadius: 5,
    marginTop: 5,
    width: '50%',
  },
  dropdownHeader: {
    fontWeight: 'bold',
    marginBottom: 5,
    fontSize: 16,
  },
  voterItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 5,
  },
  voterProfileImage: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  voterUsername: {
    fontSize: 16,
  },
});
