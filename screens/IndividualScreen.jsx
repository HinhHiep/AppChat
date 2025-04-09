import React from 'react';
import { View, Text, StyleSheet,ScrollView ,TouchableOpacity,Image} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';
import { useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native'
const IndividualScreen = () => {
    const navigation = useNavigation();
    const { user } = useSelector((state) => state.user);
    const menuItems = [
        { icon: 'cloud', label: 'zCloud', desc: 'Không gian lưu trữ dữ liệu trên đám mây' },
        { icon: 'magic', label: 'zStyle Nổi bật trên Zalo', desc: 'Hình nền và nhạc cho cuộc gọi Zalo' },
        { icon: 'cloud-outline', label: 'Cloud của tôi', desc: 'Lưu trữ các tin nhắn quan trọng' },
        { icon: 'timer-outline', label: 'Dữ liệu trên máy', desc: 'Quản lý dữ liệu Zalo của bạn' },
        { icon: 'qr-code', label: 'Ví QR', desc: 'Lưu trữ và xuất trình các mã QR quan trọng' },
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
        <TouchableOpacity style={styles.profileCard} onPress={() => navigation.navigate('ProfileScreen')}>
                <Image 
                    source={{ uri: user?.anhDaiDien || 'https://res.cloudinary.com/dgqppqcbd/image/upload/v1741595806/anh-dai-dien-hai-2_isr0gd.jpg' }} 
                    style={{ width: 48, height: 48, borderRadius: 24,borderRadius: 24,marginRight: 12, }} 
                />
                <View style={styles.info}>
                <Text style={styles.name}>{user?.name || 'TuấnVươngg'}</Text>
                <Text style={styles.link}>Xem trang cá nhân</Text>
                </View>
                <Ionicons name="people" size={18} color="#0af" />
        </TouchableOpacity>

      <ScrollView style={{ flex: 1 }}>
        {menuItems.map((item, index) => (
          <TouchableOpacity key={index} style={styles.menuItem}>
            <Ionicons name={item.icon} size={22} color="#0af" style={styles.menuIcon} />
            <View>
              <Text style={styles.menuLabel}>{item.label}</Text>
              {item.desc && <Text style={styles.menuDesc}>{item.desc}</Text>}
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default IndividualScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
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
  top: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    color: '#fff',
    fontSize: 20,
  },
  profileCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'gray',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  info: {
    flex: 1,
  },
  name: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    color: '#999',
    fontSize: 14,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  menuIcon: {
    marginRight: 14,
    marginTop: 4,
  },
  menuLabel: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '500',
  },
  menuDesc: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 4,
    maxWidth: '90%',
  },
});
