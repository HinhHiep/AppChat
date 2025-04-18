import React,{useEffect,useState} from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation } from "@react-navigation/native";
import { useSelector } from 'react-redux';
import { io } from 'socket.io-client';
import SearchBar from '../screens/SearchBar'; // Assuming you have a SearchBar component


//const socket = io('https://cnm-service.onrender.com');
const socket = io("http://192.168.1.110:5000"); // Kết nối với server socket

const FilterBar = () => (
  <View style={styles.filterBar}>
    {['Bạn bè', 'Nhóm', 'OA'].map((label) => (
      <TouchableOpacity key={label} style={styles.filterButton}>
        <Text>{label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);


const ContactsScreen = () => {
  const { user } = useSelector((state) => state.user);
  const navigation = useNavigation();
  const [friendsList, setFriendsList] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [length, setLength] = useState(receivedRequests.length);

  useEffect(() => {
      if (socket && user?.userID) {
        socket.emit("join_user", user.userID);
        socket.emit("get_pending_friend_requests", user.userID);
        // Lắng nghe sự kiện "pending_friend_requests" để cập nhật danh sách yêu cầu kết bạn
        socket.on("pending_friend_requests", (friendRequests) => {
            setReceivedRequests(friendRequests.receivedRequests || []); // Cập nhật danh sách yêu cầu đã nhận
            console.log("Danh sách yêu cầu kết bạn:", friendRequests);
        });
        socket.on('new_friend_request', (data) => {
          console.log("Yêu cầu kết bạn mới:", data);
          setReceivedRequests((prevRequests) => [...prevRequests, data]);
          setLength(receivedRequests.length); // Cập nhật số lượng yêu cầu kết bạn
        });
        socket.on("friend_request_accepted", (data) => {
          if(data.status ==="accepted"){
            setFriendsList((prevRequests) =>[...prevRequests,data]); // Xóa yêu cầu đã chấp nhận
            setReceivedRequests((prevRequests) => prevRequests.filter(req => req.contactID !== data.userID)); // Xóa yêu cầu đã chấp nhận
            setLength(receivedRequests.length);
          }
        });

      }
      // Dọn dẹp sự kiện khi component unmount
    return () => {
      socket.off("pending_friend_requests");
      socket.off("new_friend_request");
      socket.off("friend_request_accepted");
    };
    }, [user?.userID]);
    const getFriendsList = async () => {
      try {
        console.log("🔄 Fetching friends list with userID:", user?.userID);
    
        const response = await fetch("http://192.168.1.110:5000/api/ContacsFriendByUserID", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userID: user.userID }),
        });
    
        const data = await response.json();
        console.log("📦 Server response:", data);
    
        if (response.ok) {
          setFriendsList(data);
        } else {
          console.error("❌ Error fetching friends list:", data.message);
        }
      } catch (error) {
        console.error("❌ Fetch failed:", error.message);
      }
    };
    
  useEffect(() => {
    if(!user) return; 
    getFriendsList(); 
  }, [user]);
  const fetchatListChatFriend = async (friend) => {
    try {
      const response = await fetch("http://192.168.1.110:5000/api/chats1-1ByUserID", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userID1: user.userID,
          userID2: friend.userID,
        }),
      });
  
      const chat = await response.json();
      
  
      if (response.ok && chat && chat.chatID) {
        // Nếu đã có chat, chuyển đến ChatScreen
        navigation.navigate('ChatScreen', { item: chat });
      } else {
        // Nếu chưa có, tạo chat mới
        const createResponse = await fetch("http://192.168.1.110:5000/api/createChat1-1", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userID1: user.userID,
            userID2: friend.userID,
          }),
        });
  
        const newChat = await createResponse.json();
       
        console.log("📦 New chat response:", newChat);
        if (createResponse.ok && newChat.chatID) {
          socket.emit("createChat1-1",newChat);
          navigation.navigate('ChatScreen', { item: newChat });
        } else {
          console.error("Không tạo được chat mới", newChat.message || newChat);
        }
      }
    } catch (error) {
      console.error("Lỗi khi lấy/tạo chat:", error);
    }
  };
  

  const RenderItem = ({ item,onPress}) =>{
    return (
    <TouchableOpacity onPress={onPress}>
    <View style={styles.itemContainer}>
      <Image
        source={{ uri: item.anhDaiDien || 'https://i.pravatar.cc/150' }}
        style={styles.avatar}
      />
      <View style={styles.infoContainer}>
        <Text style={styles.name}>{item.name}</Text>
      </View>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="call" size={20} color="#00caff" />
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionButton}>
          <Icon name="videocam" size={20} color="#00caff" />
        </TouchableOpacity>
      </View>
    </View>
    </TouchableOpacity>
  );
};
  
  
  

  return (
    <View style={styles.container}>
      <SearchBar></SearchBar>
      <TouchableOpacity
        onPress={() => navigation.navigate('FriendRequestScreen',{user:user})}
        style={styles.friendRequestRow}
      >
        <Text style={styles.sectionText}>Lời mời kết bạn {length}</Text>
        <Icon name="chevron-forward" size={20} color="#fff" />
      </TouchableOpacity>

      {/* Filter bar for categories */}
      <FilterBar />
      {/* FlatList to render friends */}
      <FlatList
          data={friendsList}
          keyExtractor={(item) => item.userID}
          renderItem={({ item }) => (
            <RenderItem item={item} onPress={() => fetchatListChatFriend(item)} />
          )}
        />

    </View>
  );
};

export default ContactsScreen;

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
    marginTop: 5,
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
  itemContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 0.5,
    borderBottomColor: '#eee',
    backgroundColor: '#fff',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  phone: {
    fontSize: 14,
    color: '#888',
    marginTop: 2,
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center',
  },
  actions: {
    flexDirection: 'row',
    gap: 10,
  },
  actionButton: {
    backgroundColor: '#e6faff',
    borderRadius: 20,
    padding: 8,
    marginLeft: 5,
  },
  section: {
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
    backgroundColor: '#00caff',
  },
  sectionText: {
    marginLeft: 15,
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  friendRequestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
    paddingHorizontal: 15,
    backgroundColor: '#00caff',
  },  
});
