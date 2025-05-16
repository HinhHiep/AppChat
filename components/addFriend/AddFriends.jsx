import React, { useState,useEffect } from 'react';
import { Modal, TouchableOpacity, FlatList, Text, View, Image, TextInput, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { io } from 'socket.io-client';
const socket = io("http://192.168.186.55:5000");

const AddFriends = ({ friends, closeModalAdd,user ,chatID}) => {
  const [selectedFriends, setSelectedFriends] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  console.log('Selected friends:', friends);
   useEffect(() => {
    if (!user) return;
    socket.emit('join_user', user.userID);
   },[user,socket]);
  const toggleFriends = (friend) => {
    setSelectedFriends((prevSelected) => {
      const isSelected = prevSelected.some((f) => f.userID === friend.userID);
      if (isSelected) {
        return prevSelected.filter((f) => f.userID !== friend.userID);
      } else {
        return [...prevSelected, friend];
      }
    });
  };

  const handleAddMembers = () => {
    if (selectedFriends.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn ít nhất một người bạn');
      return;
    }
    if (!chatID) {
      console.warn("❗ chatID không hợp lệ");
      return;
    }
    const members = selectedFriends.map((friend) => friend.userID);
    console.log('Thêm thành viên:', members);
    const data = {
     chatID:chatID,
     members: members
    };
    socket.emit('AddMember',data);
    closeModalAdd(); // Đóng modal sau khi thêm thành viên
  };

  // Kiểm tra và lọc bạn bè theo từ khóa tìm kiếm
  const filteredFriends = friends.filter((friend) =>
    friend.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Modal visible={true} animationType="slide" onRequestClose={closeModalAdd} transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          {/* Search input */}
          <TextInput
            style={styles.searchInput}
            placeholder="Tìm bạn bè"
            value={searchTerm}
            onChangeText={setSearchTerm}
          />

          <FlatList
            data={friends}
            keyExtractor={(item) => item.userID}
            renderItem={({ item }) => {
              const isSelected = selectedFriends.some((f) => f.userID === item.userID);
              return (
                <TouchableOpacity style={styles.friendRow} onPress={() => toggleFriends(item)}>
                  <View style={styles.friendInfo}>
                    <Image source={{ uri: item.avatar }} style={styles.avatar} />
                    <Text style={styles.friendName}>{item.name}</Text>
                    {isSelected && <Icon name="checkmark-circle" size={20} color="#00caff" />}
                  </View>
                </TouchableOpacity>
              );
            }}
            ListEmptyComponent={<Text style={styles.empty}>Không tìm thấy bạn bè</Text>}
          />

          {selectedFriends.length > 0 && (
            <View style={styles.selectedContainer}>
              <Text style={styles.label}>Đã chọn:</Text>
              <View style={styles.selectedList}>
                {selectedFriends.map((friend) => (
                  <Image
                    key={friend.userID}
                    source={{ uri: friend.avatar }}
                    style={styles.selectedAvatar}
                  />
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.createButton} onPress={handleAddMembers}>
            <Text style={styles.createButtonText}>Thêm thành viên</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.closeModal} onPress={closeModalAdd}>
            <Text style={styles.optionText}>Đóng</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = {
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    width: '80%',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  searchInput: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    width: '100%',
  },
  friendRow: {
    flexDirection: 'row',
    padding: 10,
    alignItems: 'center',
  },
  friendInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  friendName: {
    fontSize: 16,
    flex: 1,
  },
  empty: {
    fontSize: 16,
    color: '#888',
  },
  selectedContainer: {
    marginTop: 20,
    alignItems: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  selectedList: {
    flexDirection: 'row',
    marginTop: 10,
  },
  selectedAvatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    margin: 5,
  },
  createButton: {
    backgroundColor: '#00caff',
    padding: 10,
    marginTop: 20,
    borderRadius: 5,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  closeModal: {
    marginTop: 20,
  },
  optionText: {
    fontSize: 16,
    color: '#888',
  },
};

export default AddFriends;
