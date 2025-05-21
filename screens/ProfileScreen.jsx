import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  Modal,
  ImageBackground,
  Alert,
} from 'react-native';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import UpdateProfileForm from '../screens/UpdateProfileForm';
//import * as ImageManipulator from 'expo-image-manipulator';
import { useDispatch } from "react-redux";
import { setUser } from "@/redux/slices/UserSlice";
import { io } from 'socket.io-client';

//const socket = io('http://192.168.1.33:5000');
const socket = io('https://cnm-service.onrender.com'); // Kết nối với server socket

const ProfileScreen = () => {
  const { user } = useSelector((state) => state.user);
  const [modalVisible, setModalVisible] = useState(false);
  const dispatch = useDispatch();
  const navigation = useNavigation();
  const [profile, setProfile] = useState(user);
  const [avatarUri, setAvatarUri] = useState(profile?.anhDaiDien || null);
  const [coverUri, setCoverUri] = useState(profile?.anhBia || null);
 useEffect(() => {
  if (!profile) return;
  socket.emit("join_user", profile.userID);
  socket.on("update_user", (data) => {
    dispatch(setUser(data));
    setProfile(data);
    setAvatarUri(data?.anhDaiDien || null);
    setCoverUri(data?.anhBia || null);
  });
  return () => {
    socket.off("update_user");
  }
 }, [profile?.userID, dispatch]);


  // Format ngày sinh
  const formatDOB = (dob) => {
    if (dob) {
      const date = new Date(dob);
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    }
    return 'Chưa có';
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity
        style={styles.backBtn}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backText}>← Quay lại</Text>
      </TouchableOpacity>

      {/* Ảnh bìa bấm chọn ảnh */}
      <TouchableOpacity >
        <ImageBackground
          source={{
            uri:
              coverUri ||
              'https://res.cloudinary.com/dgqppqcbd/image/upload/v1741595806/anh-bia-default.jpg',
          }}
          style={styles.cover}
        >
          {/* Không cần gì ở đây, ảnh bìa đã là nút chọn ảnh */}
        </ImageBackground>
      </TouchableOpacity>

      {/* Ảnh đại diện bấm chọn ảnh */}
      <View style={styles.avatarWrapper}>
        <TouchableOpacity >
          <Image
            source={{
              uri:
                avatarUri ||
                'https://res.cloudinary.com/dgqppqcbd/image/upload/v1741595806/avatar-default.jpg',
            }}
            style={styles.avatar}
          />
        </TouchableOpacity>
        {/* <Text style={styles.changeAvatarText}>Bấm ảnh để thay đổi</Text> */}
      </View>

      <View style={styles.profileInfo}>
        <Text style={styles.name}>{profile?.name || 'Tên người dùng'}</Text>

        <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
        <Text style={styles.infoText}>📧 Email: {profile?.email || 'Chưa có'}</Text>
        <Text style={styles.infoText}>🎂 Ngày sinh: {formatDOB(profile?.ngaysinh)}</Text>
        <Text style={styles.infoText}>🚻 Giới tính: {profile?.gioTinh || 'Không rõ'}</Text>
        <Text style={styles.infoText}>📞 SĐT: {profile?.sdt || 'Chưa có'}</Text>
      </View>

      <TouchableOpacity style={styles.editBtn} onPress={() => setModalVisible(true)}>
        <Text style={styles.editText}>✏️ Cập nhật</Text>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <UpdateProfileForm
          user={profile}
          onClose={() => setModalVisible(false)}
        />
      </Modal>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  cover: {
    height: 200,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#ddd',
  },
  avatarWrapper: {
    marginTop: -40,
    alignItems: 'center',
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#fff',
  },
  changeAvatarText: {
    marginTop: 5,
    fontSize: 12,
    color: '#007aff',
  },
  profileInfo: {
    marginTop: 30,
    paddingHorizontal: 20,
  },
  name: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 10,
  },
  infoText: {
    fontSize: 16,
    color: '#444',
    marginBottom: 6,
  },
  editBtn: {
    alignSelf: 'center',
    backgroundColor: '#007aff',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginVertical: 20,
  },
  editText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  backBtn: {
    position: 'absolute',
    top: 10,
    left: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#4285F4',
    borderRadius: 8,
    zIndex: 10,
  },
  backText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 15,
  },
});
