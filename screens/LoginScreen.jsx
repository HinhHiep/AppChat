import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import LayoutDefault from "../components/layout/LayoutDefault";
import InputDefault from "../components/input/InputDefault";
import ButtonPrimary from "../components/button/ButtonPrimary";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const navigation = useNavigation();

  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };
  const handleLogin = () => {
    navigation.navigate("Home");
  };
  const handleForgotPass = () => {
    navigation.navigate("ForgotPass");
  }
  return (
    <LayoutDefault>
      <InputDefault placeholder="Số điện thoại" iconLeft="person" />
      <InputDefault
        placeholder="Mật khẩu"
        iconLeft="lock-closed"
        iconRight={true}
      />
      <TouchableOpacity onPress={() => handleForgotPass()}>
        <Text style={styles.text}>Quên mật khẩu ?</Text>
      </TouchableOpacity>
      <ButtonPrimary title="Đăng nhập" onPress={() => handleLogin()} />
      <Text style={styles.textBody}>
        Bạn chưa có tài khoản ?{" "}
        <TouchableOpacity onPress={() =>handleSignUp()}>
        <Text style={styles.text}>Tạo tài khoản mới</Text>
        </TouchableOpacity>
       
      </Text>
    </LayoutDefault>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  text: {
    color: "#03C7F7",
    textAlign: "right",
    marginVertical: 10,
    textDecorationLine: "underline",
    fontSize: 16,
  },
  textBody: {
    textAlign: "center",
    marginVertical: 10,
    fontSize: 16,
  },
});
