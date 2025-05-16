import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import { useNavigation } from "@react-navigation/native";
import { io } from 'socket.io-client';
import SearchBar from '../screens/SearchBar'; // Assuming you have a SearchBar component

//const socket = io('https://cnm-service.onrender.com');
const socket = io("http://172.16.1.212:5000"); // Kết nối với server socket

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
 // console.log("MessageItem:", item);
  const sortedMessages = item.lastMessage?.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)) || [];
  const lastMsg = sortedMessages[0];
  const [avatar, setAvatar] = useState(null);
  const fetchAvatar = async (item) => {
    try{
        const createResponse = await fetch("https://echoapp-rho.vercel.app/api/chatmemberBychatID&userID", {
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
        console.log(data);
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
  console.log("User--:", user);

  const handleChat = (item) => {
    navigation.navigate("ChatScreen", { item });
  };

// useEffect(() => {
//   if (!socket || !user?.userID) return;

//   const handleConnect = () => {
//     console.log("✅ Socket connected:", socket.id);
//     socket.emit("join_user", user.userID);
//     socket.emit("getChat", user.userID);
//   };

//   const handleChatByUserID = (data) => {
//    // console.log("📥 ChatByUserID data:", data);
//     const sortedChats = data.sort((a, b) => {
//       const aTime = new Date(a.lastMessage?.[0]?.timestamp || 0);
//       const bTime = new Date(b.lastMessage?.[0]?.timestamp || 0);
//       return bTime - aTime;
//     });
//     setMessages(sortedChats);
//   };

//   const handleNewMessage = (newMsg) => {
//     setMessages((prevMessages) => {
//       const updated = [...prevMessages];
//       const chatIndex = updated.findIndex(c => c.chatID === newMsg.chatID);

//       if (chatIndex !== -1) {
//         const chat = updated[chatIndex];
//         const oldMessages = chat.lastMessage || [];
//         const msgIndex = oldMessages.findIndex(
//           m => m.messageID === newMsg.messageID || m.tempID === newMsg.tempID
//         );

//         if (msgIndex !== -1) {
//           oldMessages[msgIndex] = { ...oldMessages[msgIndex], ...newMsg };
//         } else {
//           oldMessages.unshift({ ...newMsg, senderInfo: newMsg.senderInfo || {} });
//           chat.unreadCount = (chat.unreadCount || 0) + 1;
//         }

//         chat.lastMessage = oldMessages;
//       } else {
//         updated.unshift({
//           chatID: newMsg.chatID,
//           name: newMsg.senderInfo?.name || "Tin nhắn mới",
//           unreadCount: 1,
//           lastMessage: [{ ...newMsg, senderInfo: newMsg.senderInfo || {} }],
//         });
//       }

//       return updated.sort((a, b) => {
//         const aTime = new Date(a.lastMessage?.[0]?.timestamp || 0);
//         const bTime = new Date(b.lastMessage?.[0]?.timestamp || 0);
//         return bTime - aTime;
//       });
//     });
//   };

//   const handleStatusUpdate = ({ chatID, userID, status }) => {
//     if (status === "read" && userID === user.userID) {
//       setMessages(prev =>
//         prev.map(chat =>
//           chat.chatID === chatID ? { ...chat, unreadCount: 0 } : chat
//         )
//       );
//     }
//   };

//   const handleNewChat1to1 = (data) => {
//     console.log("📩 New 1-1 chat:", data);
//     setMessages(prev => [data, ...prev]);
//   };

//   const handleUpdateChat = (data) => {
//     //console.log("📦 Update chat:", data);
//     setMessages((prev) => {
//       const chatIndex = prev.findIndex(chat => chat.chatID === data.chatID);
//       if (chatIndex !== -1) {
//         const updated = [...prev];
//         updated[chatIndex] = { ...updated[chatIndex], ...data };
//         return updated;
//       }
//       return [...prev, data];
//     });
//   };

//   // 👉 Connect
//   if (socket.connected) {
//     handleConnect();
//   } else {
//     socket.on("connect", handleConnect);
//   }

//   socket.on("removeChat", (chatID) => {
//     console.log("❌ Chat removed:", chatID);  
//     setMessages((prev) => prev.filter(chat => chat.chatID !== chatID));
//   });
//   socket.on("removeChatt", (chatID) => {
//     console.log("❌ Chat removed:", chatID);  
//     setMessages((prev) => prev.filter(chat => chat.chatID !== chatID));
//   });
//   socket.on("removeChattt", (chatID) => {
//     console.log("❌ Chat removed:", chatID);  
//     setMessages((prev) => prev.filter(chat => chat.chatID !== chatID));
//   });

//   // 👉 Register listeners
//   socket.on("ChatByUserID", handleChatByUserID);
//   socket.on("new_message", handleNewMessage);
//   socket.on("unsend_notification", handleNewMessage);
//   socket.on("status_update_all", handleStatusUpdate);
//   socket.on("newChat1-1", handleNewChat1to1);
//   socket.on("updateChat", handleUpdateChat);//
//   socket.on("updateMemberChat", handleUpdateChat);
//   socket.on("updateChatt", handleUpdateChat);
//   socket.on("updateChatmember", handleUpdateChat);
//   socket.on("updateMemberChattt",handleUpdateChat)

  


//   // 👉 Cleanup
//   return () => {
//     socket.off("connect", handleConnect);
//     socket.off("ChatByUserID", handleChatByUserID);
//     socket.off("new_message", handleNewMessage);
//     socket.off("unsend_notification", handleNewMessage);
//     socket.off("status_update_all", handleStatusUpdate);
//     socket.off("newChat1-1", handleNewChat1to1);
//     socket.off("updateChat", handleUpdateChat);
//     socket.off("removeChat");
//     socket.off("updateChatt", handleUpdateChat);
//     socket.off("updateChatmember", handleUpdateChat);
//     socket.off("removeChatt");
//     socket.off("updateMemberChattt",handleUpdateChat);

//   };
// }, [socket, user?.userID]);

useEffect(() => {
  if (!socket || !user?.userID) return;

  const handleConnect = () => {
    console.log("✅ Socket connected:", socket.id);

    // Emit sau khi kết nối socket
    socket.emit("join_user", user.userID);
    socket.emit("getChat", user.userID);
  };

  // Nếu đã connected => emit luôn, chưa thì đợi sự kiện "connect"
  if (socket.connected) {
    handleConnect();
  } else {
    socket.on("connect", handleConnect);
  }

  const handleChatByUserID = (data) => {
    const sortedChats = data.sort((a, b) => {
      const aTime = a.lastMessage?.[0]?.timestamp || 0;
      const bTime = b.lastMessage?.[0]?.timestamp || 0;
      return new Date(bTime) - new Date(aTime);
    });
    setMessages(sortedChats);
  };

  const handleNewMessage = (newMsg) => {
    setMessages((prevMessages) => {
      const updated = [...prevMessages];
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

      return updated.sort((a, b) => {
        const aTime = new Date(a.lastMessage?.[0]?.timestamp || 0);
        const bTime = new Date(b.lastMessage?.[0]?.timestamp || 0);
        return bTime - aTime;
      });
    });
  };

  const handleStatusUpdate = ({ chatID, userID, status }) => {
    if (status === "read" && userID === user.userID) {
      setMessages((prevMessages) =>
        prevMessages.map(chat =>
          chat.chatID === chatID ? { ...chat, unreadCount: 0 } : chat
        )
      );
    }
  };

  const handleNewChat1to1 = (data) => {
   
    const newChat = data
    console.log("newChat",newChat);
    setMessages((prevMessages) =>[...prevMessages,newChat]);
  };
  const handleUpdateChat = (data) => {
    console.log("📦 Update chat:", data);
    setMessages((prev) => {
      const chatIndex = prev.findIndex(chat => chat.chatID === data.chatID);
      if (chatIndex !== -1) {
        const updated = [...prev];
        updated[chatIndex] = { ...updated[chatIndex], ...data };
        return updated;
      }
      return [...prev, data];
    });
  };
  // Đăng ký socket listeners
  socket.on("ChatByUserID", handleChatByUserID);
  socket.on("new_message", handleNewMessage);
  socket.on("status_update_all", handleStatusUpdate);
  socket.on("newChat1-1", handleNewChat1to1);
  socket.emit("unsend_notification", handleNewMessage);
  socket.on("updateChat", handleUpdateChat);

  socket.on("updateMemberChat",handleUpdateChat);
  socket.on("removeChat", (chatID) => {
    console.log("📦 Remove chat:", chatID);
    setMessages((prevMessages) => prevMessages.filter(chat => chat.chatID !== chatID));
  });
  socket.on("removeChatt", (chatID) => {
    console.log("❌ Chat removed:", chatID);  
    setMessages((prev) => prev.filter(chat => chat.chatID !== chatID));
    if (onLeaveGroupSuccess) {
      onLeaveGroupSuccess(); // 💥 QUAN TRỌNG
    }
  });
    socket.on("updateMemberChattt",handleUpdateChat);
    socket.on("removeChattt", (chatID) => {
      console.log("❌ Chat removed:", chatID);  
      setMessages((prev) => prev.filter(chat => chat.chatID !== chatID));
      if (onLeaveGroupSuccess) {
        onLeaveGroupSuccess(); // 💥 QUAN TRỌNG
      }
    });
    socket.on("updateChatt", handleUpdateChat);
    socket.on("updateChatmember", handleUpdateChat);


  // Cleanup
  return () => {
    socket.off("connect", handleConnect);
    socket.off("ChatByUserID", handleChatByUserID);
    socket.off("new_message", handleNewMessage);
    socket.off("status_update_all", handleStatusUpdate);
    socket.off("newChat1-1", handleNewChat1to1);
    socket.off("unsend_notification", handleNewMessage);
    socket.off("updateChat", handleUpdateChat);
    socket.off("updateMemberChat",handleUpdateChat);
    socket.off("removeChat");
    socket.off("removeChatt");
    socket.off("updateMemberChattt",handleUpdateChat);
    socket.off("updateChatt", handleUpdateChat);
    socket.off("updateChatmember", handleUpdateChat);
    socket.off("updateMemberChat",handleUpdateChat);


  };
}, [socket, user?.userID]);

// useEffect(() => {
//   if (!user?.userID) return;

//   const handleChatByUserID = (data) => {
//     const sortedChats = data.sort((a, b) => {
//       const aTime = a.lastMessage?.[0]?.timestamp || 0;
//       const bTime = b.lastMessage?.[0]?.timestamp || 0;
//       return new Date(bTime) - new Date(aTime);
//     });
//     setMessages(sortedChats);
//   };

//   const handleNewMessage = (newMsg) => {
//     setMessages((prevMessages) => {
//       const updatedMessages = [...prevMessages];
//       const chatIndex = updatedMessages.findIndex(c => c.chatID === newMsg.chatID);

//       if (chatIndex !== -1) {
//         const chat = updatedMessages[chatIndex];
//         const oldMessages = chat.lastMessage || [];
//         const msgIndex = oldMessages.findIndex(
//           m => m.messageID === newMsg.messageID || m.tempID === newMsg.tempID
//         );

//         if (msgIndex !== -1) {
//           oldMessages[msgIndex] = { ...oldMessages[msgIndex], ...newMsg };
//         } else {
//           oldMessages.unshift({ ...newMsg, senderInfo: newMsg.senderInfo || {} });
//           chat.unreadCount = (chat.unreadCount || 0) + 1;
//         }

//         chat.lastMessage = oldMessages;
//       } else {
//         updatedMessages.unshift({
//           chatID: newMsg.chatID,
//           name: newMsg.senderInfo?.name || 'Tin nhắn mới',
//           unreadCount: 1,
//           lastMessage: [{ ...newMsg, senderInfo: newMsg.senderInfo || {} }],
//         });
//       }

//       return updatedMessages.sort((a, b) => {
//         const aTime = a.lastMessage?.[0]?.timestamp || 0;
//         const bTime = b.lastMessage?.[0]?.timestamp || 0;
//         return new Date(bTime) - new Date(aTime);
//       });
//     });
//   };

//   const handleStatusUpdate = ({ chatID, userID, status }) => {
//     if (status === "read" && userID === user.userID) {
//       setMessages((prevMessages) =>
//         prevMessages.map(chat =>
//           chat.chatID === chatID ? { ...chat, unreadCount: 0 } : chat
//         )
//       );
//     }
//   };

//   const handleNewChat1to1 = (data) => {
//     setMessages((prevMessages) => {
//       const exists = prevMessages.some(chat => chat.chatID === data.chatID);
//       if (exists) return prevMessages;
//       return [data, ...prevMessages];
//     });
//   };

//   const handleUpdateChat = (data) => {
//     setMessages((prev) => {
//       const chatIndex = prev.findIndex(chat => chat.chatID === data.chatID);
//       if (chatIndex !== -1) {
//         const updated = [...prev];
//         updated[chatIndex] = { ...updated[chatIndex], ...data };
//         return updated;
//       }
//       return [data, ...prev];
//     });
//   };

//   const connectIfReady = () => {
//     if (socket?.connected && user.userID) {
//       socket.emit("join_user", user.userID);
//       socket.emit("getChat", user.userID);
//     } else {
//       socket.once("connect", () => {
//         socket.emit("join_user", user.userID);
//         socket.emit("getChat", user.userID);
//       });
//     }
//   };

//   connectIfReady();

//   socket.on("ChatByUserID", handleChatByUserID);
//   socket.on("new_message", handleNewMessage);
//   socket.on("status_update_all", handleStatusUpdate);
//   socket.on("newChat1-1", handleNewChat1to1);
//   socket.on("updateChat", handleUpdateChat);
//   socket.on("unsend_notification", handleNewMessage);

//   return () => {
//     socket.off("ChatByUserID", handleChatByUserID);
//     socket.off("new_message", handleNewMessage);
//     socket.off("status_update_all", handleStatusUpdate);
//     socket.off("newChat1-1", handleNewChat1to1);
//     socket.off("updateChat", handleUpdateChat);
//     socket.off("unsend_notification", handleNewMessage);
//   };
// }, [user?.userID]);

  
  
  
  console.log("Messages:", Messages);

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
