import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
//const socket = io("http://192.168.1.110:5000");
const socket = io('https://cnm-service.onrender.com');

const CreateGroupScreen = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.user);

  const [groupName, setGroupName] = useState('');

  const [searchTerm, setSearchTerm] = useState('');
  const [friendsFromServer, setFriendsFromServer] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [filteredFriends, setFilteredFriends] = useState([]);
  const [file, setFile] = useState(null);
  const [fileavatar, setFileAvatar] = useState(null);

   useEffect(() => {
        if (socket && user?.userID) {
          socket.emit("join_user", user.userID);
        }
        },[user,socket]);

  // 📥 Lấy danh sách bạn bè từ server
  const getFriendsList = async () => {
    try {
      console.log("🔄 Fetching friends list with userID:", user?.userID);

      const response = await fetch("https://cnm-service.onrender.com/api/ContacsFriendByUserID", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userID: user.userID }),
      });

      const data = await response.json();
      if (response.ok) {
        setFriendsFromServer(data);
      } else {
        console.error("❌ Error fetching friends list:", data.message);
      }
    } catch (error) {
      console.error("❌ Fetch failed:", error.message);
    }
  };

  useEffect(() => {
    if (user) getFriendsList();
  }, [user]);
  useEffect(() => {
    const result = friendsFromServer.filter((friend) =>
    friend.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    friend.sdt?.includes(searchTerm)
  );
    setFilteredFriends(result);
  },[searchTerm, friendsFromServer]);
  

  // ✅ Toggle chọn/bỏ chọn bạn
  const toggleFriend = (friend) => {
    const isSelected = selectedFriends.some(f => f.userID === friend.userID);
    if (isSelected) {
      setSelectedFriends(selectedFriends.filter(f => f.userID !== friend.userID));
    } else {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };

  // Hàm chọn ảnh (avatar hoặc cover)
    const pickImage = async () => {
      try {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Lỗi', 'Bạn cần cấp quyền truy cập ảnh.');
          return;
        }
        const result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ImagePicker.MediaTypeOptions.Images,
          quality: 1,
          allowsEditing: true,
          aspect: [1, 1]
        });
  
        if (!result.canceled) {
          const uri = result.assets[0].uri;
            setFileAvatar(result.assets[0].uri);
            setFile(result.assets[0]);
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Không thể mở thư viện ảnh.');
      }
    };
  const uploadImage = async () => {
  const imageForm = new FormData();
  imageForm.append("files", {
    uri: file.uri,
    type: file.mimeType || "image/jpeg",
    name: file.fileName || "photo.jpg",
  });

  const res = await fetch("https://cnm-service.onrender.com/api/upload", {
    method: "POST",
    body: imageForm,
    // ❌ Không đặt Content-Type ở đây
  });

  const data = await res.json();
  return data?.urls?.[0] || "";
};

  // 🛠 Tạo nhóm
  const handleCreateGroup =async () => {
    if ( selectedFriends.length <2) {
      alert("Vui lòng nhập tên nhóm và chọn ít nhất 2 thành viên.");
      return;
    }
    if(!groupName) {
      alert("Vui lòng nhập tên nhóm.");
      return;
    }
    if (file) {
      const url = await uploadImage();
      setFileAvatar(url);
    } else{
      alert("Vui lòng chọn ảnh nhóm.");
      return;
    }
    const members = [];
    selectedFriends.forEach(friend => {
      members.push({ userID: friend.userID});
    });
       try {
    const data = {
      adminID: user.userID,
      name: groupName,
      members: members,
      avatar: fileavatar,
    };

    const response = await fetch("https://cnm-service.onrender.com/api/createGroupChat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ data} ),
      });
      const chat = await response.json();
      if (!chat){
        console.error("❌ Error creating group chat:", chat.message);
        return;
      }
      socket.emit("createChat1-1",chat);
      navigation.navigate("ChatScreen", { item: chat });
      console.log("📦 New group data:", chat);
    }catch (error) {
      console.error("❌ Fetch failed:", error.message);
    }

   
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#00caff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tạo nhóm</Text>
      </View>

      {/* Avatar + Group Name */}
      <TouchableOpacity style={styles.avatarPicker} onPress={pickImage}>
        <Image
          source={{ uri: fileavatar || 'https://i.pravatar.cc/100?u=group' }}
          style={styles.groupAvatar}
        />
        <Text style={styles.changeAvatarText}>Chọn ảnh nhóm</Text>
      </TouchableOpacity>

      <TextInput
        style={styles.input}
        placeholder="Nhập tên nhóm"
        value={groupName}
        onChangeText={setGroupName}
      />

      {/* Search Friends */}
      <TextInput
        style={styles.input}
        placeholder="Tìm bạn bè"
        value={searchTerm}
        onChangeText={setSearchTerm}
      />

      {/* Danh sách bạn bè */}
      <FlatList
        data={filteredFriends}
        keyExtractor={(item) => item.userID}
        renderItem={({ item }) => {
          const isSelected = selectedFriends.some(f => f.userID === item.userID);
          return (
            <TouchableOpacity
              style={styles.friendRow}
              onPress={() => toggleFriend(item)}
            >
              <View style={styles.friendInfo}>
                <Image source={{ uri: item.anhDaiDien }} style={styles.avatar} />
                <Text style={styles.friendName}>{item.name}</Text>
              </View>
              {isSelected && (
                <Icon name="checkmark-circle" size={20} color="#00caff" />
              )}
            </TouchableOpacity>
          );
        }}
        ListEmptyComponent={<Text style={styles.empty}>Không tìm thấy bạn bè</Text>}
      />

      {/* Đã chọn */}
      {selectedFriends.length > 0 && (
        <View style={styles.selectedContainer}>
          <Text style={styles.label}>Đã chọn:</Text>
          <View style={styles.selectedList}>
            {selectedFriends.map((friend) => (
              <Image
                key={friend.userID}
                source={{ uri: friend.anhDaiDien }}
                style={styles.selectedAvatar}
              />
            ))}
          </View>
        </View>
      )}

      <TouchableOpacity style={styles.createButton} onPress={handleCreateGroup}>
        <Text style={styles.createButtonText}>Tạo nhóm</Text>
      </TouchableOpacity>
    </View>
  );
};

export default CreateGroupScreen;


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#00caff',
  },
  avatarPicker: {
    alignItems: 'center',
    marginBottom: 10,
  },
  groupAvatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  changeAvatarText: {
    color: '#00caff',
    marginTop: 5,
    fontSize: 14,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    marginTop: 10,
  },
  friendRow: {
    paddingVertical: 10,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  friendName: {
    fontSize: 15,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
  },
  empty: {
    textAlign: 'center',
    marginTop: 20,
    color: '#999',
  },
  selectedContainer: {
    marginTop: 20,
  },
  label: {
    fontWeight: '600',
    marginBottom: 8,
  },
  selectedList: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  selectedAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  createButton: {
    backgroundColor: '#00caff',
    paddingVertical: 14,
    borderRadius: 10,
    marginTop: 20,
    alignItems: 'center',
  },
  createButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});
