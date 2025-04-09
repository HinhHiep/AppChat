import React from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';

const messages = [
  { id: '1', name: 'Nguyễn Văn A', message: 'Alo, có đó không ?', time: '2 phút', unread: 1 },
  { id: '2', name: 'Nguyễn Văn A', message: '[Sticker]', time: '2 phút', unread: 1 },
  { id: '3', name: 'Nguyễn Văn A', message: 'Alo, có đó không ?', time: '2 phút', unread: 1 },
  { id: '4', name: 'Nguyễn Văn A', message: '[Sticker]', time: '2 phút', unread: 1 },
];

const FilterBar = () => (
  <View style={styles.filterBar}>
    {['Chưa đọc', 'Nhắc đến tôi', 'Phân loại'].map((label) => (
      <TouchableOpacity key={label} style={styles.filterButton}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const MessageItem = ({ item }) => (
  <View style={styles.messageItem}>
    <View style={styles.avatar} />
    <View style={styles.messageContent}>
      <Text style={styles.name}>{item.name}</Text>
      <Text style={styles.message}>{item.message}</Text>
    </View>
    <View style={styles.timeBadge}>
      <Text style={styles.time}>{item.time}</Text>
      {item.unread > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{item.unread}</Text>
        </View>
      )}
    </View>
  </View>
);

const MessageScreen = () => {
  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchBar}>
        <Icon name="search" size={20} color="#00caff" />
        <Text style={styles.searchText}>Tìm kiếm</Text>
        <View style={styles.searchIcons}>
          <Icon name="qr-code-outline" size={22} color="#00caff" style={{ marginRight: 15 }} />
          <Icon name="add" size={22} color="#00caff" />
        </View>
      </View>

      <FilterBar />

      {/* Danh sách tin nhắn */}
      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <MessageItem item={item} />}
        contentContainerStyle={{ paddingBottom: 100 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 10,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    marginBottom: 10,
  },
  searchText: {
    flex: 1,
    marginLeft: 8,
    color: '#00caff',
    fontSize: 16,
  },
  searchIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  filterBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 10,
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#f2f2f2',
  },
  messageItem: {
    flexDirection: 'row',
    paddingHorizontal: 15,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderColor: '#f0f0f0',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#ddd',
    marginRight: 12,
  },
  messageContent: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 15,
  },
  message: {
    color: '#555',
  },
  timeBadge: {
    alignItems: 'flex-end',
  },
  time: {
    fontSize: 12,
    color: '#555',
    marginBottom: 5,
  },
  badge: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  badgeText: {
    color: 'white',
    fontSize: 12,
  },
});

export default MessageScreen;
