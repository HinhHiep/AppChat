import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView, Alert, Keyboard ,Modal} from 'react-native';
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

//const socket = io('https://cnm-service.onrender.com');
const socket = io('http://192.168.1.110:5000');

const ChatScreen = () => {

  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useSelector((state) => state.user);
  const { item } = route.params;
  const [message, setMessage] = useState(item?.lastMessage || []);
  const [messages, setMessages] = useState("");
  const scrollViewRef = useRef();
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [videos, setVideos] = useState([]);
  const [Video_Image,setVideo_Image] = useState(null);
  const [visibleCount, setVisibleCount] = useState(10);
  const scrollContainerRef = useRef(null);
 console.log("item",item);

  const handleEmojiSelect = (emojiObject) => {
    // Lấy emoji từ emojiObject
    const emoji = emojiObject.native;
    console.log("hhhh",emoji);
    setMessage((prevMessage) => prevMessage + emoji);  // Thêm emoji vào tin nhắn
    setShowEmojiPicker(false);  // Đóng emoji picker sau khi chọn
  };

  const handleScroll = (event) => {
    const yOffset = event.nativeEvent.contentOffset.y;
    if (yOffset <= 0 && visibleCount < message.length) {
      setVisibleCount((prev) => prev + 10);
    }
  };
  const sortedMessages = [...message].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  const visibleMessages = sortedMessages.slice(-visibleCount); // lấy 10 tin nhắn mới nhất


  const pickVideo = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: false,
      quality: 1,
    });
  
    if (!result.canceled) {
      //console.log("Video URI:", result.assets);
      //const video = result.assets[0];
      setVideos(result.assets);
      console.log("Video URI:",result.assets);
      console.log("Video Type:",result.assets);

      // Gửi video này về server
    }
  };
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
  useEffect(() => {
    socket.emit('read_messages', { chatID: item.chatID, userID: user.userID });
  }, [item.chatID]);

  useEffect(() => {
    socket.emit('join_chat', item.chatID);

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
          console.log('Received unsend notification:', updatedMessage);
    });

    return () => {
      socket.off(item.chatID, handleNewMessage);
      socket.off(`status_update_${item.chatID}`, handleStatusUpdate);
      socket.off(`unsend_${item.chatID}`, handleUnsendMessage);
      socket.off('unsend_notification');
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
    };
    socket.emit('send_message', newMsg);
    setMessage((prev) => [...prev, newMsg]);
    setMessages('');
  };
  const sendSelectedImages = async () => {
   
    if (!selected.length) return;
    const formData = new FormData();
    selected.forEach((img) => {
      const fileType = img.uri.split('.').pop();
      formData.append('files', {
        uri: img.uri,
        type: `image/${fileType}`,
        name: `upload.${fileType}`,
      });
    });

    try {
      const response = await fetch("https://echoapp-rho.vercel.app/api/upload", {
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
    console.log('Long Pressed:', msg.messageID);
    console.log('Chat ID:', item.chatID);
    Alert.alert('Thu hồi tin nhắn', 'Bạn có chắc muốn thu hồi?', [
      { text: 'Hủy' },
      {
        text: 'Thu hồi',
        style: 'destructive',
        onPress: () => socket.emit('unsend_message', { chatID: item.chatID, messageID: msg.messageID, senderID: user.userID }),
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#000' }}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Image source={{ uri: item.avatar || user?.anhDaiDien }} style={styles.avatarHeader} />
        <Text style={styles.username}>{item?.name}</Text>
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="call" size={20} color="#00caff" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Icon name="videocam" size={20} color="#00caff" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate('GroupOptionsScreen', { chatID: item.chatID })}
          >
            <Icon name="ellipsis-vertical" size={20} color="#00caff" />
          </TouchableOpacity>
        </View>
      </View>
      <ScrollView 
      ref={scrollContainerRef}
            onScroll={handleScroll} 
            contentContainerStyle={styles.chat}>
        {visibleMessages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)).map((msg, index) => {
          const isMine = msg.senderID === user.userID;
          return (
            <TouchableOpacity key={msg._id || index} onLongPress={() => handleLongPress(msg)}>
              <View style={isMine ? styles.myMessageContainer : styles.otherMessageContainer}>
                {!isMine && <Image source={{ uri: msg.senderInfo?.avatar }} style={styles.avatarSmall} />}
                <View style={isMine ? styles.myMessage : styles.otherMessage}>
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
                      )
                    : msg.type === 'unsend' ? (
                    <Text style={{ fontStyle: 'italic', color: 'gray' }}>Tin nhắn đã được thu hồi</Text>
                  ) : msg.type === 'image' ? (
                    msg.media_url.map((img, i) => (
                      <TouchableOpacity
                        key={i}
                        onPress={() => navigation.navigate('FullImageScreen', { uri: typeof img === 'string' ? img : img.uri })}
                        >
                      <Image key={i} source={{ uri: img }} style={styles.chatImage} />
                     </TouchableOpacity>
                    ))
                  ) : (
                    <Text style={{ color: isMine ? '#eaeaea' : '#fff' }}>{msg.content}</Text>
                  )}
                  {isMine && msg.type !== 'unsend' && (
                    <Text style={styles.statusText}>{msg.status === 'read' ? 'Đã xem' : 'Đã gửi'}</Text>
                  )}
                </View>
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
 {showEmojiPicker && (<Picker onEmojiSelect={handleEmojiSelect} />)}
<View style={styles.inputBar}>
  <InputDefault
    placeholder="Tin nhắn"
    value={messages}
    onChangeText={setMessages}
    style={styles.input}
  />
  
  <TouchableOpacity onPress={() => Keyboard.dismiss() || setShowEmojiPicker(!showEmojiPicker)}>
    <Icon name="happy-outline" size={22} color="#ffaa00" style={styles.icon} />
  </TouchableOpacity>
       
 
  <TouchableOpacity onPress={() => setShowGallery(!showGallery)}>
    <Icon name="image" size={22} color="#ffaa00" style={styles.icon} />
  </TouchableOpacity>
  { videos.length ===0 && (
  <TouchableOpacity onPress={()=>{pickVideo();setVideo_Image("Video")}}>
    <FAIcon name="paperclip" size={22} color="#ffaa00" style={styles.icon} />
  </TouchableOpacity>
   )}
  {videos.length > 0 && (
    <TouchableOpacity onPress={()=>{sendSelectedVideos()}}>
    <FAIcon name="save" size={22} color="#ffaa00" style={styles.icon} />
  </TouchableOpacity>
  )}
  
  {selected.length > 0 && (
    <TouchableOpacity onPress={sendSelectedImages}>
      <Icon name="cloud-upload-outline" size={22} color="#00ff88" style={styles.icon} />
    </TouchableOpacity>
  )}
  
  <TouchableOpacity onPress={sendMessage}>
    <Icon name="send" size={22} color="#00caff" style={styles.icon} />
  </TouchableOpacity>
</View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'gray',
    padding: 10,
  },
  avatarHeader: { width: 32, height: 32, borderRadius: 16, marginLeft: 10 },
  username: { color: '#fff', fontSize: 18, marginLeft: 10, flex: 1 },
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
  input: {
    flex: 1,                // Chiếm toàn bộ không gian còn lại
    color: '#fff',          // Màu chữ của input
    fontSize: 16,           // Kích thước font
    paddingVertical: 6,     // Padding dọc cho input
    paddingHorizontal: 12,  // Padding ngang cho input
    backgroundColor: '#1a1a1a', // Màu nền input
    borderRadius: 20,       // Góc bo tròn của input
    height: 40,             // Chiều cao của input (có thể điều chỉnh để vừa với inputBar)
  },
  icon: {
    marginHorizontal: 5,    // Giãn cách giữa các icon
  },
  statusText: { fontSize: 10, color: '#aaa', marginTop: 2, textAlign: 'right' },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    backgroundColor: 'gray',
    borderRadius: 20,
    padding: 8,
    marginLeft: 5,
  }
});

export default ChatScreen;
