import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, TextInput ,StyleSheet, TouchableOpacity, ScrollView, Alert, Keyboard ,Modal,Linking} from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from "expo-image-picker";
import Icon from 'react-native-vector-icons/Ionicons';
import FAIcon from 'react-native-vector-icons/FontAwesome';
import { Picker } from 'emoji-mart-native';
import Video from 'react-native-video';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import InputDefault from '@/components/input/InputDefault';
import { io } from 'socket.io-client';
import axios from "axios";
import { setUser } from "@/redux/slices/UserSlice";
import { useDispatch } from "react-redux";
const socket = io('https://cnm-service.onrender.com');
//const socket = io('http://192.168.86.55:5000');

const ChatScreen = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useSelector((state) => state.user);
  const { item } = route.params;
  const [chats, setChats] = useState(item); 
  const [message, setMessage] = useState(chats?.lastMessage || []);
  const [messages, setMessages] = useState("");
  const scrollViewRef = useRef();
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [emojiObject, setEmojiObject] = useState(null);
  const [videos, setVideos] = useState([]);
  const [Video_Image,setVideo_Image] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const [screens, setScreens] = useState('');
  const scrollContainerRef = useRef(null);
  const [length, setLength] = useState(item?.members.length || 0);
  const [emoji, setEmoji] = useState('');
  const dispatch = useDispatch();
  const [images, setImages] = useState([]);
 const [member, setMember] = useState(null);
 const [inputFocused, setInputFocused] = useState(false);
const [selectedMessage, setSelectedMessage] = useState(null);  // Tin nhắn được chọn
const [showActionModal, setShowActionModal] = useState(false); // Hiển thị menu tác vụ
const [replyMessage, setReplyMessage] = useState(null);   // Tin nhắn được trả lời
const [pinnedMessages, setPinnedMessages] = useState([]); // Mảng tin nhắn ghim
const [showAllPinned, setShowAllPinned] = useState(false); // để toggle xem nhiều/ẩn bớt
 const [tranLate, setTransLate] = useState(false); // State cho chức năng dịch
  const [Recommend, setRecommend] = useState(false); // State cho chức năng gợi ý trả lời
  const [messagesToTranslate, setMessagesToTranslate] = useState(null); // Tin nhắn cần dịch
  const [MessTranLate, setMessTranLate] = useState(null); // Danh sách tin nhắn đã dịch

  


  const handleMember = async(memberID)=>{
    try{
        const res = await axios.post("https://cnm-service.onrender.com/api/usersID", {
          userID: memberID
        });
          
          setMember(res.data);
      }
      catch (error) {
        console.error("Error fetching member data:", error);
      }
  }

  useEffect(() => {
    if (!item || item.type !== "private") return;
    const memberID = item.members.find((m) => m.userID !== user.userID)?.userID;
   
    if (memberID) {
      handleMember(memberID);
    }
  }, [item]);
 
  useEffect(() => {
     const unsubscribe = navigation.addListener('focus', () => {
       const routes = navigation.getState()?.routes;
       const currentIndex = navigation.getState()?.index;
       const prevScreen = routes[currentIndex - 1];
       setScreens(prevScreen?.name);
       
     });
      return unsubscribe;
   }, [navigation]);
   const handleScreenChange = () => {
    if (screens === 'CreateGroupScreen'){
      navigation.navigate("Home", { screen: "Tin Nhắn" });
    } else{
      navigation.goBack();
    }
   }
const handleOptionGroup = () => {
  navigation.navigate('GroupOptionsScreen', { chat: item });
};

   const pickImage = async () => {
  // Xin quyền truy cập thư viện
  const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (!granted) {
    alert('Bạn cần cấp quyền truy cập ảnh');
    return;
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.All, // chọn ảnh và video
    allowsMultipleSelection: true,  // ✅ cho phép chọn nhiều
    quality: 1,
  });

  if (!result.canceled) {
    // result.assets là mảng các file đã chọn
    const selectedImages = result.assets.filter(asset => asset.type === "image");
    const selectedVideos = result.assets.filter(asset => asset.type === "video");
    console.log("Selected images:", selectedImages);
    console.log("Selected videos:", selectedVideos);
    setVideos(selectedVideos);
    setImages(selectedImages);
  }
};

   const handleEmojiSelect = (emoji) => {
    if (!emoji) return;
    const tempID = Date.now().toString();
    const newMsg = {
  tempID,
  chatID: item.chatID,
  senderID: user.userID,
  content: emoji.native,
  type: 'emoji',
  timestamp: new Date().toISOString(),
  media_url: [],
  status: 'sent',
  senderInfo: { name: user.name, avatar: user.anhDaiDien },
};

    socket.emit('send_message', newMsg);
    setMessage((prev) => [...prev, newMsg]);
    setEmojiObject(null);
    setShowEmojiPicker(false);
   };

   const handleEmojiSelectt = (emoji) => {
    if (!emoji) return;
    const tempID = Date.now().toString();
    const newMsg = {
  tempID,
  chatID: item.chatID,
  senderID: user.userID,
  content: emoji.native,
  type: 'emoji',
  timestamp: new Date().toISOString(),
  media_url: [],
  status: 'sent',
  senderInfo: { name: user.name, avatar: user.anhDaiDien },
...(replyMessage && {
  replyTo: {
    messageID: replyMessage.messageID || replyMessage._id,
    senderID: replyMessage.senderID,
    content: replyMessage.content,
    type: replyMessage.type,
    media_url: replyMessage.media_url || [],
    senderInfo: replyMessage.senderInfo, // ✅ Bắt buộc phải có
  }
}),
};
    socket.emit('send_message', newMsg);
    setMessage((prev) => [...prev, newMsg]);
    setEmojiObject(null);
    setShowEmojiPicker(false);
     setReplyMessage(null);
   };

  const handleScroll = (event) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    if (yOffset <= 0 && visibleCount < message.length) {
      setVisibleCount((prev) => prev + 10);
    }
  };
  const sortedMessages = [...message].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const visibleMessages = sortedMessages.slice(-visibleCount); // lấy 10 tin nhắn mới nhất

  const sendSelectedVideos = async () => {
    if (!videos.length) return;
    const formData = new FormData();
    videos.forEach((video) => {
      const fileType = video.uri.split('.').pop();
      formData.append('files', {
        uri: video.uri,
        type: `video/${fileType}`,
        name: `video.${fileType}`,
      });
    });
  
    try {
      const response = await fetch("https://cnm-service.onrender.com/api/upload", {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: formData,
      });
      const data = await response.json();
      const newMsg = {
        tempID: Date.now().toString(),
        chatID: item.chatID,
        senderID: user.userID,
        content: '',
        type: 'video',
        timestamp: new Date().toISOString(),
        media_url: data.urls,
        status: 'sent',
        senderInfo: { name: user.name, avatar: user.anhDaiDien },
      };
      setMessage((prev) => [...prev, newMsg]);
      socket.emit('send_message', newMsg);
      setVideos([]);  // Reset videos state
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const sendSelectedVideoss = async () => {
    if (!videos.length) return;
    const formData = new FormData();
    videos.forEach((video) => {
      const fileType = video.uri.split('.').pop();
      formData.append('files', {
        uri: video.uri,
        type: `video/${fileType}`,
        name: `video.${fileType}`,
      });
    });
  
    try {
      const response = await fetch("https://cnm-service.onrender.com/api/upload", {
        method: "POST",
        headers: { "Content-Type": "multipart/form-data" },
        body: formData,
      });
      const data = await response.json();
      const newMsg = {
        tempID: Date.now().toString(),
        chatID: item.chatID,
        senderID: user.userID,
        content: '',
        type: 'video',
        timestamp: new Date().toISOString(),
        media_url: data.urls,
        status: 'sent',
        senderInfo: { name: user.name, avatar: user.anhDaiDien },
      ...(replyMessage && {
  replyTo: {
    messageID: replyMessage.messageID || replyMessage._id,
    senderID: replyMessage.senderID,
    content: replyMessage.content,
    type: replyMessage.type,
    media_url: replyMessage.media_url || [],
    senderInfo: replyMessage.senderInfo, // ✅ Bắt buộc phải có
  }
}),
};
      setMessage((prev) => [...prev, newMsg]);
      socket.emit('send_message', newMsg);
      setVideos([]);  // Reset videos state
       setReplyMessage(null); // ✅ xóa trả lời sau khi gửi

    } catch (error) {
      console.error("Upload error:", error);
    }
  };
  useEffect(() => {
    socket.emit('read_messages', { chatID: item.chatID, userID: user.userID });
  }, [item.chatID]);

  useEffect(() => {
    socket.emit('join_chat', item.chatID);
    socket.emit('join_user', user.userID);

    const handleNewMessage = (data) => {
      setMessage((prev) => {
        if (prev.find((msg) => msg.tempID === data.tempID)) return prev;
        return [...prev, data];
      });
      if (data.senderID !== user.userID) {
        socket.emit('read_messages', { chatID: item.chatID, userID: user.userID });
      }
    };

    const handleStatusUpdate = ({ messageID, status, userID: statusUserID }) => {
      setMessage((prev) =>
        prev.map((msg) => {
          if ((msg.tempID === messageID || msg._id === messageID) && msg.status !== status) {
            return { ...msg, status };
          }
          return msg;
        })
      );
    };

    const handleUnsendMessage = ({ messageID }) => {
      setMessage((prev) =>
        prev.map((msg) => (msg.messageID === messageID ? { ...msg, type: 'unsent' } : msg))
      );
    };

    socket.on(item.chatID, handleNewMessage);
    socket.on(`status_update_${item.chatID}`, handleStatusUpdate);
    socket.on(`unsend_${item.chatID}`, handleUnsendMessage);
    socket.on("unsend_notification", (updatedMessage) => {
      setMessage(prevMessages =>
        prevMessages.map(m =>
          m.messageID === updatedMessage.messageID ? { ...m, ...updatedMessage } : m
        )
      );
          
    });
    socket.on("newMember", (data) => {
      setLength(data.length);
    });
    socket.on("outMember", (data) => {
      setLength(data.length);
    });
    socket.on("outMemberr", (data) => {
      setLength(data.length);
    });
    socket.on("status_update",(data) => {
      setMember(data);
    });
    
    socket.on("updatee_user", (updatedUser) => {
      setMember(updatedUser);
  setMessage((prevMessages) =>
    prevMessages.map((msg) => {
      if (msg.senderID === updatedUser.userID) {
        return {
          ...msg,
          senderInfo: {
            ...msg.senderInfo,
            name: updatedUser.name,
            avatar: updatedUser.anhDaiDien,
          },
        };
      }
      return msg;
    })
  );
});
socket.on("update_user", (updatedUser) => {  
  dispatch(setUser(updatedUser));
    setMessage((prevMessages) =>
      prevMessages.map((msg) => {
        if (msg.senderID === updatedUser.userID) {
          return {
            ...msg,
            senderInfo: {
              ...msg.senderInfo,
              name: updatedUser.name,
              avatar: updatedUser.anhDaiDien,
            },
          };
        }
        return msg;
      })
    );
  });
  socket.on("unghim_notification", (message) => {
    setPinnedMessages((prevPinned) =>
      prevPinned.filter((msg) => msg.messageID !== message.messageID)
    );
    setMessage((prevMessages) =>
      prevMessages.map((msg) =>
        msg.messageID === message.messageID ? { ...msg, pinnedInfo: null } : msg
      )
    );
  });
  socket.on("ghim_notification", (message) => {
    setPinnedMessages((prevPinned) => {
      const existingMessage = prevPinned.find((msg) => msg.messageID === message.messageID);
      if (existingMessage) {
        return prevPinned.map((msg) =>
          msg.messageID === message.messageID ? { ...msg, pinnedInfo: message.pinnedInfo } : msg
        );
      } else {
        return [...prevPinned, { ...message, pinnedInfo: message.pinnedInfo }];
      }
    });
    setMessage((prevMessages) =>
      prevMessages.map((msg) =>
        msg.messageID === message.messageID ? { ...msg, pinnedInfo: message.pinnedInfo } : msg
      )
    );
  });
  socket.on("removeChattt",(data)=>{
    navigation.navigate("Home", { screen: "Tin Nhắn" });
  })
  socket.on("updateChatmember",(data)=>{
   
    setChats(data);
  });
  socket.on("updateChat",(data)=>{
    setChats(data);
  });

  socket.on("updateMemberChattt",(data)=>{
    setChats(data);
    
  });
  socket.on("updateChat",(data)=>{
    setChats(data);
  })
  

    return () => {
      socket.off(item.chatID, handleNewMessage);
      socket.off(`status_update_${item.chatID}`, handleStatusUpdate);
      socket.off(`unsend_${item.chatID}`, handleUnsendMessage);
      socket.off('unsend_notification');
      socket.off("newMember");
      socket.off("outMember");
      socket.off("outMemberr");
      socket.off("status_update");
      socket.off("update_user");
      socket.off("updatee_user");
      socket.off("unghim_notification");
      socket.off("ghim_notification");
      socket.off("removeChattt");
      socket.off("updateChat");
      socket.off("updateMemberChattt");
      socket.off("updateChatmember");
      
    };
  }, [item.chatID, user.userID]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [message]);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status === 'granted') {
        const media = await MediaLibrary.getAssetsAsync({
          mediaType: 'photo',
          sortBy: [['creationTime', false]],
          first: 100,
        });
        setPhotos(media.assets);
      }
    })();
  }, []);

  const sendMessage = () => {
    if (!messages.trim()) return;
    const tempID = Date.now().toString();
    const newMsg = {
  tempID,
  chatID: item.chatID,
  senderID: user.userID,
  content: messages,
  type: 'text',
  timestamp: new Date().toISOString(),
  media_url: [],
  status: 'sent',
  senderInfo: { name: user.name, avatar: user.anhDaiDien },
  ...(replyMessage && {
  replyTo: {
    messageID: replyMessage.messageID || replyMessage._id,
    senderID: replyMessage.senderID,
    content: replyMessage.content,
    type: replyMessage.type,
    media_url: replyMessage.media_url || [],
    senderInfo: replyMessage.senderInfo, // ✅ Bắt buộc phải có
  }
}),
};

    socket.emit('send_message', newMsg);
    setMessage((prev) => [...prev, newMsg]);
    setMessages('');
    setReplyMessage(null); // ✅ xóa trả lời sau khi gửi

  };

  const sendMessagee = () => {
    if (!messages.trim()) return;
    const tempID = Date.now().toString();
    const newMsg = {
  tempID,
  chatID: item.chatID,
  senderID: user.userID,
  content: messages,
  type: 'text',
  timestamp: new Date().toISOString(),
  media_url: [],
  status: 'sent',
  senderInfo: { name: user.name, avatar: user.anhDaiDien },
};

    socket.emit('send_message', newMsg);
    setMessage((prev) => [...prev, newMsg]);
    setMessages('');

  };

 const sendSelectedImagess = async () => {
   
    if (!images.length) return;
    const formData = new FormData();
    images.forEach((img) => {
      formData.append("files", {
        uri: img.uri,
        type: img.mimeType || "image/jpeg",
        name: img.fileName || "photo.jpg",
      });
    });

    try {
      const response = await fetch("https://cnm-service.onrender.com/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      const newMsg = {
        tempID: Date.now().toString(),
        chatID: item.chatID,
        senderID: user.userID,
        content: '',
        type: 'image',
        timestamp: new Date().toISOString(),
        media_url: data.urls,
        status: 'sent',
        senderInfo: { name: user.name, avatar: user.anhDaiDien },
      ...(replyMessage && {
  replyTo: {
    messageID: replyMessage.messageID || replyMessage._id,
    senderID: replyMessage.senderID,
    content: replyMessage.content,
    type: replyMessage.type,
    media_url: replyMessage.media_url || [],
    senderInfo: replyMessage.senderInfo, // ✅ Bắt buộc phải có
  }
}),
};
      setMessage((prev) => [...prev, newMsg]);
      socket.emit('send_message', newMsg);
      setSelected([]);
      setShowGallery(false);
      setReplyMessage(null); // ✅ xóa trả lời sau khi gửi
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const sendSelectedImages = async () => {
   
    if (!images.length) return;
    const formData = new FormData();
    images.forEach((img) => {
      formData.append("files", {
        uri: img.uri,
        type: img.mimeType || "image/jpeg",
        name: img.fileName || "photo.jpg",
      });
    });

    try {
      const response = await fetch("https://cnm-service.onrender.com/api/upload", {
        method: "POST",
        body: formData,
      });
      const data = await response.json();
      const newMsg = {
        tempID: Date.now().toString(),
        chatID: item.chatID,
        senderID: user.userID,
        content: '',
        type: 'image',
        timestamp: new Date().toISOString(),
        media_url: data.urls,
        status: 'sent',
        senderInfo: { name: user.name, avatar: user.anhDaiDien },
      };
      setMessage((prev) => [...prev, newMsg]);
      socket.emit('send_message', newMsg);
      setSelected([]);
      setShowGallery(false);
    } catch (error) {
      console.error("Upload error:", error);
    }
  };

  const handleLongPress = (msg) => {
    if (msg.senderID !== user.userID || msg.type === 'unsent') return;
  
    Alert.alert('Thu hồi tin nhắn', 'Bạn có chắc muốn thu hồi?', [
      { text: 'Hủy' },
      {
        text: 'Thu hồi',
        style: 'destructive',
        onPress: () => {socket.emit('unsend_message', { chatID: item.chatID, messageID: msg.messageID, senderID: user.userID }); 
        setShowActionModal(false);},
      },
    ]);
  };

  const sendNotification = (content) => {
  if (!content.trim()) return;

  const tempID = Date.now().toString();

  const newNotification = {
    tempID,
    chatID: item.chatID,
    senderID: user.userID,
    content,
    type: "notification",
    timestamp: new Date().toISOString(),
    media_url: [],
    status: "sent",
    senderInfo: { name: user.name, avatar: user.anhDaiDien },
  };
  socket.emit("send_message", newNotification);
  setMessage(prev => [...prev, newNotification]);
};
const handleGhimMessage = (message) => {
    if (message.messageID) {
      socket.emit('ghim_message', {
        chatID: item.chatID,
        messageID: message.messageID,
        senderID: user.userID
      });

    // Gửi thông báo ngay sau khi emit thành công
    const content = `📌 ${user.name} đã ghim một tin nhắn.`;
    sendNotification(content);
    setTimeout(() => {
       setShowActionModal(false);
    }, 1000); // không cần delay quá lâu
    }
  }
  const unpinMessage = (msg) => {
  socket.emit("unghim_message", { chatID: msg.chatID, messageID: msg.messageID });
        // Gửi thông báo ngay sau khi emit thành công
    const content = `📌 ${user.name} đã bỏ ghim một tin nhắn.`;
    // Đóng modal sau một khoảng delay nhẹ (tùy thích)
    setTimeout(() => {
      sendNotification(content);
     setPinnedMessages(prev => prev.filter(m => m.messageID !== msg.messageID));
    }, 1000); // không cần delay quá lâu
  
};
useEffect(() => {
  if (!message || !Array.isArray(message)) return;

  const pinned = message.filter((msg) => msg.pinnedInfo);
  setPinnedMessages(pinned);
}, [message]);

const openGoogleDocs = (fileUrl) => {
  const googleDocsUrl = `https://docs.google.com/viewer?url=${encodeURIComponent(fileUrl)}&embedded=true`;
  Linking.openURL(googleDocsUrl);
};
 const handlecloseTransLate = () => {
     setTransLate(false);
    setMessagesToTranslate(null);
    setMessTranLate(null);
  };
  const handlecloseRecommend = () => {
    setRecommend(false);
    setMessagesToTranslate(null);
    setMessTranLate(null);
  };

  const handleTransLate = async (message) => {
  const  st = 'Translate the following message to Vietnamese: ' + message.content;
  const translatedMessage = await getCohereResponse(st);
  setTimeout(() => {
  setTransLate(true);
  setMessagesToTranslate(message);
  setShowActionModal(false);
  setMessTranLate(translatedMessage);
}, 2000);
}

const handleRecommendAnswer = async (message) => {
  const  st = 'Suggest multiple responses to the following message in Vietnamese: ' + message.content;
  const translatedMessage = await getCohereResponse(st);
  setTimeout(() => {
    setRecommend(true);
    setShowActionModal(false);
    setMessagesToTranslate(message);
    setMessTranLate(translatedMessage);
  }, 2000);
}

 const getCohereResponse = async (message) => {
   // const API_KEY = "3LRgcGf1oXepT31AcVdu0a9L1uQnW8jAaqh8WjSP";
   const API_KEY="tPbb7S45X5nomcSvNZXEYVGXPpu7axNagROhUb2k";
    const endpoint = "https://api.cohere.ai/v1/chat";
    

    try {
      const response = await axios.post(
        endpoint,
        {
          model: "command-r-plus",
          message: message,
          temperature: 0.3,
        },
        {
          headers: {
            Authorization: `Bearer ${API_KEY}`,
            "Content-Type": "application/json",
          },
        }
      );
      const botResponse = response.data.text;
      return botResponse;
    } catch (error) {
      console.error(
        "Error in Cohere API:",
        error.response?.data || error.message
      );
      return "Sorry, I couldn't process that right now.";
    }
  };



return (
  <>
    <Modal
  transparent
  visible={showActionModal}
  animationType="fade"
  onRequestClose={() => setShowActionModal(false)}
>
  <TouchableOpacity
    style={styles.modalOverlay}
    activeOpacity={1}
    onPressOut={() => setShowActionModal(false)}
  >
    <View style={styles.actionModal}>
      {/* Trả lời */}
      <TouchableOpacity
        style={styles.actionButtonn}
        onPress={() => {
          if (selectedMessage) {
            setReplyMessage({
              ...selectedMessage,
              senderInfo: selectedMessage.senderInfo || {
                name:
                  item.type === 'private'
                    ? member?.name
                    : item.members.find((m) => m.userID === selectedMessage.senderID)?.name ||
                      'Người dùng',
                avatar:
                  item.type === 'private'
                    ? member?.anhDaiDien
                    : item.members.find((m) => m.userID === selectedMessage.senderID)?.avatar || '',
              },
            });
          }
          setShowActionModal(false);
        }}
      >
        <FAIcon name="reply" size={20} color="#00caff" style={styles.actionIcon} />
        <Text style={styles.actionText}>Trả lời</Text>
      </TouchableOpacity>

      {/* Ghim */}
      <TouchableOpacity
        style={styles.actionButtonn}
        onPress={() => {
          if (!selectedMessage) return;
          const id = selectedMessage.messageID || selectedMessage._id;
          if (pinnedMessages.some((msg) => msg.messageID === id)) {
            Alert.alert('Thông báo', 'Tin nhắn đã được ghim rồi!');
            return;
          } else {
            handleGhimMessage(selectedMessage);
          }
        }}
      >
        <FAIcon name="thumb-tack" size={20} color="#ffaa00" style={styles.actionIcon} />
        <Text style={styles.actionText}>Ghim tin nhắn</Text>
      </TouchableOpacity>

      {/* Thu hồi */}
      {selectedMessage?.senderID === user.userID && selectedMessage.type !== 'unsend' && (
        <TouchableOpacity
          style={styles.actionButtonn}
          onPress={() => handleLongPress(selectedMessage)}
        >
          <FAIcon name="undo" size={20} color="#ff4444" style={styles.actionIcon} />
          <Text style={styles.actionText}>Thu hồi tin nhắn</Text>
        </TouchableOpacity>
      )}

      {/* Dịch */}
      {selectedMessage?.type === 'text' && (
        <TouchableOpacity
          style={styles.actionButtonn}
          onPress={() => handleTransLate(selectedMessage)}
        >
          <FAIcon name="language" size={20} color="#00caff" style={styles.actionIcon} />
          <Text style={styles.actionText}>Dịch tin nhắn</Text>
        </TouchableOpacity>
      )}

      {/* recommend */}
      {selectedMessage?.type === 'text' && (
        <TouchableOpacity
          style={styles.actionButtonn}
          onPress={() => handleRecommendAnswer(selectedMessage)}
        >
         <FAIcon name="lightbulb-o" size={20} color="#fff"  style={styles.actionIcon} />
          <Text style={styles.actionText}>Gợi ý trả lời</Text>
        </TouchableOpacity>
      )}
    </View>
  </TouchableOpacity>
</Modal>

    <View style={{ flex: 1, backgroundColor: '#000' }}>
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => handleScreenChange()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Image source={{uri:item.type ==="group" ? item.avatar : member?.anhDaiDien }} style={styles.avatarHeader} />
        <View style={styles.groupInfo}>
          <Text style={styles.groupName}>{item?.name}</Text>
         {item.type === "group" ? (<Text style={styles.memberCount}>{length} thành viên</Text>) : (<Text style={styles.memberCount}>{member?.trangThai}</Text>)}
        </View>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="call" size={20} color="#00caff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="videocam" size={20} color="#00caff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => handleOptionGroup()}
          >
            <Icon name="ellipsis-vertical" size={20} color="#00caff" />
          </TouchableOpacity>
        </View>
      </View>

      
{pinnedMessages.length > 0 && (
  <View style={styles.pinnedContainer}>
    <Text style={styles.pinnedHeader}>
      📌 {pinnedMessages.length} tin nhắn được ghim
    </Text>

    {(showAllPinned ? pinnedMessages : [pinnedMessages[pinnedMessages.length - 1]]).map((msg) => (
<View key={msg.tempID || msg._id || index} style={styles.pinnedMessage}>

        <Text style={styles.pinnedText}>
          {msg.senderID === user.userID ? 'Bạn' : msg.senderInfo?.name || 'Ai đó'}: {
            msg.type === 'image' ? (<Text>Image</Text>) :
            msg.type === 'video' ? (<Text>Video</Text>) :
            msg.type === 'audio' ? (<Text>Audio</Text>) :
            msg.type === 'file' ? (<Text>Document</Text>) :
            msg.type === 'emoji' ? (<Text>Emoji</Text>) :
          msg.content.slice(0, 80)}
        </Text>
        <TouchableOpacity onPress={() => unpinMessage(msg)}>
          <Text style={{ color: '#ff6f00' }}>❌</Text>
        </TouchableOpacity>
      </View>
    ))}

    {pinnedMessages.length > 1 && (
      <TouchableOpacity onPress={() => setShowAllPinned(!showAllPinned)}>
        <Text style={styles.togglePinned}>
          {showAllPinned ? 'Ẩn bớt' : 'Xem tất cả'}
        </Text>
      </TouchableOpacity>
    )}
  </View>
)}




      <ScrollView 
      ref={scrollContainerRef}
            onScroll={handleScroll} 
            contentContainerStyle={styles.chat}>
        {visibleMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).map((msg, index) => {
          if (msg.type === 'notification') {
            // Render tin nhắn notification kiểu đặc biệt
            return (
              <View key={msg._id || msg.tempID || index} style={styles.notificationContainer}>
                <Text style={styles.notificationText}>{msg.content}</Text>
              </View>
            );
          }

          const isMine = msg.senderID === user.userID;
 return (
<TouchableOpacity
  key={msg._id || index}
  onLongPress={() => {
    setSelectedMessage(msg);
    setShowActionModal(true);
  }}
>
    <View style={isMine ? styles.myMessageContainer : styles.otherMessageContainer}>
  {/* Avatar bên trái nếu là tin nhắn người khác */}
  {!isMine && <Image source={{ uri: msg.senderInfo?.avatar }} style={styles.avatarSmall} />}

  <View style={{ flexDirection: 'column', maxWidth: '80%' }}>
    {/* 🔹 Luôn hiển thị tên người gửi */}
    {msg.senderInfo?.name && (
      <Text style={{ color: '#999', fontSize: 12, marginLeft: 4, marginBottom: 2 }}>
        {msg.senderInfo.name}
      </Text>
    )}

    {/* Hộp chứa nội dung tin nhắn */}
    <View style={isMine ? styles.myMessage : styles.otherMessage}>
      {/* Nếu là tin nhắn trả lời */}
      {msg.replyTo && (
        <View style={{ backgroundColor: '#444', padding: 6, borderRadius: 6, marginBottom: 4 }}>
          <Text style={{ fontSize: 12, color: '#ccc' }}>
            Trả lời {msg.replyTo.senderID === user.userID ? 'Bạn' : msg.replyTo.senderInfo?.name || 'ai đó'}:{" "}
            {msg.replyTo.type === 'text' ? msg.replyTo.content :
              msg.replyTo.type === 'image' ? '[Image]' :
              msg.replyTo.type === 'video' ? '[Video]' :
              msg.replyTo.type === 'audio' ? '[Audio]' :
              msg.replyTo.type === 'file' ? '[File]' :
              msg.replyTo.type === 'emoji' ? '[Emoji]' :
              '[Unknown]'
            }
          </Text>
        </View>
      )}

      {/* Hiển thị nội dung tin nhắn */}
      {msg.type === 'video' && Array.isArray(msg.media_url) ? (
        msg.media_url.map((vid, i) => (
          <Video
            key={i}
            source={{ uri: vid }}
            controls
            resizeMode="contain"
            paused={false}
            style={{ width: 200, height: 150 }}
          />
        ))
      ) : msg.type === 'unsend' ? (
        <Text style={{ fontStyle: 'italic', color: 'gray' }}>Tin nhắn đã được thu hồi</Text>
      ) : msg.type === 'file' ? (
        <TouchableOpacity onPress={() => openGoogleDocs(msg.media_url)}>
          <Text style={{ color: '#00caff' }}>{msg.content}</Text>
        </TouchableOpacity>
      ) : msg.type === 'image' ? (
        msg.media_url.map((img, i) => (
          <TouchableOpacity
            key={i}
            onPress={() =>
              navigation.navigate('FullImageScreen', { uri: typeof img === 'string' ? img : img.uri })
            }
          >
            <Image source={{ uri: img }} style={styles.chatImage} />
          </TouchableOpacity>
        ))
      ) : (
        <Text style={{ color: isMine ? '#eaeaea' : '#fff' }}>{msg.content}</Text>
      )}

      {/* Trạng thái "Đã xem" hoặc "Đã gửi" (chỉ hiện với tin của mình) */}
      {isMine && msg.type !== 'unsend' && (
        <Text style={styles.statusText}>{msg.status === 'read' ? 'Đã xem' : 'Đã gửi'}</Text>
      )}
    </View>
  </View>

  {/* Avatar bên phải nếu là tin nhắn của mình */}
  {isMine && <Image source={{ uri: msg.senderInfo?.avatar }} style={styles.avatarSmall} />}
</View>

    </TouchableOpacity>
  );
})}
      </ScrollView>

      {showGallery && (
        <ScrollView horizontal style={{ padding: 10, borderTopWidth: 1, borderColor: '#333' }}>
          {photos.map((photo) => {
            const selectedFlag = selected.some((s) => s.id === photo.id);
            return (
              <TouchableOpacity
                key={photo.id}
                onPress={() =>
                  setSelected((prev) =>
                    selectedFlag ? prev.filter((s) => s.id !== photo.id) : [...prev, photo]
                  )
                }
              >
                <Image
                  source={{ uri: photo.uri }}
                  style={{ width: 80, height: 80, marginRight: 8, borderColor: '#00ff88', borderWidth: selectedFlag ? 2 : 0, borderRadius: 10 }}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}
      { showEmojiPicker && (
    <Picker
      onSelect={(emoji )=>{if(replyMessage){
        handleEmojiSelectt(emoji);

      } else { handleEmojiSelect(emoji); }
      }}
      theme="light" // hoặc "dark"
    />
   )}
        {replyMessage && (
  <View style={{
      backgroundColor: '#222',
      padding: 15,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
    }}>
     <View style={{ flex: 1, paddingRight: 10 }}>
      <Text
        style={{
          color: 'white',
          fontSize: 15,
          fontWeight: 'bold',
          flexShrink: 1,
          flexWrap: 'wrap',
        }}
      >
    {replyMessage.senderID === user.userID ? 'Bạn' : (replyMessage.senderInfo?.name || 'ai đó')}: {replyMessage.content}
      </Text>
    </View>

    <TouchableOpacity onPress={() => setReplyMessage(null)}>
     <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>❌ Hủy</Text>
    </TouchableOpacity>
  </View>
)}

 {tranLate && (
  <View
    style={{
      backgroundColor: '#222',
      padding: 15,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
    }}
  >
    <View style={{ flex: 1, paddingRight: 10 }}>
      <Text
        style={{
          color: 'white',
          fontSize: 15,
          fontWeight: 'bold',
          flexShrink: 1,
          flexWrap: 'wrap',
        }}
      >
       Dịch câu của : {messagesToTranslate.senderID === user.userID
          ? 'Bạn'
          : messagesToTranslate.senderInfo?.name || 'ai đó'}
        : {MessTranLate}
      </Text>
    </View>

    <TouchableOpacity onPress={handlecloseTransLate}>
      <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>❌ Hủy</Text>
    </TouchableOpacity>
  </View>
)}

{Recommend && (
  <View
    style={{
      backgroundColor: '#222',
      padding: 15,
      justifyContent: 'space-between',
      flexDirection: 'row',
      alignItems: 'flex-start',
      flexWrap: 'wrap',
    }}
  >
    
      <View style={{ flex: 1, paddingRight: 10 }}>
        <Text
          style={{
            color: 'white',
            fontSize: 15,
            fontWeight: 'bold',
            flexShrink: 1,
            flexWrap: 'wrap',
          }}
      >
     Gợi ý câu trả lời của: {messagesToTranslate.senderID === user.userID
          ? 'Bạn'
          : messagesToTranslate.senderInfo?.name || 'ai đó'}
        : {MessTranLate}
    </Text>
  </View>

  <TouchableOpacity onPress={handlecloseRecommend}>
    <Text style={{ color: 'white', fontWeight: 'bold', fontSize: 15 }}>❌ Hủy</Text>
  </TouchableOpacity>
</View>
)}



<View style={styles.inputBar}>

    <TouchableOpacity onPress={() => setShowEmojiPicker(prev => !prev)}>
      <Icon name="happy-outline" size={22} color="#ffaa00" style={styles.icon} />
    </TouchableOpacity>
   

<TextInput
  placeholder="Tin nhắn"
  value={messages}
  onChangeText={setMessages}
  style={styles.input}
  onFocus={() => setInputFocused(true)}
  onBlur={() => setInputFocused(false)}
/>
{ !inputFocused && (
  <>
    {images.length > 0 ? (
  <TouchableOpacity onPress={() => { 
    if (replyMessage){
      sendSelectedImagess();
    }else{
    sendSelectedImages() }}} style={styles.iconWrapper}>
    <Icon name="cloud-upload-outline" size={22} color="#00ff88" style={styles.icon} />
  </TouchableOpacity>
) : (
  <TouchableOpacity onPress={pickImage} style={styles.iconWrapper}>
    <Icon name="image" size={22} color="#ffaa00" style={styles.icon} />
  </TouchableOpacity>
)}

    {videos.length === 0 && (
      <TouchableOpacity onPress={() => { sendSelectedVideos }}>
        <FAIcon name="paperclip" size={22} color="#ffaa00" style={styles.icon} />
      </TouchableOpacity>
    )}

      <TouchableOpacity >
        <Icon name="mic-outline" size={26} color="#ffaa00" style={[styles.icon, { marginLeft: 8 }]} />
      </TouchableOpacity>

    {videos.length > 0 && (
      <TouchableOpacity onPress={()=>{if(replyMessage){
        sendSelectedVideoss();
      }else{
      sendSelectedVideos()}}}>
        <FAIcon name="save" size={22} color="#ffaa00" style={styles.icon} />
      </TouchableOpacity>
    )}

    
  </>
)}

  
  <TouchableOpacity onPress={()=>{
    if (replyMessage){
    sendMessage();
    } else{
    sendMessagee();
    }
  }}>
    <Icon name="send" size={22} color="#00caff" style={styles.icon} />
  </TouchableOpacity>
</View>
    </View>
    </>
  );
};


const styles = StyleSheet.create({
  pinnedContainer: {
  backgroundColor: '#333',
  paddingVertical: 10,
  paddingHorizontal: 12,
  marginBottom: 8,
},

pinnedHeader: {
  color: '#ffeb3b',
  fontWeight: 'bold',
  marginBottom: 4,
},

pinnedMessage: {
  paddingVertical: 4,
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
},

pinnedText: {
  fontWeight: 'bold',
  color: '#fff',
  fontSize: 15,
  flex: 1,
},

togglePinned: {
  color: '#00caff',
  marginTop: 4,
  fontSize: 13,
  fontStyle: 'italic',
  textAlign: 'center',
},

  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'gray', // hoặc màu header của bạn
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  replyPreview: {
  backgroundColor: '#2a2a2a',
  padding: 8,
  marginBottom: 6,
  borderLeftWidth: 4,
  borderLeftColor: '#00caff',
  borderRadius: 6,
},

replyText: {
  color: '#ccc',
  fontSize: 13,
},

pinnedContainer: {
  backgroundColor: '#333',
  paddingVertical: 10,
  paddingHorizontal: 12,
  marginBottom: 8,
},

pinnedHeader: {
  color: '#ffeb3b',
  fontWeight: 'bold',
  marginBottom: 4,
},


pinnedText: {
  color: '#fff',
  fontSize: 13,
},

togglePinned: {
  color: '#00caff',
  marginTop: 4,
  fontSize: 13,
  fontStyle: 'italic',
},
   modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionModal: {
    backgroundColor: '#222',
    borderRadius: 10,
    paddingVertical: 10,
    width: 260,
  },
  actionButtonn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
  },
  actionIcon: {
    marginRight: 12,
  },
  actionText: {
    fontSize: 16,
    color: '#fff',
  },
  avatarHeader: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 10,
  },
  
  groupInfo: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
  },
  
  groupName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  
  memberCount: {
    fontSize: 13,
    color: '#dcdcdc',
    marginTop: 2,
  },
  
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  
  actionButton: {
    marginHorizontal: 6,
  }, 
  icon: { marginLeft: 10 },
  chat: { padding: 10 },
  myMessageContainer: { 
    flexDirection: 'row', 
    justifyContent: 'flex-end', 
    alignItems: 'flex-end', 
    marginTop: 10 
  },
  otherMessageContainer: { 
    flexDirection: 'row', 
    alignItems: 'flex-end', 
    marginTop: 10 
  },
  myMessage: { 
    backgroundColor: '#2d2d2d', 
    padding: 10, 
    borderRadius: 10, 
    maxWidth: '75%' 
  },
  otherMessage: { 
    backgroundColor: '#1a1a1a', 
    padding: 10, 
    borderRadius: 10, 
    maxWidth: '75%' 
  },
  avatarSmall: { 
    width: 30, 
    height: 30, 
    borderRadius: 15, 
    marginHorizontal: 5 
  },
  chatImage: { width: 100, height: 100, borderRadius: 10, marginVertical: 5 },
  inputBar: {
    flexDirection: 'row',   // Các phần tử nằm ngang
    alignItems: 'center',   // Căn giữa các phần tử theo chiều dọc
    paddingHorizontal: 10,  // Khoảng cách giữa các phần tử và viền
    justifyContent: 'space-between', // Căn đều các phần tử
    backgroundColor: '#1a1a1a',
    height: 63,             // Chiều cao của thanh nhập liệu
  },

    notificationContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  notificationText: {
    backgroundColor: 'rgba(200, 200, 200, 0.3)',
    color: '#fff',
    fontSize: 12,
    fontStyle: 'italic',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 12,
    maxWidth: '70%',
    textAlign: 'center',
  },
  input: {
    flex: 1,                // Chiếm toàn bộ không gian còn lại
    color: '#fff',          // Màu chữ của input
    fontSize: 16,           // Kích thước font
    paddingVertical: 6,     // Padding dọc cho input
    paddingHorizontal: 12,  // Padding ngang cho input
    backgroundColor: 'gray', // Màu nền input
    borderRadius: 20,       // Góc bo tròn của input
    height: 40,             // Chiều cao của input (có thể điều chỉnh để vừa với inputBar)
    width:15,
  },
  icon: {
    marginHorizontal: 5,    // Giãn cách giữa các icon
  },
  statusText: { fontSize: 10, color: '#aaa', marginTop: 2, textAlign: 'right' },
  
  
});

export default ChatScreen;
