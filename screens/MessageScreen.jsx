import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { useNavigation } from "@react-navigation/native";
import { io } from 'socket.io-client';
import SearchBar from '../screens/SearchBar'; // Assuming you have a SearchBar component

const socket = io('https://cnm-service.onrender.com');
//const socket = io("http://192.168.86.55:5000"); // Kết nối với server socket

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
  const [avatar, setAvatar] = useState(null);
  const fetchAvatar = async (item) => {
    try{
        const createResponse = await fetch("https://cnm-service.onrender.com/api/chatmemberBychatID&userID", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID: user.userID,
            chatID: item.chatID
          }),
        });
        const data = await createResponse.json();
        if (createResponse.ok) {
          setAvatar(data?.anhDaiDien);
        }
    }catch (error) {
      console.error('Error fetching friends list:', error);
    }
  }
 useEffect(() => {
  if (!item) return;
     fetchAvatar(item);
    },[item]);

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
          {item.type=== 'group' ? 
          (<Image
            source={{ uri: item.avatar}}
            style={styles.avatar}
          />):
          (<Image
            source={{ uri: avatar}}
            style={styles.avatar}
          />)
    }
          {unreadCount > 0 &&  (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{unreadCount}</Text>
            </View>
          )}
        </View>
        <View style={styles.messageContent}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.message}>
          {lastMsg?.type === 'image'
              ? '[Image]'
              : lastMsg?.type === 'video'
              ? '[Video]'
              : lastMsg?.type === 'audio'
              ? '[Audio]'
              : lastMsg?.type === 'unsend'
              ? '[Tin nhắn đã thu hồi]'
              : lastMsg?.type === 'file'
              ? '[File]'
              : !lastMsg
              ? "No messages yet"
              : lastMsg?.content}
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
  if (!socket || !user?.userID) return;

  const handleConnect = () => {
   
    socket.emit("join_user", user.userID);
    socket.emit("getChat", user.userID);
  };

  // Kết nối socket
  socket.connected ? handleConnect() : socket.on("connect", handleConnect);

  const handleChatByUserID = (data) => {
    const sortedChats = data.sort((a, b) => {
      const aTime = a.lastMessage?.[0]?.timestamp || 0;
      const bTime = b.lastMessage?.[0]?.timestamp || 0;
      return new Date(bTime) - new Date(aTime);
    });
    setMessages(sortedChats);
  };

  const handleNewMessage = (newMsg) => {
    setMessages((prev) => {
      const updated = [...prev];
      const chatIndex = updated.findIndex(c => c.chatID === newMsg.chatID);

      if (chatIndex !== -1) {
        const chat = updated[chatIndex];
        const oldMessages = chat.lastMessage || [];
        const msgIndex = oldMessages.findIndex(
          m => m.messageID === newMsg.messageID || m.tempID === newMsg.tempID
        );

        if (msgIndex !== -1) {
          oldMessages[msgIndex] = { ...oldMessages[msgIndex], ...newMsg };
        } else {
          oldMessages.unshift({ ...newMsg, senderInfo: newMsg.senderInfo || {} });
          chat.unreadCount = (chat.unreadCount || 0) + 1;
        }

        chat.lastMessage = oldMessages;
      } else {
        updated.unshift({
          chatID: newMsg.chatID,
          name: newMsg.senderInfo?.name || "Tin nhắn mới",
          unreadCount: 1,
          lastMessage: [{ ...newMsg, senderInfo: newMsg.senderInfo || {} }],
        });
      }

      return updated.sort((a, b) =>
        new Date(b.lastMessage?.[0]?.timestamp || 0) - new Date(a.lastMessage?.[0]?.timestamp || 0)
      );
    });
  };

  const handleStatusUpdate = ({ chatID, userID, status }) => {
    if (status === "read" && userID === user.userID) {
      setMessages((prev) =>
        prev.map(chat =>
          chat.chatID === chatID ? { ...chat, unreadCount: 0 } : chat
        )
      );
    }
  };

  const handleUpdateChat = (data) => {
    setMessages((prev) => {
      const index = prev.findIndex(chat => chat.chatID === data.chatID);
      if (index !== -1) {
        const updated = [...prev];
        updated[index] = { ...updated[index], ...data };
        return updated;
      }
      return [...prev, data];
    });
  };

  const handleNewChat1to1 = (newChat) => {
   
    setMessages((prev) => [...prev, newChat]);
  };

  const handleRemoveChat = (chatID) => {
   
    setMessages((prev) => prev.filter(chat => chat.chatID !== chatID));
    onLeaveGroupSuccess?.();
  };

  // Đăng ký sự kiện
  socket.on("ChatByUserID", handleChatByUserID);
  socket.on("new_message", handleNewMessage);
  socket.on("status_update_all", handleStatusUpdate);
  socket.on("newChat1-1", handleNewChat1to1);
  socket.on("unsend_notification", handleNewMessage);

  const updateChatEvents = [
    "updateChat",
    "updateMemberChat",
    "updateMemberChattt",
    "updateChatt",
    "updateChatmember"
  ];
  updateChatEvents.forEach(evt => socket.on(evt, handleUpdateChat));

  const removeChatEvents = ["removeChat", "removeChatt", "removeChattt"];
  removeChatEvents.forEach(evt => socket.on(evt, handleRemoveChat));

  // Cleanup
  return () => {
    socket.off("connect", handleConnect);
    socket.off("ChatByUserID", handleChatByUserID);
    socket.off("new_message", handleNewMessage);
    socket.off("status_update_all", handleStatusUpdate);
    socket.off("newChat1-1", handleNewChat1to1);
    socket.off("unsend_notification", handleNewMessage);

    updateChatEvents.forEach(evt => socket.off(evt, handleUpdateChat));
    removeChatEvents.forEach(evt => socket.off(evt, handleRemoveChat));
  };
}, [socket, user?.userID]);




  return (
    <View style={styles.container}>
      <SearchBar />

      <FilterBar />

      <FlatList
  data={Messages}
  keyExtractor={(item, index) => `${item.chatID}-${index}`}
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
