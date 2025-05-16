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
import Icon from 'react-native-vector-icons/Ionicons'; 
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as DocumentPicker from "expo-document-picker";
import { useNavigation } from '@react-navigation/native'

const UpdateProfileForm = ({user,onClose}) => {
const navigation = useNavigation();
  const [name, setName] = useState(user.name || '');
  const [email, setEmail] = useState(user.email || '');
  const [phone, setPhone] = useState(user.sdt || '');
  const [password, setPassword] = useState('');
  const [anhDaiDien, setAnhDaiDien] = useState(user.anhDaiDien || '');
  const [anhBia, setAnhBia] = useState(user.anhBia || '');
  const [ngaySinh, setNgaySinh] = useState(user.ngaysinh || '');
  const [gioiTinh, setGioiTinh] = useState(user.gioiTinh || 'Nam');
  const [fileanhDaiDien, setFileanhDaiDien] = useState(null);
  const [fileanhBia, setFileanhBia] = useState(null);
  const [selectedImages, setSelectedImages] = useState([]);
//   useEffect(() => {
//     (async () => {
//       const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
//       console.log('Media library permission:', status);
//       if (status !== 'granted') {
//         alert('App cần quyền truy cập ảnh để cập nhật avatar.');
//       }
//     })();
//   }, []);
  
//   const handleSelectAvatar = async () => {
//     let result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes:  ImagePicker.MediaTypeOptions.Images, // ✅ sửa đúng enum
//       quality: 0.7,
//       allowsEditing: true,
//       aspect: [1, 1],
//     });
  
//     if (!result.canceled) {
//       console.log(result.assets[0]); // ✅ kiểm tra đường dẫn ảnh
//       //const file = result.assets[0].uri;
//         // Kiểm tra định dạng file
//         // const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'];
//         // file.forEach(element => {
//         // const fileType = result.assets[0].mimeType;// Lấy phần mở rộng
//         // if (!allowedTypes.includes(fileType)) {
//         //     alert('Chỉ cho phép ảnh định dạng PNG, JPEG, JPG hoặc WEBP');
//         //     return;
//         // }
//         // });
//         // setFileanhDaiDien(result.assets[0].uri); // ✅ lưu vào state
//     }
//   };

const handleSelectMultipleImages = async () => {
    try {
        const result = await DocumentPicker.getDocumentsAsync({
        type: "image/*",
        multiple: false, // 🔥 chọn nhiều ảnh
        copyToCacheDirectory: true,
      });
  
      if (!result.canceled && result.assets.length > 0) {
        console.log("Đã chọn ảnh:", result.assets);
    //     setSelectedImages(prev => [...prev, ...result.assets]); // Thêm vào mảng
    //   console.log("Mảng ảnh đã chọn:", [...selectedImages, ...result.assets]);
    //   console.log("Mảng ảnh đã chọn:", selectedImages[0].mimeType);
      
        
      }
    } catch (error) {
      console.log("Lỗi khi chọn ảnh:", error);
    }
  };

  const updateavatar = async () => {
    if (!fileanhDaiDien) {
      console.log('❗ Chưa chọn ảnh đại diện!');
      return null;
    }
  
    try {
      
      const formData = new FormData();
     fileanhDaiDien.array.forEach(element => {
        const fileType = element.split('.').pop(); // Lấy phần mở rộng
      formData.append('image', {
        uri: element,
        type: `image/${fileType}`,
        name: `avatar.${fileType}`,
      });
     });
      
  
      console.log('📤 Form data:', formData);
  
      const response = await fetch("http://192.168.1.25:5000/api/upload", {
        method: "POST",
        headers: {
          "Content-Type": "multipart/form-data",
        },
        body: formData,
      });
  
      if (!response.ok) {
        const errText = await response.text(); // log chi tiết lỗi nếu cần
        console.error("❌ Upload ảnh thất bại:", errText);
        throw new Error("Upload ảnh thất bại");
      }
  
      const data = await response.json();
      console.log("✅ Upload thành công:", data.url);
      return data.url;
  
    } catch (error) {
      console.error("⚠️ Lỗi khi upload:", error);
      return null;
    }
  }; 


  const handleUpdate = () => {
    // Thay bằng logic gọi API hoặc lưu dữ liệu
      updateanhbia();
  };

    const updateanhbia = async () => {
        const url = await updateavatar(); // Gọi hàm upload ảnh đại diện
        console.log('URL ảnh đại diện:', url); // ✅ kiểm tra URL ảnh đại diện
    };
  return (
   <View style={styles.container}>
   <View style={styles.topBar}>
               <TouchableOpacity onPress={onClose}>
                   <Icon name="close" size={24} color="#fff" />
               </TouchableOpacity>
             
           </View>
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

      <TouchableOpacity onPress={handleSelectMultipleImages} style={styles.button}>
        <Text style={styles.buttonText}>
            {anhDaiDien ? "Thay ảnh đại diện" : "Chọn ảnh đại diện"}
        </Text>
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
        onPress={onClose}
        style={styles.button}
        textStyle={styles.buttonText}
      />
      </ScrollView>
      </View>
  );
};
const styles = StyleSheet.create({topBar: {
  position: 'absolute',
  top: 10,
  left: 15,
  right: 15,
  flexDirection: 'row',
  justifyContent: 'space-between',
},
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