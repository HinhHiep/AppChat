import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as ImagePicker from 'expo-image-picker';
import Icon from 'react-native-vector-icons/Ionicons';

const GroupOptionsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { chatID, currentName, currentImage } = route.params;

  const [groupName, setGroupName] = useState(currentName || '');
  const [groupImage, setGroupImage] = useState(currentImage || null);

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled) {
      setGroupImage(result.assets[0].uri);
      // TODO: Gửi ảnh lên server hoặc Firebase
    }
  };

  const handleSaveName = () => {
    Alert.alert('Lưu tên nhóm', `Tên mới: ${groupName}`);
    // TODO: Gọi API đổi tên nhóm
  };

  return (
    <View style={styles.container}>
      {/* Nút back */}
      <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
        <Icon name="arrow-back" size={24} color="#fff" />
      </TouchableOpacity>

      <Text style={styles.title}>Tùy chọn nhóm</Text>

      {/* Ảnh nhóm */}
      <TouchableOpacity onPress={pickImage} style={styles.imageContainer}>
        {groupImage ? (
          <Image source={{ uri: groupImage }} style={styles.image} />
        ) : (
          <View style={styles.placeholder}>
            <Text style={{ color: '#888' }}>Chọn ảnh nhóm</Text>
          </View>
        )}
      </TouchableOpacity>

      {/* Tên nhóm */}
      <TextInput
        style={styles.input}
        value={groupName}
        onChangeText={setGroupName}
        placeholder="Nhập tên nhóm"
        placeholderTextColor="#888"
      />

      <TouchableOpacity style={styles.saveButton} onPress={handleSaveName}>
        <Text style={styles.saveText}>💾 Lưu tên nhóm</Text>
      </TouchableOpacity>

      {/* Các tuỳ chọn khác */}
      <TouchableOpacity style={styles.option} onPress={() => Alert.alert('Xem thành viên')}>
        <Text style={styles.optionText}>👥 Xem thành viên</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.option} onPress={() => Alert.alert('Rời nhóm')}>
        <Text style={styles.optionText}>🚪 Rời nhóm</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.option, { backgroundColor: '#ff4444' }]}
        onPress={() => Alert.alert('Giải tán nhóm')}
      >
        <Text style={[styles.optionText, { color: '#fff' }]}>❌ Giải tán nhóm</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#000' },
  backButton: { marginBottom: 10 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#fff', marginBottom: 20 },
  imageContainer: { alignSelf: 'center', marginBottom: 20 },
  image: { width: 100, height: 100, borderRadius: 50 },
  placeholder: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#222',
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    backgroundColor: '#1a1a1a',
    color: '#fff',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  saveButton: {
    backgroundColor: '#00caff',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 20,
  },
  saveText: { color: '#000', fontWeight: 'bold' },
  option: {
    padding: 15,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginBottom: 10,
  },
  optionText: { color: '#fff', fontSize: 16 },
});

export default GroupOptionsScreen;
