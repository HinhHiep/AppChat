// components/SearchBar.js
import React, { useState } from 'react';
import { View, Text, Modal, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';

const SearchBar = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { user } = useSelector((state) => state.user);

  const openModal = () => {
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
  };

  const navigation = useNavigation();

  const handleAddFriend = () => {
    navigation.navigate('SearchFriendByPhoneScreen',{user:user});
    closeModal();
  };

  const handleCreateGroup = () => {
    
    navigation.navigate('CreateGroupScreen',{user:user});
    closeModal();
  };

  return (
    <View style={styles.searchBar}>
      <Icon name="search" size={20} color="#00caff" />
      <Text style={styles.searchText}>Tìm kiếm</Text>
      <View style={styles.searchIcons}>
        <Icon name="qr-code-outline" size={22} color="#00caff" style={{ marginRight: 15 }} />
        <TouchableOpacity onPress={openModal}>
          <Icon name="add" size={22} color="#00caff" />
        </TouchableOpacity>
      </View> 

      {/* Modal for Add Friend / Create Group */}
      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
        onRequestClose={closeModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TouchableOpacity style={styles.modalButton} onPress={handleAddFriend}>
              <Text style={styles.modalButtonText}>Thêm bạn</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={handleCreateGroup}>
              <Text style={styles.modalButtonText}>Tạo nhóm</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
              <Text style={styles.closeButtonText}>Đóng</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 25,
    marginBottom: 20,
    elevation: 2,
  },
  searchText: {
    fontSize: 16,
    color: '#00caff',
    flex: 1,
    marginLeft: 10,
  },
  searchIcons: {
    flexDirection: 'row',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButton: {
    padding: 15,
    backgroundColor: '#00caff',
    width: '100%',
    borderRadius: 5,
    marginBottom: 10,
  },
  modalButtonText: {
    color: '#fff',
    textAlign: 'center',
  },
  closeButton: {
    padding: 10,
    backgroundColor: '#ff5b5b',
    borderRadius: 5,
    marginTop: 10,
  },
  closeButtonText: {
    color: '#fff',
  },
});

export default SearchBar;
