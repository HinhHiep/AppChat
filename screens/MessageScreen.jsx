import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { useNavigation } from "@react-navigation/native";
import { getChatsForUser } from '@/api/UserApi';

const FilterBar = () => (
  <View style={styles.filterBar}>
    {['Chưa đọc', 'Nhắc đến tôi', 'Phân loại'].map((label) => (
      <TouchableOpacity key={label} style={styles.filterButton}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

const MessageItem = ({ item, onPress }) => {
  const { user } = useSelector((state) => state.user);

  // Đảm bảo lastMessage được sắp xếp mới nhất trước
  const sortedMessages = item.lastMessage?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) || [];
  const lastMsg = sortedMessages[0];

  const getStatusText = (status) => {
    switch (status) {
      case 'sent': return 'Đã gửi';
      case 'delivered': return 'Đã nhận';
      case 'read': return 'Đã xem';
      default: return '';
    }
  };

  return (
    <TouchableOpacity onPress={onPress}>
      <View style={styles.messageItem}>
        <Image
          source={{ uri: lastMsg?.senderInfo?.avatar || 'https://your-avatar-link.com/avatar.png' }}
          style={styles.avatar}
        />
        <View style={styles.messageContent}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.message}>{lastMsg?.content || '...'}</Text>
        </View>
        <View style={styles.timeBadge}>
          <Text style={styles.time}>
            {lastMsg?.timestamp ? new Date(lastMsg.timestamp).toLocaleTimeString() : ''}
          </Text>
          <Text style={styles.statusText}>{getStatusText(lastMsg?.status)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const MessageScreen = () => {
  const [Messages, setMessages] = useState([]);
  const { user } = useSelector((state) => state.user);
  const navigation = useNavigation();

  const handleChat = (item) => {
    navigation.navigate("ChatScreen", { item });
  };

  const fetchMessages = async () => {
    try {
      const response = await getChatsForUser(user.userID);

      // Sort các đoạn chat theo tin nhắn mới nhất
      const sortedChats = response.sort((a, b) => {
        const aTimestamp = a.lastMessage?.[0]?.timestamp || 0;
        const bTimestamp = b.lastMessage?.[0]?.timestamp || 0;
        return new Date(bTimestamp) - new Date(aTimestamp);
      });

      setMessages(sortedChats);
    } catch (error) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    if (user?.userID) {
      fetchMessages();
    }
  }, [user.userID]);
  console.log(Messages);

  return (
    <View style={styles.container}>
      <View style={styles.searchBar}>
        <Icon name="search" size={20} color="#00caff" />
        <Text style={styles.searchText}>Tìm kiếm</Text>
        <View style={styles.searchIcons}>
          <Icon name="qr-code-outline" size={22} color="#00caff" style={{ marginRight: 15 }} />
          <Icon name="add" size={22} color="#00caff" />
        </View>
      </View>

      <FilterBar />

      <FlatList
        data={Messages}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <MessageItem item={item} onPress={() => handleChat(item)} />
        )}
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
    width: 60,
    height: 60,
    borderRadius: 50,
    marginRight: 10,
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
  statusText: {
    fontSize: 12,
    color: 'gray',
    fontStyle: 'italic',
    marginTop: 4,
  },
});

export default MessageScreen;
