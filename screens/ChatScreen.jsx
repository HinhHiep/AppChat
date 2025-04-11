import React, { useEffect, useState, useRef } from 'react';
import { View, Text, Image, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import InputDefault from '@/components/input/InputDefault';
import { createChatID } from '@/api/UserApi';

const ChatScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useSelector((state) => state.user);
  const { item } = route.params;
  const [message, setMessage] = useState(item?.lastMessage || []);
  const [messages, setMessages] = useState("");
  const scrollViewRef = useRef();

  const [hasPermission, setHasPermission] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [selected, setSelected] = useState([]);
  const [showGallery, setShowGallery] = useState(false);
  const [images, setImages] = useState([]);

  useEffect(() => {
    scrollViewRef.current?.scrollToEnd({ animated: true });
  }, [message]);

  useEffect(() => {
    (async () => {
      const { status } = await MediaLibrary.requestPermissionsAsync();
      setHasPermission(status === 'granted');
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

  const sendSelectedImages = async () => {
            if (selected.length === 0) return;
         const formData = new FormData();
            try {
            for (const img of selected) {
                const fileType = img.uri.split('.').pop(); // Lấy phần mở rộng ảnh
        
               
                formData.append('image', {
                uri: img.uri,
                type: `image/${fileType}`,
                name: `upload.${fileType}`,
                });
            }
                
        
                const response = await fetch("http://192.168.1.23:5000/api/upload", {
                method: "POST",
                headers: {
                    "Content-Type": "multipart/form-data",
                },
                body: formData,
                });
        
                if (!response.ok) {
                const errText = await response.text();
                console.error("❌ Upload ảnh thất bại:", errText);
                throw new Error("Upload ảnh thất bại");
                }
        
                const data = await response.json();
                setImages(data);
                console.log("✅ Upload thành công:", data.urls);

                const newMsg = {
                    chatID: item.chatID,
                    senderID: user.userID,
                    content: messages,
                    type: "image",
                    timestamp: new Date().toISOString(),
                    media_url: data.urls,
                    status: "sent",
                    senderInfo: {
                      name: user.name,
                      avatar: user.anhDaiDien,
                    }
                };
                setMessage((prev) => [...prev, newMsg]);
        // Clear sau khi gửi xong
        setSelected([]);
        setShowGallery(false);

}catch (error) {
        console.error("⚠️ Lỗi khi upload:", error);
      }
};
  

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.navigate("Home", { screen: "Tin Nhắn" })}>
          <Icon name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Image
          source={{ uri: user?.anhDaiDien || 'https://cdn-icons-png.flaticon.com/512/742/742752.png' }}
          style={styles.avatarHeader}
        />
        <Text style={styles.username}>{item?.name}</Text>
        <View style={styles.headerIcons}>
          <Icon name="call-outline" size={22} color="#fff" style={styles.icon} />
          <Icon name="videocam-outline" size={22} color="#fff" style={styles.icon} />
          <Icon name="ellipsis-vertical" size={22} color="#fff" style={styles.icon} />
        </View>
      </View>

      {/* Nội dung tin nhắn */}
      <ScrollView
  contentContainerStyle={styles.chat}
  ref={scrollViewRef}
  onContentSizeChange={() => scrollViewRef.current.scrollToEnd({ animated: true })}
>
  {[...message]
    .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)) // Sắp xếp từ cũ đến mới
    .map((msg, index) => {
      const isMyMessage = msg.senderID === user.userID;

      return (
        <View
          key={msg._id || index}
          style={isMyMessage ? styles.myMessageContainer : styles.otherMessageContainer}
        >
          {/* Avatar người khác */}
          {!isMyMessage && (
            <Image
              source={{ uri: msg?.senderInfo?.avatar || 'https://cdn-icons-png.flaticon.com/512/742/742752.png' }}
              style={styles.avatarSmall}
            />
          )}

          <View style={isMyMessage ? styles.myMessage : styles.otherMessage}>
            {msg.type === 'image' && Array.isArray(msg.media_url) ? (
              msg.media_url.map((img, idx) => (
                <Image
                  key={idx}
                  source={{ uri: typeof img === 'string' ? img : img.uri }}
                  style={styles.chatImage}
                />
              ))
            ) : (
              <Text style={isMyMessage ? styles.myText : styles.otherText}>
                {msg.content}
              </Text>
            )}
          </View>

          {/* Avatar của mình */}
          {isMyMessage && (
            <Image
              source={{ uri: msg?.senderInfo?.avatar || 'https://cdn-icons-png.flaticon.com/512/742/742752.png' }}
              style={styles.avatarSmall}
            />
          )}
        </View>
      );
    })}
</ScrollView>



      {/* Gallery ảnh */}
      {showGallery && photos.length > 0 && (
        <ScrollView horizontal style={{ padding: 10, borderTopWidth: 1, borderColor: '#333' }}>
          {photos.map((photo) => {
            const isSelected = selected.some((s) => s.id === photo.id);
            return (
              <TouchableOpacity
                key={photo.id}
                onPress={() => {
                  if (isSelected) {
                    setSelected(selected.filter((s) => s.id !== photo.id));
                  } else {
                    setSelected([...selected, photo]);
                  }
                }}
              >
                <Image
                  source={{ uri: photo.uri }}
                  style={{
                    width: 80,
                    height: 80,
                    marginRight: 8,
                    borderWidth: isSelected ? 2 : 0,
                    borderColor: '#00ff88',
                    borderRadius: 10,
                  }}
                />
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      )}

      <View style={styles.inputBar}>
        <InputDefault
          placeholder="Tin nhắn"
          value={messages}
          onChangeText={setMessages}
          underlineColorAndroid="transparent"
          autoCapitalize="none"
          style={styles.input}
        />

        <TouchableOpacity onPress={() => setShowGallery(!showGallery)}>
          <Icon name="image" size={24} color="#ffaa00" style={styles.icon} />
        </TouchableOpacity>

        {selected.length > 0 && (
          <TouchableOpacity onPress={sendSelectedImages}>
            <Icon name="cloud-upload-outline" size={24} color="#00ff88" style={styles.icon} />
          </TouchableOpacity>
        )}

        <TouchableOpacity >
          <Icon name="send" size={24} color="#00caff" style={styles.icon} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'gray',
    paddingHorizontal: 10,
    paddingVertical: 10,
  },
  avatarHeader: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginLeft: 10,
  },
  username: { color: '#fff', fontSize: 18, marginLeft: 10, flex: 1 },
  headerIcons: { flexDirection: 'row' },
  icon: { marginLeft: 10, padding: 4 },
  chat: { padding: 10 },
  chatImage: { width: 250, height: 150, borderRadius: 10 },
  time: { color: '#999', fontSize: 12, marginTop: 5 },
  myMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  otherMessageContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 10,
  },
  myMessage: {
    backgroundColor: '#2d2d2d',
    padding: 10,
    borderRadius: 10,
    maxWidth: '75%',
  },
  myText: { color: '#eaeaea' },
  chatImage: {
    width: 100,
    height: 100,
    borderRadius: 12,
    marginVertical: 4,
  },
  otherMessage: {
    backgroundColor: '#1a1a1a',
    padding: 10,
    borderRadius: 10,
    maxWidth: '75%',
    flexDirection: 'row',
    alignItems: 'center',
  },
  otherText: { color: '#fff' },
  reactIcon: { marginLeft: 5, fontSize: 16 },
  avatarSmall: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginHorizontal: 5,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#111',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderColor: '#222',
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: '#1a1a1a',
    borderRadius: 20,
  },
});

export default ChatScreen;
