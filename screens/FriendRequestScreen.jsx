import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from '@react-navigation/native';
import axios from "axios";
import { io } from "socket.io-client"; // Import socket.io-client

const socket = io("http://192.168.1.110:5000"); // Kết nối với server socket

const FriendRequestScreen = () => {
  const { user } = useSelector((state) => state.user);
  const navigation = useNavigation();
  const [receivedRequests, setReceivedRequests] = useState([]);  // Lời mời đã nhận
  const [sentRequests, setSentRequests] = useState([]);         // Lời mời đã gửi
  const [activeTab, setActiveTab] = useState('received'); 
  useEffect(() => {
    if (!user) {
     // setErrorMessage("Bạn chưa đăng nhập.");
      return;
    }
    
    // Đăng ký số điện thoại của người dùng khi kết nối socket
      socket.emit("join_user", user.userID);
    // Gửi yêu cầu lấy danh sách yêu cầu kết bạn từ server qua socket
    socket.emit("get_pending_friend_requests", user.userID);
    
    // Lắng nghe sự kiện "pending_friend_requests" để cập nhật danh sách yêu cầu kết bạn
    socket.on("pending_friend_requests", (friendRequests) => {
      setReceivedRequests(friendRequests.receivedRequests || []); // Cập nhật danh sách yêu cầu đã nhận
      setSentRequests(friendRequests.sentRequests || []); // Cập nhật danh sách yêu cầu đã gửi
      console.log("Danh sách yêu cầu kết bạn:", friendRequests);
      console.log("Danh sách yêu cầu đã gửi:",receivedRequests);
      console.log("Danh sách yêu cầu đã gửi:",sentRequests);
    });

    socket.on('new_friend_request', (data) => {
      console.log("Yêu cầu kết bạn mới:", data);
      setReceivedRequests((prevRequests) => [...prevRequests, data]); // Cập nhật danh sách yêu cầu kết bạn
    });
    socket.on('friend_request_sent', (data) => {
      setSentRequests((prevRequests) => [...prevRequests, data]); // Cập nhật danh sách yêu cầu đã gửi
      console.log("Yêu cầu kết bạn đã gửi:", data);
    });
    socket.on("friend_request_accepted", (data) => {

      if(data.status ==="accepted"){
        console.log("Yêu cầu kết bạn đã được chấp nhận:", data);
        setReceivedRequests((prevRequests) => prevRequests.filter(req => req.contactID !== data.userID)); // Xóa yêu cầu đã chấp nhận
        
      }

    });
    // Lắng nghe sự kiện lỗi
    socket.on("error", (error) => {
     // setErrorMessage(error.message || "Lỗi khi lấy yêu cầu kết bạn.");
     // setIsLoading(false);
      console.error("Lỗi:", error.message);
    });

    // Dọn dẹp sự kiện khi component unmount
    return () => {
      socket.off("pending_friend_requests");
      socket.off("new_friend_request");
      socket.off("friend_request_accepted");
      socket.off('friend_request_sent');
      socket.off("error");
    };
  }, [user]); // Khi user thay đổi, gọi lại yêu cầu lấy yêu cầu kết bạn      // Để chuyển giữa 2 tab
  const handleAccept = async (item) => {
        console.log("Chấp nhận yêu cầu kết bạn:", item.contactID);
        console.log("Chấp nhận yêu cầu kết bạn:", item.userID);
       console.log("Chấp nhận yêu cầu kết bạn:", user.userID);
        console.log("Chấp nhận yêu cầu kết bạn:", item.name);
        console.log("Chấp nhận yêu cầu kết bạn:", item.avatar); 
        socket.emit("accept_friend_request", {
          senderID: item.contactID,
          recipientID: user.userID,
          senderName: item.name,
          senderImage: item.avatar,
        });
  };

  const handleReject = async (requestID) => {
    // Fake xử lý reject
    setReceivedRequests(prev => prev.filter(req => req.userID === requestID));
  };

  const renderItem = ({ item, type }) => (
    <View style={styles.itemContainer}>
      <Image
        source={{ uri: item.avatar || 'https://i.pravatar.cc/150' }}
        style={styles.avatar}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
        <View style={styles.actions}>
          {type === 'received' && (
            <>
              <TouchableOpacity style={styles.acceptButton} onPress={() => handleAccept(item)}>
                {/* <Icon name="checkmark" size={18} color="#fff" /> */}
                <Text style={{ color: '#fff' }}>Chấp nhận</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.rejectButton} onPress={() => handleReject(item.userID)}>
                {/* <Icon name="close" size={18} color="#fff" /> */}
                <Text style={{ color: '#fff' }}>Từ chối</Text>
              </TouchableOpacity>
            </>
          )}
          {type === 'sent' && <Text style={styles.sentText}>Đã gửi</Text>}
        </View>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Icon name="arrow-back" size={24} color="#00caff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Lời mời kết bạn</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabs}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'received' && styles.activeTab]}
          onPress={() => setActiveTab('received')}
        >
          <Text style={[styles.tabText, activeTab === 'received' && styles.activeTabText]}>Đã nhận</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'sent' && styles.activeTab]}
          onPress={() => setActiveTab('sent')}
        >
          <Text style={[styles.tabText, activeTab === 'sent' && styles.activeTabText]}>Đã gửi</Text>
        </TouchableOpacity>
      </View>

      {/* Danh sách theo tab */}
      {activeTab === 'received' && (
        <FlatList
          data={receivedRequests}
          keyExtractor={(item) => item.contactID}
          renderItem={(props) => renderItem({ ...props, type: 'received' })}
          ListEmptyComponent={<Text style={styles.empty}>Không có lời mời nào</Text>}
        />
      )}

      {activeTab === 'sent' && (
        <FlatList
          data={sentRequests}
          keyExtractor={(item) => item.userID}
          renderItem={(props) => renderItem({ ...props, type: 'sent' })}
          ListEmptyComponent={<Text style={styles.empty}>Chưa gửi lời mời nào</Text>}
        />
      )}
    </View>
  );
};

export default FriendRequestScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9f9f9',
    paddingHorizontal: 15,
    paddingBottom: 10,
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#00caff',
    marginLeft: 12,
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginLeft:50,
    marginRight:50,
    marginBottom: 15,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#00caff',
  },
  activeTab: {
    backgroundColor: '#00caff',
  },
  tabText: {
    fontSize: 16,
    color: '#00caff',
  },
  activeTabText: {
    color: '#fff',
  },
  itemContainer: {
    backgroundColor:"#9EC6F3",
    padding:10,
    margin:10,
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  infoContainer: {
    flex: 1,
  },
  name: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 5,
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  acceptButton: {
    backgroundColor: '#00caff',
    padding: 8,
    borderRadius: 20,
    marginRight: 10,
  },
  rejectButton: {
    backgroundColor: '#ff5b5b',
    padding: 8,
    borderRadius: 20,
  },
  sentText: {
    fontSize: 14,
    color: '#888',
  },
  empty: {
    textAlign: 'center',
    color: '#888',
    marginTop: 20,
  },
});
