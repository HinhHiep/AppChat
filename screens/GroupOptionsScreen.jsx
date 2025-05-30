import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Alert,
  FlatList,
  Modal,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';
import { useSelector } from 'react-redux';
import AddFriends from '../components/addFriend/AddFriends';
import { io } from 'socket.io-client';
//const socket = io("http://192.168.86.55:5000");
const socket = io('https://cnm-service.onrender.com');

const GroupOptionsScreen = () => {
  const navigation = useNavigation(); 
  const route = useRoute();
  const { user } = useSelector((state) => state.user);
  const { chatID, currentName, currentImage ,chat} = route.params;
  const [chats, setChats] = useState(chat||[]);
  const [groupName, setGroupName] = useState(chats.name || '');
  const [groupImage, setGroupImage] = useState(chats.avatar || null);
  console.log("groupImage",groupImage);
  const [modalVisible, setModalVisible] = useState(false);
  const [friendsFromServer, setFriendsFromServer] = useState([]);
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [selectedFriend, setSelectedFriend] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isModalVisibleCC, setIsModalVisibleCC] = useState(false);
  const [isSelected, setIsSelected] = useState(false);
  const [friends, setFriends] = useState([]);
  const [member, setMember] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);
// và useEffect fetch member bên trên...


  // Mở modal AddFriends
  const closeModalAdd = () => {
    setIsModalVisible(false);
  };
  const openModalAdd = () => {
    setIsModalVisible(true);
  };
  const closeModalCC = () => {
    setIsModalVisibleCC(false);
  };
  const openModalCC = () => {
    setIsModalVisibleCC(true);
  };
 
  useEffect(() => {
    if (!user || !socket) return;
  
    socket.emit('join_user', user.userID);
  
    const handleNewMember = (data) => {
      console.log("📦 newMember:", data);
      setFriendsFromServer(data);
    };
  
    const handleOutMember = (data) => {
      console.log("📦 outMember:", data);
      setFriendsFromServer(data);
    };
  
    const handleUpdateRole = (data) => {
      console.log("📦 UpdateRole:", data);
      setFriendsFromServer(data);
    };
  
    const handleUpdateChatt = (data) => {
      console.log("📦 updateChatt:", data);
      setChats(data);
    };
    

  
    socket.on("newMember", handleNewMember);
    socket.on("outMember", handleOutMember);
    socket.on("UpdateRole", handleUpdateRole);
    socket.on("updateChatt", handleUpdateChatt);
    socket.on("updateMemberChattt", handleUpdateChatt);
    socket.on("updateChatmember", handleUpdateChatt);
    socket.on("outMemberr",handleUpdateRole)
    socket.on("updateChat", handleUpdateChatt);
    socket.on("updateMemberChat", handleUpdateChatt);
  
    return () => {
      socket.off("newMember", handleNewMember);
      socket.off("outMember", handleOutMember);
      socket.off("UpdateRole", handleUpdateRole);
      socket.off("updateChatt", handleUpdateChatt);
      socket.off("updateMemberChattt", handleUpdateChatt);
      socket.off("updateChatmember", handleUpdateChatt);
      socket.off("outMemberr",handleUpdateRole);
      socket.off("updateChat", handleUpdateChatt);
      socket.off("updateMemberChat", handleUpdateChatt);
    };
  }, [user?.userID]);
  


   


  const getMemberList = async () => {
    try {
      const response = await fetch("https://cnm-service.onrender.com/api/InforMember", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ members: chats.members }),
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
  const getFriendsList = async () => {
    try {
      const res = await fetch("https://cnm-service.onrender.com/api/getMemberAddMember", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatID: chats.chatID,
          userID: user.userID,
        }),
      });
  
      // Check if the response is OK before proceeding
      if (!res.ok) {
        const errorDetails = await res.text(); // Read response body as text to get the error message
        console.error(`❌ Error fetching friends list: ${errorDetails}`);
        return;
      }
  
      const result = await res.json();
      // Validate the result to ensure it has the expected structure
      if (result && result.friends) {
        console.log("📦 Friends list:", result.friends);
        setFriends(result.friends);
      } else {
        console.error("❌ Invalid response format:", result);
      }
    } catch (err) {
      console.error("❌ Fetch failed:", err.message || err);
    }
  };
  

useEffect(() => {
  if (user) getMemberList();
}, [user]);

useEffect(() => {
  if (isModalVisible && user && chats?.chatID) {
    getFriendsList();
    
  }
}, [isModalVisible]);
const sendNotification = (content) => {
  if (!content.trim()) return;

  const tempID = Date.now().toString();

  const newNotification = {
    tempID,
    chatID: chats.chatID,
    senderID: user.userID,
    content,
    type: "notification",
    timestamp: new Date().toISOString(),
    media_url: [],
    status: "sent",
    pinnedInfo: null,
    senderInfo: { name: user.name, avatar: user.anhDaiDien },
  };
  socket.emit("send_message", newNotification);
};
    const handlremoveMember = async () => {
      if (chats.members.find(m => m.userID === user.userID && m.role === 'admin') ){
         setIsAdmin(false);
          navigation.navigate('TransferRoleScreen', {     
                                chatID: chats.chatID,
                                friendsFromServer: friendsFromServer,
                                currentUserID: user,
                                isAdmin: isAdmin,
                              })
      } else{
       Alert.alert('Bạn muốn rời nhóm', 'Bạn có chắc muốn rời nhóm?', [
            { text: 'Hủy' },
            {
              text: 'Rời nhóm',
              style: 'destructive',
              onPress: () =>{ socket.emit("removeMember", {chatID: chats.chatID, memberID: user.userID});
                sendNotification (`${user.name} đã rời khỏi nhóm chat.`);
                navigation.navigate("Home", { screen: "Tin Nhắn" });

              },
            },
          ]);
     // socket.emit("removeMember", {chatID: chat.chatID, memberID: user.userID});
     // navigation.navigate("Home", { screen: "Tin Nhắn" });
        }
    }

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setGroupImage(result.assets[0].uri);
    }
  };

  const toggleFriend = (friend) => {
    if (selectedFriend?.userID === friend.userID) {
      setSelectedFriend(null); // Bỏ chọn nếu nhấn lần nữa
    } else {
      setSelectedFriend(friend); // Chỉ chọn 1 người
    }
  };
  const toggleFriends = (friend) => {
    const isSelected = selectedFriends.some(f => f.userID === friend.userID);
    if (isSelected) {
      setSelectedFriends(selectedFriends.filter(f => f.userID !== friend.userID));
    } else {
      setSelectedFriends([...selectedFriends, friend]);
    }
  };
  

  const handleSaveName = () => {
    Alert.alert('Lưu tên nhóm', `Tên mới: ${groupName}`);
    // TODO: Gọi API đổi tên nhóm
  };

  const closeModal = () => setModalVisible(false);
  const openModal = () => {
    getMemberList();
    getFriendsList();
    setModalVisible(true);
  };
  const handlOutchat = async ()=>{
    Alert.alert('Bạn muốn rời nhóm', 'Bạn có chắc muốn rời nhóm?', [
      { text: 'Hủy' },
      {
        text: 'Rời nhóm',
        style: 'destructive',
        onPress: () =>{ socket.emit("removeMember", {chatID: chats.chatID, memberID: user.userID});
          navigation.navigate("Home", { screen: "Tin Nhắn" });
        },
      },
    ]);
  }
  const handlDeleteChat = async () => {
    Alert.alert('Bạn muốn giải tán nhóm', 'Bạn có chắc muốn giải tán nhóm?', [
      { text: 'Hủy' },
      {
        text: 'Giải tán',
        style: 'destructive',
        onPress: () =>{ socket.emit("deleteGroupAndMessages", {chatID: chats.chatID});
          navigation.navigate("Home", { screen: "Tin Nhắn" });
        },
      },
    ]);
  }

  return (
    <View style={styles.container}>
      {/* Nút back */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Tùy chọn</Text>

{/* Ảnh nhóm hoặc ảnh người chat 1-1 */}
<TouchableOpacity onPress={chats.type === 'group' ? pickImage : null} style={styles.imageContainer}>
  {chats.type === 'group' ? (
    groupImage ? (
      <Image source={{ uri: groupImage }} style={styles.image} />
    ) : (
      <View style={styles.placeholder}>
        <Text style={{ color: '#888' }}>Chọn ảnh nhóm</Text>
      </View>
    )
  ) : (
    member?.anhDaiDien ? (
      <Image source={{ uri: member.anhDaiDien }} style={styles.image} />
    ) : (
      <View style={styles.placeholder}>
        <Text style={{ color: '#888' }}>Ảnh đại diện</Text>
      </View>
    )
  )}
</TouchableOpacity>

{/* Tên nhóm hoặc tên người chat 1-1 */}
{chats.type === 'group' ? (
  <TextInput
    style={styles.input}
    value={groupName}
    onChangeText={setGroupName}
    placeholder="Nhập tên nhóm"
    placeholderTextColor="#888"
    editable={true} // cho chỉnh sửa tên nhóm
  />
) : (
  <Text style={[styles.input, { color: '#fff', paddingVertical: 10 }]}>
    {member?.name || 'Người dùng'}
  </Text>
)}


    {/* Nút Lưu tên nhóm chỉ hiện khi group */}
    {chats.type === 'group' && (
      <TouchableOpacity style={styles.saveButton} onPress={handleSaveName}>
        <Text style={styles.saveText}>💾 Lưu tên nhóm</Text>
      </TouchableOpacity>
    )}

      <TouchableOpacity
        style={styles.option}
        onPress={() => navigation.navigate('MediaFilesScreen', { chat: chats })}
      >
        <Text style={styles.optionText}>📁 Ảnh, video, file</Text>
      </TouchableOpacity>

      {chats.type === 'group' && (
      <>
      {/* Xem thành viên */}
      <TouchableOpacity style={styles.option} onPress={openModal}>
        <Text style={styles.optionText}>👥 Quản lý thành viên</Text>
      </TouchableOpacity>

{chats.members.find(m => m.userID === user.userID && m.role === 'admin') && (
  <TouchableOpacity
    style={styles.option}
    onPress={() => {
      setIsAdmin(true);
      navigation.navigate('TransferRoleScreen', {
      chatID: chats.chatID,
      friendsFromServer: friendsFromServer,
      currentUserID: user,
      isAdmin: isAdmin,
      });

    }}
  >
    <Text style={styles.optionText}>🔄 Chuyển quyền</Text>
  </TouchableOpacity>
)}



      

      <Modal visible={modalVisible} animationType="slide" onRequestClose={closeModal}>
  <View style={styles.modalContent}>
    <Text style={styles.modalTitle}>Quản lý thành viên nhóm</Text>

    <FlatList
      data={friendsFromServer}
      keyExtractor={(item) => item.userID}
      renderItem={({ item }) => {
        let isSelected = false;
        if (selectedFriend?.userID === user.userID){
           isSelected = false;
        } else{
            isSelected = selectedFriend?.userID === item.userID;
        }
         
        return (
          <TouchableOpacity
            style={[
              styles.friendRow,
              { backgroundColor: isSelected ? '#333' : 'transparent' },
            ]}
            onPress={() => toggleFriend(item)}
          >
            <View style={styles.friendInfo}>
              <Image source={{ uri: item.avatar }} style={styles.avatar} />
             {item.userID ===user.userID ? (<Text style={styles.friendName}>Bạn</Text>) :(<Text style={styles.friendName}>{item.name}</Text>)}
            </View>
            {isSelected && <Icon name="checkmark" size={20} color="#00caff" />}
          </TouchableOpacity>
        );
      }}
      ListEmptyComponent={<Text style={styles.empty}>Không tìm thấy bạn bè</Text>}
    />

    {/* Nút hành động */}
    <View style={styles.modalActions}>
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#00caff' }]}
        onPress={openModalAdd}
      >
        <Text style={styles.actionText}>➕ Thêm bạn bè</Text>

      </TouchableOpacity>
      
        {isModalVisible && <AddFriends closeModalAdd={closeModalAdd} friends={friends} user={user} chatID={chats.chatID}/>}
      

     {chats.members.find(m => m.userID === user.userID && m.role === 'admin') && (
      <TouchableOpacity
        style={[styles.actionButton, { backgroundColor: '#ff4444' }]}
        onPress={() => {
          if(selectedFriend){
          if (selectedFriend?.userID !== user.userID) {
           // Alert.alert('Xóa thành viên', `Đã chọn: ${selectedFriend?.name}`);
            // TODO: Gọi API xóa thành viên
            Alert.alert('Bạn muốn xoá thành viên'+`${selectedFriend?.name}`, 'Bạn có chắc muốn xoá?', [
              { text: 'Hủy' },
              {
                text: 'Xoá thành viên',
                style: 'destructive',
                onPress: () =>{socket.emit("deleteMember",{
                  chatID: chats.chatID,
                  adminID:user.userID,
                  memberID: selectedFriend?.userID,
                });
                  const content = `${user.name} đã xóa ${selectedFriend?.name} khỏi nhóm chat.`;
                  sendNotification(content);                
                },
              },
            ]);
          } else if (selectedFriend?.userID === user.userID) {
            Alert.alert('⚠️ Không thể xóa chính mình');
          }
          else {
            Alert.alert('⚠️ Chưa chọn thành viên nào');
          }
        } else {
          Alert.alert('⚠️ Chưa chọn thành viên nào');
        }
        }}
      >
        <Text style={styles.actionText}>🗑️ Xóa bạn bè</Text>
      </TouchableOpacity>)}
    </View>

    {/* Đóng modal */}
    <TouchableOpacity style={styles.closeModal} onPress={closeModal}>
      <Text style={styles.optionText}>Đóng</Text>
    </TouchableOpacity>
  </View>
</Modal>



      <TouchableOpacity style={styles.option} onPress={handlremoveMember}>
        <Text style={styles.optionText}>🚪 Rời nhóm</Text>
      </TouchableOpacity>
     
    
      {/* Nút giải tán nhóm */}
      {chats.members.find(m => m.userID === user.userID && m.role === 'admin') && (
      <TouchableOpacity
        style={[styles.option, { backgroundColor: '#ff4444' }]}
        onPress={handlDeleteChat}
      >
        <Text style={[styles.optionText, { color: '#fff' }]}>❌ Giải tán nhóm</Text>
      </TouchableOpacity>)}
      </>
    )}

    {/* Nếu là chat 1-1 thì hiện nút xóa cuộc trò chuyện */}
    {chats.type === 'private' && (
      <TouchableOpacity
        style={[styles.option, { backgroundColor: '#ff4444' }]}
        onPress={() => {
          Alert.alert('Xóa cuộc trò chuyện', 'Bạn có chắc muốn xóa cuộc trò chuyện này?', [
            { text: 'Hủy', style: 'cancel' },
            {
              text: 'Xóa',
              style: 'destructive',
              onPress: () => {
                socket.emit('deletePrivateChat', { chatID: chats.chatID });
                navigation.navigate('Home', { screen: 'Tin Nhắn' });
              },
            },
          ]);
        }}
      >
        <Text style={[styles.optionText, { color: '#fff' }]}>🗑️ Xóa cuộc trò chuyện</Text>
      </TouchableOpacity>
    )}

    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#000' },
  backButton: { marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  imageContainer: { alignSelf: 'center', marginBottom: 20 },
  image: { width: 100, height: 100, borderRadius: 50 },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#00caff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveText: { color: '#000', fontWeight: 'bold' },
  option: {
    padding: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginBottom: 10,
    alignItems: 'center',
  },
  optionText: { color: '#fff', fontSize: 16 },

  // Modal styles
  modalContent: { flex: 1, backgroundColor: '#111', padding: 20 },
  modalTitle: { fontSize: 18, color: '#fff', marginBottom: 10, textAlign: 'center' },
  closeModal: {
    marginTop: 20,
    backgroundColor: '#444',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  empty: { color: '#888', textAlign: 'center', marginTop: 20 },

  friendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomColor: '#333',
    borderBottomWidth: 1,
  },
  modalActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 5,
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
  },
  
  friendInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: { width: 40, height: 40, borderRadius: 20, marginRight: 10 },
  friendName: { color: '#fff', fontSize: 16 },
  actionButton: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
  },
  actionText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  adminButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#00caff',
    borderRadius: 6,
    marginLeft: 8,
  },
  
  adminButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  
  adminLabel: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#ccc',
    borderRadius: 6,
    marginLeft: 8,
  },
  
  adminLabelText: {
    color: '#333',
    fontWeight: 'bold',
  },
  friendName1: { color: 'gray', fontSize: 16 },
  
});

export default GroupOptionsScreen;
