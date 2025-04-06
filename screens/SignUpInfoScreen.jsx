import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import LayoutDefault from "@/components/layout/LayoutDefault";
import InputDefault from "@/components/input/InputDefault";
import ButtonPrimary from "@/components/button/ButtonPrimary";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "@/redux/slices/UserSlice";

const SignUpInfoScreen = () => {
  const navigation = useNavigation();
  const route = navigation.getState().routes;
  const phoneNumber = route[route.length - 1].params.phoneNumber;
  const [name, setName] = useState("");
  const [birth, setBirth] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const dispatch = useDispatch();
  const { userNew } = useSelector((state) => state.user || {});
  console.log('userNew', userNew);

  // console.log(phoneNumber);
  const handleSignUp = ({ name, birth, email, password }) => {
    if (!name || !birth || !email || !password || !rePassword) {
      alert("Vui lòng nhập đầy đủ thông tin !");
      return;
    }
    if (phoneNumber.length < 10) {
      alert("Số điện thoại không hợp lệ !");
      return;
    }
    // regex phone number
    const regex = /^(0[3|5|7|8|9])+([0-9]{8})$/;
    if (!regex.test(phoneNumber)) {
      alert("Số điện thoại không hợp lệ !");
      return;
    }
    if (password.length < 6) {
      alert("Mật khẩu không hợp lệ !");
      return;
    }
    if (password !== rePassword) {
      alert("Mật khẩu không khớp !");
      return;
    }
    // regex email
    const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!regexEmail.test(email)) {
      alert("Email không hợp lệ !");
      return;
    }
    // regex date
    const regexDate = /^(0[1-9]|[12][0-9]|3[01])\/(0[1-9]|1[0-2])\/\d{4}$/;
    if (!regexDate.test(birth)) {
      alert("Ngày sinh không hợp lệ !");
      return;
    }
    if (password === rePassword) {
      dispatch(registerUser({ phoneNumber, name, birth, email, password }))
        .then(() => {
          navigation.navigate("Login", {
            phoneNumber: phoneNumber,
          });
        })
        .catch((error) => {
          console.error("Register failed:", error);
        });
    } else {
      alert("Mật khẩu không khớp !");
    }
  };

  return (
    <LayoutDefault>
      <InputDefault 
        placeholder="Tên hiển thị" 
        iconLeft="person" 
        onChangeText={(text) => setName(text)}
        value={name}
      />
      <InputDefault 
        placeholder="Ngày sinh" 
        iconLeft="calendar" 
        onChangeText={(text) => setBirth(text)}
        value={birth}
      />
      <InputDefault 
        placeholder="Email" 
        iconLeft="mail" 
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
      <InputDefault
        placeholder="Mật khẩu"
        iconLeft="lock-closed"
        iconRight={true}
        onChangeText={(text) => setPassword(text)}
        value={password}
      />
      <InputDefault
        placeholder="Nhập lại mật khẩu"
        iconLeft="lock-closed"
        iconRight={true}
        onChangeText={(text) => setRePassword(text)}
        value={rePassword}
      />
      <ButtonPrimary title="Tạo tài khoản" onPress={() => handleSignUp({name, birth, email, password})} />
    </LayoutDefault>
  );
};

export default SignUpInfoScreen;

const styles = StyleSheet.create({});
