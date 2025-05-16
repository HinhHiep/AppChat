import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

const IndividualScreen = () => {
  const navigation = useNavigation();
  const { user } = useSelector((state) => state.user);

  const menuItems = [
    { icon: 'cloud', label: 'zCloud', desc: 'Không gian lưu trữ dữ liệu trên đám mây' },
    { icon: 'cloud-outline', label: 'Cloud của tôi', desc: 'Lưu trữ các tin nhắn quan trọng' },
    { icon: 'timer-outline', label: 'Dữ liệu trên máy', desc: 'Quản lý dữ liệu Zalo của bạn' },
    { icon: 'shield-outline', label: 'Tài khoản và bảo mật' },
    { icon: 'lock-closed-outline', label: 'Quyền riêng tư' },
  ];

  return (
    <View style={styles.container}>
      {/* Thanh tìm kiếm */}
      <View style={styles.searchBar}>
        <Icon name="search" size={20} color="#00caff" />
        <Text style={styles.searchText}>Tìm kiếm</Text>
        <View style={styles.searchIcons}>
          <Icon name="qr-code-outline" size={22} color="#00caff" style={{ marginRight: 15 }} />
          <Icon name="add" size={22} color="#00caff" />
        </View>
      </View>

      {/* Thông tin cá nhân */}
      <TouchableOpacity style={styles.profileCard} onPress={() => navigation.navigate('ProfileScreen')}>
        <Image
          source={{
            uri: user?.anhDaiDien || 'https://res.cloudinary.com/dgqppqcbd/image/upload/v1741595806/anh-dai-dien-hai-2_isr0gd.jpg',
          }}
          style={styles.avatar}
        />
        <View style={styles.info}>
          <Text style={styles.name}>{user?.name || 'TuấnVươngg'}</Text>
        </View>
      </TouchableOpacity>

      {/* Danh sách menu */}
      <ScrollView style={{ flex: 1, width: '100%' }}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <Ionicons name={item.icon} size={22} color="#0af" style={styles.menuIcon} />
            <View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.desc && <Text style={styles.menuDesc}>{item.desc}</Text>}
            </View>
          </TouchableOpacity>
        ))}

        {/* Nút đăng xuất */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.logoutText}>Đăng xuất</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

export default IndividualScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
    paddingTop: 40,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#eee',
    backgroundColor: '#fff',
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
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#00caff",
    marginHorizontal: 16,
    marginTop: 10,
    marginBottom: 16,

    elevation: 2,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  info: {
    flex: 1,
  },
  name: {
    color: '#222',
    fontWeight: '600',
    fontSize: 16,
  },
  phone: {
    color: '#444',
    fontSize: 14,
  },
  link: {
    color: '#007aff',
    fontSize: 14,
    marginTop: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  menuIcon: {
    marginRight: 14,
    marginTop: 4,
  },
  menuLabel: {
    color: '#333',
    fontSize: 15,
    fontWeight: '500',
  },
  menuDesc: {
    color: '#666',
    fontSize: 13,
    marginTop: 4,
    maxWidth: '90%',
  },
  logoutButton: {
    marginTop: 10,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#ff3b30',
    alignItems: 'center',
    marginHorizontal: 16,
    marginBottom: 40,
  },
  logoutText: {
    color: '#fff',
    fontWeight: '600',
  },
});
