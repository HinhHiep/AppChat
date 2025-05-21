import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ScrollView,
  Image,
  ImageBackground,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { setUser, updateUser } from "@/redux/slices/UserSlice";
import { useDispatch, useSelector } from "react-redux";
import { io } from 'socket.io-client';

//const socket = io('http://192.168.1.110:5000');
const socket = io('https://cnm-service.onrender.com'); // Kết nối với server socket

// Hàm validate tên (cho phép tên có dấu, ít nhất 2 từ)
const validateName = (name) => {
  const words = name.trim().split(/\s+/);
  if (words.length < 2) return false;
  for (let w of words) {
    if (
      !/^[A-Za-zÀÁÂÃÈÉÊÌÍÒÓÔÕÙÚĂĐĨŨƠƯàáâãèéêìíòóôõùúăđĩũơưạảấầẩẫậắằẳẵặẹẻẽềếểễệỉịọỏốồổỗộớờởỡợụủứừửữựỳỵỷỹ]/.test(
        w
      )
    ) {
      return false;
    }
  }
  return true;
};

const isValidEmail = (email) => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(email);
};

const isValidPhoneNumber = (phoneNumber) => {
  const phoneRegex = /^(0[3,5,7,8,9])[0-9]{8}$/;
  return phoneRegex.test(phoneNumber);
};

const isValidDOB = (dob) => {
  const dobParts = dob.split('-');
  if (dobParts.length === 3) {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    return age >= 18;
  }
  return false;
};

const UpdateProfileForm = ({ user, onClose = () => {} }) => {
  const [profile, setProfile] = useState({
    name: user.name || '',
    email: user.email || '',
    phone: user.sdt || '',
    dobDay: user.dobDay || '',
    dobMonth: user.dobMonth || '',
    dobYear: user.dobYear || '',
    gender: user.gioTinh || 'Nam',
    avatar: user.anhDaiDien || null,
    cover: user.anhBia || null,
  });
  const [fileavatar, setFileAvatar] = useState(null);
  const [filecover, setFileCover] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user.ngaysinh) {
      const date = new Date(user.ngaysinh);
      if (!isNaN(date.getTime())) {
        setProfile((prev) => ({
          ...prev,
          dobYear: date.getFullYear().toString(),
          dobMonth: (date.getMonth() + 1).toString(),
          dobDay: date.getDate().toString(),
        }));
      }
    }
    if (user.anhDaiDien) {
      setProfile((prev) => ({ ...prev, avatar: user.anhDaiDien }));
    }
    if (user.anhBia) {
      setProfile((prev) => ({ ...prev, cover: user.anhBia }));
    }
  }, [user]);

  const handleInputChange = (field, value) => {
    setProfile((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  // Hàm chọn ảnh (avatar hoặc cover)
  const pickImage = async (type) => {
    try {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Lỗi', 'Bạn cần cấp quyền truy cập ảnh.');
        return;
      }
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
        allowsEditing: true,
        aspect: type === 'avatar' ? [1, 1] : [16, 9],
      });

      if (!result.canceled) {
        const uri = result.assets[0].uri;
        if (type === 'avatar') {
          handleInputChange('avatar', uri);
          setFileAvatar(result.assets[0]);
          console.log('avatar', result.assets[0]);
        } else {
          handleInputChange('cover', uri);
          setFileCover(result.assets[0]);
          console.log('cover', result.assets[0]);
        }
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Không thể mở thư viện ảnh.');
    }
  };
   const uploadImage = async (file) => {
  const imageForm = new FormData();
  imageForm.append("files", {
    uri: file.uri,
    type: file.mimeType || "image/jpeg",
    name: file.fileName || "photo.jpg",
  });

  const res = await fetch("https://cnm-service.onrender.com/api/upload", {
    method: "POST",
    body: imageForm,
    // ❌ Không đặt Content-Type ở đây
  });

  const data = await res.json();
  return data?.urls?.[0] || "";
};


  const handleSave = async () => {
    const dayNum = parseInt(profile.dobDay, 10);
    const monthNum = parseInt(profile.dobMonth, 10);
    const yearNum = parseInt(profile.dobYear, 10);
    const currentYear = new Date().getFullYear();

    if (
      !profile.name ||
      !profile.email ||
      !profile.phone ||
      isNaN(dayNum) ||
      isNaN(monthNum) ||
      isNaN(yearNum)
    ) {
      Alert.alert('Lỗi', 'Vui lòng điền đầy đủ và hợp lệ thông tin.');
      return;
    }

    if (!validateName(profile.name)) {
      Alert.alert(
        'Lỗi',
        'Tên phải có ít nhất 2 từ và mỗi từ bắt đầu bằng chữ cái.'
      );
      return;
    }

    if (!isValidEmail(profile.email)) {
      Alert.alert('Lỗi', 'Email không hợp lệ.');
      return;
    }

    if (!isValidPhoneNumber(profile.phone)) {
      Alert.alert('Lỗi', 'Số điện thoại không hợp lệ.');
      return;
    }

    if (dayNum < 1 || dayNum > 31) {
      Alert.alert('Lỗi', 'Ngày phải từ 1 đến 31.');
      return;
    }

    if (monthNum < 1 || monthNum > 12) {
      Alert.alert('Lỗi', 'Tháng phải từ 1 đến 12.');
      return;
    }

    if (yearNum < 1900 || yearNum > currentYear) {
      Alert.alert('Lỗi', `Năm phải từ 1900 đến ${currentYear}.`);
      return;
    }

    const dob = `${yearNum.toString().padStart(4, '0')}-${monthNum
      .toString()
      .padStart(2, '0')}-${dayNum.toString().padStart(2, '0')}`;

    if (!isValidDOB(dob)) {
      Alert.alert('Lỗi', 'Ngày sinh không hợp lệ hoặc bạn chưa đủ 18 tuổi.');
      return;
    }
    let avatar = user.anhDaiDien;
    let cover = user.anhBia;
    if (fileavatar) {
    avatar = await uploadImage(fileavatar);
    setProfile(prev => ({ ...prev, avatar: avatar }));
    console.log("avatar", avatar);

    }
    if (filecover) {
    cover = await uploadImage(filecover);
    setProfile(prev => ({ ...prev, avatar: cover}));
    console.log("cover", cover);
    }
    
    const updateData = {
      name: profile.name,
      email: profile.email,
      sdt: profile.phone,
      ngaysinh: dob,
      gioTinh: profile.gender,
      anhDaiDien: avatar,
      anhBia: cover,
      userID: user.userID
    };
    try {
      const response = await fetch(`https://cnm-service.onrender.com/api/users/${user.userID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      });

      const data = await response.json();

      if (data.error) {
        Alert.alert('Lỗi', data.error);
      } else {
        Alert.alert('Thông báo', 'Cập nhật thành công!');
        socket.emit("updateUser",data.user);
        dispatch(setUser(data.user));
        onClose();
      }
    } catch (error) {
      console.error('Lỗi khi gửi yêu cầu:', error);
      Alert.alert('Lỗi', 'Có lỗi xảy ra, vui lòng thử lại!');
    }    
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Chỉnh sửa thông tin</Text>

      {/* Ảnh bìa */}
      <Text style={styles.label}>Ảnh bìa:</Text>
      <TouchableOpacity onPress={() => pickImage('cover')}>
        <ImageBackground
          source={{
            uri:
              profile.cover ||
              'https://res.cloudinary.com/dgqppqcbd/image/upload/v1741595806/anh-bia-default.jpg',
          }}
          style={styles.cover}
        />
      </TouchableOpacity>

      {/* Ảnh đại diện */}
      <Text style={styles.label}>Ảnh đại diện:</Text>
      <TouchableOpacity
        onPress={() => pickImage('avatar')}
        style={styles.avatarWrapper}
      >
        <Image
          source={{
            uri:
              profile.avatar ||
              'https://res.cloudinary.com/dgqppqcbd/image/upload/v1741595806/avatar-default.jpg',
          }}
          style={styles.avatar}
        />
        <Text style={styles.changeAvatarText}>Bấm ảnh để thay đổi</Text>
      </TouchableOpacity>

      {/* Các trường nhập liệu */}
      <Text style={styles.label}>Tên:</Text>
      <TextInput
        style={styles.input}
        placeholder="Tên"
        value={profile.name}
        onChangeText={(text) => handleInputChange('name', text)}
      />

      <Text style={styles.label}>Email:</Text>
      <TextInput
        style={styles.input}
        placeholder="Email"
        value={profile.email}
        keyboardType="email-address"
        onChangeText={(text) => handleInputChange('email', text)}
      />

      <Text style={styles.label}>Số điện thoại:</Text>
      <TextInput
        style={styles.input}
        placeholder="Số điện thoại"
        value={profile.phone}
        keyboardType="phone-pad"
        onChangeText={(text) => handleInputChange('phone', text)}
      />

      <Text style={styles.label}>Ngày sinh:</Text>
      <View style={styles.dobContainer}>
        <TextInput
          style={styles.inputDob}
          placeholder="Ngày (1-31)"
          value={profile.dobDay}
          keyboardType="number-pad"
          maxLength={2}
          onChangeText={(text) => {
            const filtered = text.replace(/[^0-9]/g, '');
            handleInputChange('dobDay', filtered);
          }}
        />
        <TextInput
          style={styles.inputDob}
          placeholder="Tháng (1-12)"
          value={profile.dobMonth}
          keyboardType="number-pad"
          maxLength={2}
          onChangeText={(text) => {
            const filtered = text.replace(/[^0-9]/g, '');
            handleInputChange('dobMonth', filtered);
          }}
        />
        <TextInput
          style={styles.inputDobYear}
          placeholder={`Năm (1900-${new Date().getFullYear()})`}
          value={profile.dobYear}
          keyboardType="number-pad"
          maxLength={4}
          onChangeText={(text) => {
            const filtered = text.replace(/[^0-9]/g, '');
            handleInputChange('dobYear', filtered);
          }}
        />
      </View>

      <Text style={styles.label}>Giới tính:</Text>
      <View style={styles.genderContainer}>
        <TouchableOpacity onPress={() => handleInputChange('gender', 'Nam')}>
          <Text
            style={
              profile.gender === 'Nam' ? styles.activeGender : styles.gender
            }
          >
            Nam
          </Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => handleInputChange('gender', 'Nữ')}>
          <Text
            style={
              profile.gender === 'Nữ' ? styles.activeGender : styles.gender
            }
          >
            Nữ
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.buttonCancel} onPress={onClose}>
          <Text style={styles.buttonText}>Hủy</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.buttonSave} onPress={handleSave}>
          <Text style={styles.buttonText}>Lưu</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#fff',
    flexGrow: 1,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    marginTop: 12,
  },
  cover: {
    width: '100%',
    height: 150,
    borderRadius: 8,
    marginBottom: 10,
  },
  avatarWrapper: {
    alignItems: 'center',
    marginBottom: 15,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: '#ddd',
  },
  changeAvatarText: {
    marginTop: 5,
    fontSize: 12,
    color: '#007aff',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginBottom: 15,
  },
  dobContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  inputDob: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
    marginRight: 10,
  },
  inputDobYear: {
    flex: 1.5,
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 12,
    borderRadius: 8,
  },
  genderContainer: {
    flexDirection: 'row',
    marginBottom: 25,
  },
  gender: {
    padding: 10,
    marginRight: 15,
    backgroundColor: '#eee',
    borderRadius: 8,
    fontSize: 16,
  },
  activeGender: {
    padding: 10,
    marginRight: 15,
    backgroundColor: '#4285F4',
    color: '#fff',
    borderRadius: 8,
    fontSize: 16,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: 30,
  },
  buttonSave: {
    backgroundColor: '#007aff',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonCancel: {
    backgroundColor: '#E55050',
    paddingVertical: 12,
    paddingHorizontal: 40,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
  },
});

export default UpdateProfileForm;
