import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  SafeAreaView,
  Platform,
  Linking
} from 'react-native';
import VideoRN from 'react-native-video';
import { useNavigation, useRoute } from '@react-navigation/native';

const VideoPlayer = ({ uri, isPlaying, onPress }) => {
  const uriString = typeof uri === 'string' ? uri : (uri?.uri || '');

  if (Platform.OS === 'web') {
    return (
      <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={{ position: 'relative' }}>
        <video
          src={uriString}
          style={styles.mediaVideo}
          controls
          autoPlay={isPlaying}
          muted={!isPlaying}
          loop
        />
      </TouchableOpacity>
    );
  }
  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.9} style={{ position: 'relative' }}>
      <VideoRN
        source={{ uri: uriString }}
        style={styles.mediaVideo}
        controls
        resizeMode="contain"
        paused={!isPlaying}
        repeat
      />
    </TouchableOpacity>
  );
};

const MediaFilesScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { chat } = route.params || {};
const openGoogleDocs = (fileUrl) => {
  const googleDocsUrl = `https://docs.google.com/viewer?url=${fileUrl}&embedded=true`;
  Linking.openURL(googleDocsUrl);
};
  // Sắp xếp tin nhắn giảm dần theo timestamp (mới nhất lên đầu)
  const messages = (chat?.lastMessage || [])
    .slice()
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

  const images = messages
    .filter(m => m.type === 'image')
    .flatMap(m => Array.isArray(m.media_url) ? m.media_url : (m.media_url ? [m.media_url] : []));

  const videos = messages
    .filter(m => m.type === 'video')
    .flatMap(m => Array.isArray(m.media_url) ? m.media_url : (m.media_url ? [m.media_url] : []));

  const files = messages.filter(m => m.type === 'file');

  const imagesData = images.map((uri, index) => ({ id: `${index}`, uri }));
  const videosData = videos.map((uri, index) => ({ id: `${index}`, uri }));
  const filesData = files.map(fileMsg => ({
    id: fileMsg.tempID || fileMsg._id || Math.random().toString(),
    name: fileMsg.content || 'File',
  }));

  const [selectedTab, setSelectedTab] = useState('images');
  const [playingVideoId, setPlayingVideoId] = useState(null);

  const renderContent = () => {
    if (selectedTab === 'images') {
      if (!imagesData.length) return <Text style={styles.emptyText}>Không có ảnh nào</Text>;
      return (
        <FlatList
          key="images"
          data={imagesData}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <Image source={{ uri: item.uri }} style={styles.mediaImage} />}
          numColumns={3}
          columnWrapperStyle={styles.row}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      );
    }
    if (selectedTab === 'videos') {
      if (!videosData.length) return <Text style={styles.emptyText}>Không có video nào</Text>;
      return (
        <FlatList
          key="videos"
          data={videosData}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <VideoPlayer
              uri={item.uri}
              isPlaying={playingVideoId === item.id}
              onPress={() => setPlayingVideoId(prev => (prev === item.id ? null : item.id))}
            />
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      );
    }
    if (selectedTab === 'files') {
      if (!filesData.length) return <Text style={styles.emptyText}>Không có file nào</Text>;
      return (
        <FlatList
          key="files"
          data={filesData}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <View style={styles.fileItem}>
              <TouchableOpacity onPress={() => openGoogleDocs(item.uri)}>
                <Text style={styles.fileName}>{item.name}</Text>
              </TouchableOpacity>
            </View>
          )}
          contentContainerStyle={{ paddingBottom: 20 }}
          showsVerticalScrollIndicator={false}
        />
      );
    }
    return null;
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backBtnText}>‹</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Ảnh, Video, File</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        {['images', 'videos', 'files'].map(tab => (
          <TouchableOpacity
            key={tab}
            onPress={() => {
              setSelectedTab(tab);
              setPlayingVideoId(null);
            }}
            style={[styles.tabBtn, selectedTab === tab && styles.tabBtnActive]}
          >
            <Text style={[styles.tabBtnText, selectedTab === tab && styles.tabBtnTextActive]}>
              {tab.charAt(0).toUpperCase() + tab.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Content */}
      <View style={styles.content}>{renderContent()}</View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    height: 50,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomColor: '#333',
    borderBottomWidth: 1,
    paddingHorizontal: 15,
  },
  backBtn: {
    padding: 5,
    marginRight: 15,
  },
  backBtnText: {
    fontSize: 28,
    color: '#00caff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#111',
    paddingVertical: 10,
  },
  tabBtn: {
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 20,
  },
  tabBtnActive: {
    backgroundColor: '#00caff',
  },
  tabBtnText: {
    color: '#aaa',
    fontWeight: '600',
    fontSize: 16,
  },
  tabBtnTextActive: {
    color: '#000',
    fontWeight: '700',
  },
  content: {
    flex: 1,
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  row: {
    justifyContent: 'space-between',
  },
  mediaImage: {
    width: '32%',
    aspectRatio: 1,
    borderRadius: 8,
    marginBottom: 10,
  },
  mediaVideo: {
    width: '100%',
    height: 180,
    borderRadius: 8,
    marginBottom: 15,
  },
  fileItem: {
    padding: 15,
    backgroundColor: '#222',
    borderRadius: 8,
    marginBottom: 10,
  },
  fileName: {
    color: '#fff',
    fontSize: 16,
  },
  emptyText: {
    marginTop: 40,
    textAlign: 'center',
    color: '#666',
    fontSize: 16,
  },
});

export default MediaFilesScreen;
