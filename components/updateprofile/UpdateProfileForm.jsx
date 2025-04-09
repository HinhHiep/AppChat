import React, { useState,useEffect } from 'react';
import {
  View,
  Text,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image
} from 'react-native';
import { useSelector } from 'react-redux';
import InputDate from '@/components/input/InputDate';
import InputDefault from '@/components/input/InputDefault';
import InputPhone from '@/components/input/InputPhone';
import ButtonPrimary from '@/components/button/ButtonPrimary';
import * as ImagePicker from 'expo-image-picker';;


const UpdateProfileForm = () => {
  const { user } = useSelector((state) => state.user);

  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.sdt || '');
  const [password, setPassword] = useState('');
  const [anhDaiDien, setAnhDaiDien] = useState(user.anhDaiDien || '');
  const [anhBia, setAnhBia] = useState(user.anhBia || '');
  const [ngaySinh, setNgaySinh] = useState(user.ngaysinh || '');
  const [gioiTinh, setGioiTinh] = useState(user.gioiTinh || 'Nam');
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      console.log('Media library permission:', status);
      if (status !== 'granted') {
        alert('App cần quyền truy cập ảnh để cập nhật avatar.');
      }
    })();
  }, []);
  
  const handleSelectAvatar = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes:  ImagePicker.MediaTypeOptions.Images, // ✅ sửa đúng enum
      quality: 0.7,
      allowsEditing: true,
      aspect: [1, 1],
    });
  
    if (!result.canceled) {
      console.log(result.assets[0].uri); // ✅ cập nhật avatar
    }
  };

  const handleUpdate = () => {
    // Thay bằng logic gọi API hoặc lưu dữ liệu
    console.log('Cập nhật thông tin:', {
      name,
      email,
      phone,
      password,
      ngaySinh,
      gioiTinh,
      anhDaiDien,
      anhBia,
    });

    Alert.alert('Thành công', 'Thông tin đã được cập nhật!');
  };

  return (
   <View style={styles.container}>
   
      <Text style={styles.title}>Cập nhật thông tin cá nhân</Text>
<ScrollView style={styles.container1}>
      <InputDefault
        placeholder="Tên"
        value={name}
        onChangeText={setName}
        style={styles.input}
      />
       <InputPhone
        placeholder="Số điện thoại"
        value={phone}
        onChangeText={setPhone}
        style={styles.input}
      />
      <InputDate
        placeholder="Ngày sinh theo định dạng dd/mm/yyyy"
        iconLeft="calendar"
        value={ngaySinh}
        onChangeText={setNgaySinh}
        style={styles.input}
      />

      <View style={styles.genderContainer}>
        <Text style={styles.label}>Giới tính</Text>
        <View style={styles.genderOptions}>
          <Pressable
            style={[
              styles.genderButton,
              gioiTinh === 'Nam' && styles.selectedGender,
            ]}
            onPress={() => setGioiTinh('Nam')}
          >
            <Text style={styles.genderText}>Nam</Text>
          </Pressable>
          <Pressable
            style={[
              styles.genderButton,
              gioiTinh === 'Nữ' && styles.selectedGender,
            ]}
            onPress={() => setGioiTinh('Nữ')}
          >
            <Text style={styles.genderText}>Nữ</Text>
          </Pressable>
        </View>
      </View>

            <TouchableOpacity onPress={handleSelectAvatar} style={styles.avatarContainer}>
        {anhDaiDien ? (
            <Image source={{ uri: anhDaiDien }} style={styles.avatar} />
        ) : (
            <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>Chọn ảnh đại diện</Text>
            </View>
        )}
        </TouchableOpacity>

        <InputDefault
        placeholder="Mật khẩu"
        iconLeft="lock-closed"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        />

      <ButtonPrimary
        title="Cập nhật"
        onPress={handleUpdate}
        style={styles.button}
        textStyle={styles.buttonText}
      />
      </ScrollView>
      </View>
  );
};
const styles = StyleSheet.create({
    container1:{
        flex: 1,
    },
    container: {
      padding: 20,
      backgroundColor: '#000', // nền đen giống app Zalo
      flex: 1,
    },
    title: {
      fontSize: 20,
      fontWeight: 'bold',
      color: '#fff',
      marginBottom: 20,
      textAlign: 'center',
    },
    input: {
      backgroundColor: '#1c1c1e',
      color: '#fff',
      borderRadius: 10,
      padding: 12,
      marginBottom: 15,
      borderWidth: 1,
      borderColor: '#333',
    },
    button: {
      backgroundColor: '#4285F4',
      padding: 14,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    genderContainer: {
      marginVertical: 10,
    },
    label: {
      fontSize: 16,
      fontWeight: '500',
      marginBottom: 5,
    },
    genderOptions: {
      flexDirection: 'row',
      gap: 10,
    },
    genderButton: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 8,
      paddingVertical: 8,
      paddingHorizontal: 16,
    },
    selectedGender: {
      backgroundColor: '#007AFF',
      borderColor: '#007AFF',
    },
    genderText: {
      color: 'white',
    },
    button: {
      backgroundColor: '#4285F4',
      padding: 14,
      borderRadius: 10,
      alignItems: 'center',
    },
    buttonText: {
      color: '#fff',
      fontWeight: 'bold',
    },
    avatarContainer: {
        alignItems: 'center',
        marginBottom: 20,
      },
      avatar: {
        width: 100,
        height: 100,
        borderRadius: 50,
        borderWidth: 2,
        borderColor: '#fff',
      },
      avatarPlaceholder: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#555',
        justifyContent: 'center',
        alignItems: 'center',
      },
      avatarText: {
        color: 'white',
        fontSize: 12,
        textAlign: 'center',
      },
      
  
  });
  
  export default UpdateProfileForm;