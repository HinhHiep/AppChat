import { navigate } from 'expo-router/build/global-state/routing';
import React,{useEffect,useState} from 'react';
import { View, Text, ImageBackground, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons'; 
import { useSelector } from 'react-redux';
import UpdateProfileForm from '@/components/updateprofile/UpdateProfileForm';
import { useNavigation } from '@react-navigation/native'
const ProfileScreen = () => {
    const [showForm, setShowForm] = useState(false);
     const navigation = useNavigation();
    const { user } = useSelector((state) => state.user);
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: user?.anhBia|| 'https://your-image-link.com/bg.jpg' }} // thay ảnh nền Bitexco ở đây
        style={styles.headerImage}
      >
         <View style={styles.topBar}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
                <Icon name="arrow-back" size={24} color="#fff" />
            </TouchableOpacity>
          
        </View>
        <View style={styles.avatarContainer}>
          <Image
            source={{ uri:user?.anhDaiDien ||'https://your-avatar-link.com/avatar.png' }} // ảnh avatar nhân vật
            style={styles.avatar}
          />
        </View>
      </ImageBackground>
      <View style={styles.profileInfo}>
        <Text style={styles.username}>{user?.name ||"TuấnVươngg" }</Text> 
        < TouchableOpacity onPress={() => setShowForm(true)}>
        <Text style={styles.updateBio}>
            ✏️ Cập nhật giới thiệu bản thân  
        </Text>
        </TouchableOpacity>
      </View>

      {showForm && <UpdateProfileForm user={user} onClose={() => setShowForm(false)} />}
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  headerImage: { height: 250, justifyContent: 'flex-end' },
  topBar: {
    position: 'absolute',
    top: 10,
    left: 15,
    right: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  time: { color: '#fff', fontSize: 16 },
  topIcons: { flexDirection: 'row' },
  icon: { marginLeft: 8 },
  avatarContainer: { alignItems: 'center', marginBottom: -40 },
  avatar: { width: 100, height: 100, borderRadius: 50, borderWidth: 3, borderColor: '#000' },
  profileInfo: { alignItems: 'center', marginTop: 50 },
  username: { color: '#000', fontSize: 22, fontWeight: 'bold' },
  updateBio: { color: '#4285F4', marginTop: 5 },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginVertical: 20,
    paddingHorizontal: 10,
  },
  button: { alignItems: 'center' },
  buttonText: { color: '#fff', marginTop: 5 },
  logPrompt: { alignItems: 'center', marginTop: 20, padding: 20 },
  logTitle: { color: '#fff', fontSize: 18, fontWeight: 'bold', marginTop: 10, textAlign: 'center' },
  logText: { color: '#ccc', textAlign: 'center', marginTop: 10 },
  logButton: {
    backgroundColor: '#4285F4',
    marginTop: 15,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  logButtonText: { color: '#fff', fontWeight: 'bold' },
});

export default ProfileScreen;
