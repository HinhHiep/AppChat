import {ScrollView, StyleSheet, Text, View,Pressable } from "react-native";
import React, { useState ,useEffect} from "react";
import LayoutDefault from "@/components/layout/LayoutDefault";
import InputDefault from "@/components/input/InputDefault";
import InputPhone from "@/components/input/InputPhone";
import InputDate from "@/components/input/InputDate";
import ButtonPrimary from "@/components/button/ButtonPrimary";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/redux/slices/UserSlice";
import { register } from "@/api/UserApi";

const SignUpInfoScreen = ({route}) => {
  const {email,sdt} = route.params ;
   useEffect(() => {
       console.log('Email:', email);  // In ra email
       console.log('Data:',sdt);    // In ra data
     }, [email,sdt]);
  const navigation = useNavigation();
 // const route = navigation.getState().routes;
 // const phoneNumber = route[route.length - 1].params.phoneNumber;
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [gender, setGender] = useState('Nam'); // Mặc định là Nam
   const dispatch = useDispatch();
   const { userNew } = useSelector((state) => state.user || {});
   console.log('userNew', userNew);

  // console.log(phoneNumber);
  const handleSignUp = async () => {
    if (!name || !birth || !email || !password || !rePassword) {
      alert("Vui lòng nhập đầy đủ thông tin!");
      return;
    }
  
    if (password.length < 6) {
      alert("Mật khẩu không hợp lệ!");
      return;
    }
  
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      alert("Email không hợp lệ!");
      return;
    }
  
    if (password !== rePassword) {
      alert("Mật khẩu không khớp!");
      return;
    }
  
    try {
      const res = await register(sdt, name, birth, password, email,gender);
      if (res) {
        alert("Đăng ký tài khoản thành công!");
        navigation.navigate("Login", { email, sdt });
      } else {
        alert("Đăng ký tài khoản không thành công!");
      }
    } catch (err) {
      console.error("Lỗi đăng ký:", err);
      alert("Đã xảy ra lỗi khi đăng ký!");
    }
  };
  

  return (
    <LayoutDefault>
      <ScrollView>
      <InputDefault 
        placeholder="Tên hiển thị" 
        iconLeft="person" 
        onChangeText={(text) => setName(text)}
        value={name}
        underlineColorAndroid="transparent"
         autoCapitalize="none"
      />
      <InputDate 
        placeholder="Ngày sinh" 
        iconLeft="calendar" 
        onChangeText={(text) => setBirth(text)}
        value={birth}
        underlineColorAndroid="transparent"
         autoCapitalize="none"
      />
      <View style={styles.genderContainer}>
      <Text style={styles.label}>Giới tính</Text>
      <View style={styles.genderOptions}>
        <Pressable
          style={[styles.genderButton, gender === 'Nam' && styles.selectedGender]}
          onPress={() => setGender('Nam')}
        >
        <Text style={styles.genderText}>Nam</Text>
        </Pressable>
        <Pressable
          style={[styles.genderButton, gender === 'Nữ' && styles.selectedGender]}
          onPress={() => setGender('Nữ')}
        >
      <Text style={styles.genderText}>Nữ</Text>
       </Pressable>
      </View>
      </View>
      <InputDefault
        placeholder="Mật khẩu"
        iconLeft="lock-closed"
        iconRight={true}
        onChangeText={(text) => setPassword(text)}
        value={password}
        underlineColorAndroid="transparent"
         autoCapitalize="none"
      />
      <InputDefault
        placeholder="Nhập lại mật khẩu"
        iconLeft="lock-closed"
        iconRight={true}
        onChangeText={(text) => setRePassword(text)}
        value={rePassword}
        underlineColorAndroid="transparent"
         autoCapitalize="none"
      />
      <ButtonPrimary title="Tạo tài khoản" onPress={handleSignUp} />
      </ScrollView>
    </LayoutDefault>
  );
};

export default SignUpInfoScreen;

const styles = StyleSheet.create({
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
    color: '#000',
  },

});
