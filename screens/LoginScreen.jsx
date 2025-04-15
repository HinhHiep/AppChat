import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import LayoutDefault from "../components/layout/LayoutDefault";
import InputDefault from "../components/input/InputDefault";
import ButtonPrimary from "../components/button/ButtonPrimary";
import { useNavigation } from "@react-navigation/native";
import { useDispatch, useSelector } from "react-redux";
import { UserApi } from "@/api/UserApi";
import { loginUser } from "@/redux/slices/UserSlice";
import { isValidLogin } from "@/utilities/validateFunction";
import { isValidPhoneNumber,
  isValidPassword 
 } from "@/utilities/validate";

const LoginScreen = ({route}) => {
  const navigation = useNavigation();
  const [phoneNumber, setPhoneNumber] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const [enabled, setEnabled] = useState(false);
  const { user } = useSelector((state) => state.user);
  const [errorPhone, setErrorPhone] = useState("");

  const {phoneNumberParams} = route.params || {};
  console.log("phoneNumberParams", phoneNumberParams);

  const handleSignUp = () => {
    navigation.navigate("SignUp");
  };
  const handleLogin = (phoneNumber, password) => {
    if (!isValidLogin(phoneNumber, password)) {
      return;
    }
    dispatch(loginUser({ username: phoneNumber, password }))
      .unwrap()
      .then((user) => {
        console.log("Đăng nhập thành công:", user);
        navigation.navigate("Home")
      })
      .catch((error) => {
        console.error("Đăng nhập thất bại:", error);
        alert("Đăng nhập thất bại !");
      });
  };

  const handleForgotPass = () => {
    navigation.navigate("ForgotPass", {
      phoneNumber: phoneNumber,
    });
  }
  

    useEffect(() => {
      if (isValidPhoneNumber(phoneNumber) && password.length >= 8) {
        setEnabled(true);
      }
      else {
        setEnabled(false);
      }
      
      

  }, [phoneNumber, password])

  useEffect(() => {

    
    if ( phoneNumberParams && phoneNumberParams.length == 10) {
      setPhoneNumber(phoneNumberParams)
    }
}, [phoneNumberParams]);

  return (
    <LayoutDefault>
      <InputDefault
        placeholder="Số điện thoại"
        iconLeft="person"
        onChangeText={(text) => {
          setPhoneNumber(text);
          if(isValidPhoneNumber(text)) {
            setErrorPhone("");
          }
        }}
        value= {phoneNumberParams ? phoneNumberParams : phoneNumber}
        keyboardTypeNumeric
        autoCapitalize="none"
        onBlur={() => {
          if (!isValidPhoneNumber(phoneNumber)) {
            setErrorPhone("Số điện thoại không hợp lệ!");
          } else {
            setErrorPhone("");
          }
        }}
        maxLength={10}
      />
      {errorPhone ? (
        <Text style={{ color: "red", fontSize: 14 }}>(*){errorPhone}</Text>
      ) : null}

      <InputDefault
        placeholder="Mật khẩu"
        iconLeft="lock-closed"
        iconRight={true}
        onChangeText={(text) => {
          setPassword(text)
         
        }}
        value={password}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
      />
      <TouchableOpacity onPress={() => handleForgotPass()}>
        <Text style={styles.text}>Quên mật khẩu ?</Text>
      </TouchableOpacity>

      <ButtonPrimary
          title="Đăng nhập"
          onPress={() => handleLogin(phoneNumber, password)}
          enabled={enabled}
        />
     

      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={styles.textBody}>Bạn chưa có tài khoản ? </Text>
        <TouchableOpacity onPress={() => handleSignUp()}>
          <Text style={styles.text}>Tạo tài khoản mới</Text>
        </TouchableOpacity>
      </View>
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
})
