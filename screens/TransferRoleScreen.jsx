import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Image,
  Alert,
  Platform,
} from "react-native";
import Icon from "react-native-vector-icons/Ionicons";
import { useNavigation, useRoute } from "@react-navigation/native";
import { io } from 'socket.io-client';
//const socket = io("http://192.168.86.55:5000");
const socket = io('https://cnm-service.onrender.com'); // Kết nối với server socket

const TransferRoleScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const friendsFromServer = route.params?.friendsFromServer || [];
  const currentUserID = route.params?.currentUserID || null;
   const chatID = route.params?.chatID || null;
   const isAdmin = route.params?.isAdmin || null;

  const [selectedFriend, setSelectedFriend] = useState(null);
  const [members, setMembers] = useState([]);

  useEffect(() => {
    // Lọc bỏ user hiện tại ra khỏi danh sách chọn được
    const filteredMembers = friendsFromServer.filter(
      (m) => m.userID !== currentUserID.userID
    );
    setMembers(filteredMembers);
  }, [friendsFromServer, currentUserID]);

  const toggleFriend = (friend) => {
    if (selectedFriend?.userID === friend.userID) {
      setSelectedFriend(null);
    } else {
      setSelectedFriend(friend);
    }
  };
  const sendNotification = (content) => {
  if (!content.trim()) return;

  const tempID = Date.now().toString();

  const newNotification = {
    tempID,
    chatID: chatID,
    senderID: currentUserID.userID,
    content,
    type: "notification",
    timestamp: new Date().toISOString(),
    media_url: [],
    status: "sent",
    pinnedInfo: null,
    senderInfo: { name: currentUserID.name, avatar: currentUserID.anhDaiDien },
  };
  socket.emit("send_message", newNotification);
};

  const assignAdmin = (friend) => {
    if (!isAdmin){
    Alert.alert(
      "Xác nhận chuyển quyền",
      `Bạn có chắc muốn chuyển quyền admin cho ${friend.name}?`,
      [
        { text: "Hủy", style: "cancel" },
        {
          text: "Chuyển quyền",
          onPress: () => {
            // TODO: Gọi API hoặc emit socket để cập nhật quyền admin
            socket.emit("updateAdmin", {
              chatID: chatID,
              adminID: currentUserID.userID,
              memberID: friend.userID,
            });
            const content = `${friend.name} đã được bổ nhiệm là nhóm trưởng.`;
            sendNotification(content);
            setSelectedFriend(null);
            setTimeout(() => {
              const content = `${currentUserID.name} đã rời khỏi nhóm chat.`;
              sendNotification(content);
              socket.emit("removeMember", {chatID:chatID, memberID:currentUserID.userID});
              setSelectedFriend(null);
              navigation.navigate("Home", { screen: "Tin Nhắn" });
          }, 2000);
          },
        },
      ]
    );
  } else{
    Alert.alert(
      "Thông báo",
      `Bạn không có quyền chuyển quyền admin.`,
      [
        { text: "OK", style: "cancel" },
        {text:"chuyển quyền", onPress: () => {
           socket.emit("updateAdmin", {
              chatID: chatID,
              adminID: currentUserID.userID,
              memberID: friend.userID,
            });
            const content = `${friend.name} đã được bổ nhiệm là nhóm trưởng.`;
            sendNotification(content);
            setSelectedFriend(null);
            navigation.goBack();

        }}
      ]
    );
  }
  };

  const renderItem = ({ item }) => {
    const isSelected = selectedFriend?.userID === item.userID;

    return (
      <TouchableOpacity
        onPress={() => toggleFriend(item)}
        style={[styles.friendRow, isSelected && styles.selectedRow]}
        activeOpacity={0.8}
      >
        <Image source={{ uri: item.avatar }} style={styles.avatar} />
        <View style={styles.info}>
          <Text style={styles.friendName}>
            {item.name}{" "}
            {item.userID === currentUserID.userID && item.role === "admin" && (
              <Text style={styles.currentAdminText}>(Nhóm trưởng hiện tại)</Text>
            )}
          </Text>
        </View>
        {isSelected && (
          <TouchableOpacity
            style={styles.assignButton}
            onPress={() => assignAdmin(item)}
            activeOpacity={0.7}
          >
            <Text style={styles.assignButtonText}>Gán Admin</Text>
          </TouchableOpacity>
        )}
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Icon name="arrow-back" size={28} color="#eee" />
        </TouchableOpacity>
        <Text style={styles.title}>Chuyển quyền Admin</Text>
      </View>

      <FlatList
        data={members}
        keyExtractor={(item) => item.userID}
        renderItem={renderItem}
        contentContainerStyle={members.length === 0 && styles.emptyContainer}
        ListEmptyComponent={
          <Text style={styles.empty}>Không có thành viên nào trong nhóm</Text>
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#121212", padding: 16 },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#333",
  },
  backBtn: {
    padding: 6,
    marginRight: 14,
  },
  title: {
    fontSize: 22,
    fontWeight: "700",
    color: "#eee",
    flex: 1,
  },
  friendRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    paddingHorizontal: 12,
    marginBottom: 10,
    borderRadius: 14,
    backgroundColor: "#1e1e1e",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 3,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  selectedRow: {
    backgroundColor: "#0a8bcc",
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
    borderWidth: 2,
    borderColor: "#00caff",
  },
  info: {
    flex: 1,
    marginLeft: 14,
  },
  friendName: {
    fontSize: 19,
    fontWeight: "700",
    color: "#eee",
  },
  currentAdminText: {
    fontWeight: "600",
    fontSize: 14,
    color: "#f5a623",
  },
  assignButton: {
    backgroundColor: "#fff",
    paddingVertical: 7,
    paddingHorizontal: 18,
    borderRadius: 25,
  },
  assignButtonText: {
    color: "#0a8bcc",
    fontWeight: "700",
    fontSize: 15,
  },
  emptyContainer: {
    flexGrow: 1,
    justifyContent: "center",
  },
  empty: {
    color: "#888",
    fontSize: 18,
    textAlign: "center",
  },
});

export default TransferRoleScreen;
