import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { useSelector } from 'react-redux';
import ButtonPrimary from '@/components/button/ButtonPrimary';
import { useNavigation } from 'expo-router';


const HomeScreens = () => {
  const { user } = useSelector((state) => state.user);
    const navigation = useNavigation();
  
  // console.log('home',user)
  const logOutHandler = ()=>{
    navigation.navigate('Login')
  }
  return (
    <View style={{ padding: 20, gap: 16 }}>
      <Text style={{ fontSize: 20, fontWeight: '600', color: '#333' }}>
        👋 Chào mừng bạn!
      </Text>

      <View style={{ backgroundColor: '#f5f5f5', padding: 16, borderRadius: 12 }}>
        <Text style={styles.label}>👤 Tên: <Text style={styles.value}>{user.name}</Text></Text>
        <Text style={styles.label}>📞 Số điện thoại: <Text style={styles.value}>{user.sdt}</Text></Text>
        <Text style={styles.label}>⚧️ Giới tính: <Text style={styles.value}>{user.gioTinh}</Text></Text>
      </View>

      <ButtonPrimary title="🚪 Đăng xuất" onPress={logOutHandler} />
    </View>
  )
}

export default HomeScreens

const styles = StyleSheet.create({
  label: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#555',
  },
  value: {
    fontWeight: '400',
    color: '#222',
  },
})