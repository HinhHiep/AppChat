import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import axios from "axios";
import InputPhone from '@/components/input/InputPhone';
import { useSelector } from 'react-redux';
import { io } from "socket.io-client"; // Import socket.io-client

const socket = io("http://192.168.1.110:5000");  // Kết nối đến server socket
const SearchFriendByPhoneScreen = ({ navigation }) => {
  const { user } = useSelector((state) => state.user);
  const [phone, setPhone] = useState('');
  const [result, setResult] = useState(null);

  const handleSearch = async () => {
    console.log('Searching for:', phone);
    console.log('User ID:', user.userID); // hoặc _id tùy backend
    if (!phone.trim()) return;

    try {
      const response = await axios.post("https://echoapp-rho.vercel.app/api/search-friend-by-phone", {
        phoneNumber: phone,
        userID: user.userID, // hoặc _id tùy backend
      });
      if (response.status === 200) {
        setResult(response.data); 
        console.log('Search result:', response.data);
      } else {
        Alert.alert('Không tìm thấy người dùng', data.message || '');
        setResult(null);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể tìm kiếm.');
      console.error(error);
    }
  };

  const handleAddFriend = async () => {
    
    const data = {
      senderID: user.userID,
      recipientID: result.userID, // ID của người nhận (từ dữ liệu frontend)
      senderName: result.name,
      senderImage: result.avatar,
      recipientPhone: result.phoneNumber,
    };
    console.log("Gửi yêu cầu kết bạn:", data);
     socket.emit("send_friend_request", data); // Gửi yêu cầu kết bạn qua socket
    
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#00caff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tìm bạn bè</Text>
      </View>

      {/* Input */}
      <InputPhone
        placeholder="Nhập số điện thoại"
        iconLeft="phone-portrait"
        iconRight={true}
        onChangeText={(text) => {
          setPhone(text)
        }}
        value={phone}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
      />

      {/* Search button */}
      <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
        <Text style={styles.searchButtonText}>Tìm kiếm</Text>
      </TouchableOpacity>

      {/* Result */}
      {result && (
        <View style={styles.resultContainer}>
          <Image
            source={{ uri: result.avatar || 'https://i.pravatar.cc/100' }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{result.name}</Text>
          <Text style={styles.name}>{result.phoneNumber}</Text>
          <TouchableOpacity style={styles.addButton} onPress={handleAddFriend}>
            <Text style={styles.addButtonText}>Gửi lời mời kết bạn</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

export default SearchFriendByPhoneScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
    color: '#00caff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#00caff',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 15,
  },
  searchButton: {
    backgroundColor: '#00caff',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  searchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  resultContainer: {
    marginTop: 30,
    alignItems: 'center',
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginBottom: 10,
  },
  name: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 10,
  },
  addButton: {
    backgroundColor: '#00caff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
