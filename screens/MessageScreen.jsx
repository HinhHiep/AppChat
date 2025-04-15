import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { useNavigation } from "@react-navigation/native";
import { io } from 'socket.io-client';

const socket = io('https://cnm-service.onrender.com');

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
  const sortedMessages = item.lastMessage?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) || [];
  const lastMsg = sortedMessages[0];
  const unreadCount = item.unreadCount || 0;

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
        <View style={{ position: 'relative' }}>
          <Image
            source={{ uri: lastMsg?.senderInfo?.avatar || 'https://your-avatar-link.com/avatar.png' }}
            style={styles.avatar}
          />
          {unreadCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={styles.messageContent}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.message}>
            {lastMsg?.media_url?.length > 0 ? '[Image]' : lastMsg?.content || '...'}
          </Text>
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
  useEffect(() => {
    if (socket && user?.userID) {
      socket.emit("join_user", user.userID);
    }
  }, [user?.userID]);
  
  useEffect(() => {
    if (user?.userID && socket) {
      // Lấy danh sách chat
      socket.emit("getChat", user.userID);
  
      // Nhận danh sách chat theo userID
      socket.on("ChatByUserID", (data) => {
        const sortedChats = data.sort((a, b) => {
          const aTime = a.lastMessage?.[0]?.timestamp || 0;
          const bTime = b.lastMessage?.[0]?.timestamp || 0;
          return new Date(bTime) - new Date(aTime);
        });
        setMessages(sortedChats);
      });
  
      // Nhận tin nhắn mới
      socket.on("new_message", (newMsg) => {
        setMessages((prevMessages) => {
          const updatedMessages = [...prevMessages];
          const chatIndex = updatedMessages.findIndex(c => c.chatID === newMsg.chatID);
  
          if (chatIndex !== -1) {
            const chat = updatedMessages[chatIndex];
            chat.lastMessage = [
              { ...newMsg, senderInfo: newMsg.senderInfo || {} },
              ...(chat.lastMessage || []),
            ];
            chat.unreadCount = (chat.unreadCount || 0) + 1;
          } else {
            updatedMessages.unshift({
              chatID: newMsg.chatID,
              name: newMsg.senderInfo?.name || 'Tin nhắn mới',
              unreadCount: 1,
              lastMessage: [{ ...newMsg, senderInfo: newMsg.senderInfo || {} }],
            });
          }
  
          return updatedMessages.sort((a, b) => {
            const aTime = a.lastMessage?.[0]?.timestamp || 0;
            const bTime = b.lastMessage?.[0]?.timestamp || 0;
            return new Date(bTime) - new Date(aTime);
          });
        });
      });
  
      // Nhận thông báo đã đọc
      socket.on("status_update_all", ({ chatID, userID, status }) => {
        if (status === "read" && userID === user.userID) {
          setMessages((prevMessages) =>
            prevMessages.map(chat =>
              chat.chatID === chatID ? { ...chat, unreadCount: 0 } : chat
            )
          );
        }
      });
    }
  
    return () => {
      socket.off("ChatByUserID");
      socket.off("new_message");
      socket.off("status_update_all");
    };
  }, [user?.userID]);
  

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
        keyExtractor={(item) => item.chatID || item._id}
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
  badge: {
    position: 'absolute',
    right: -2,
    top: -2,
    backgroundColor: 'red',
    borderRadius: 10,
    minWidth: 18,
    height: 18,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 4,
    zIndex: 999,
  },
  badgeText: {
    color: 'white',
    fontSize: 11,
    fontWeight: 'bold',
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
