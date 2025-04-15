import { StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import LayoutDefault from "@/components/layout/LayoutDefault";
import InputDefault from "@/components/input/InputDefault";
import ButtonPrimary from "@/components/button/ButtonPrimary";
import { CommonActions, useNavigation } from "@react-navigation/native";
import { useDispatch } from "react-redux";
import { changePass } from "@/api/UserApi";
import { useRoute } from "@react-navigation/native";
import { isValidPassword, isValidRePassword } from "@/utilities/validate";
import { isValidResetPass } from "@/utilities/validateFunction";

const ResetPassScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { sdt } = route.params;

 
  //const route = navigation.getState().routes
  //const phoneNumber = route[route.length - 1].params.phoneNumber;
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const [enabled, setEnabled] = useState(false);
  const dispatch = useDispatch();
  const [errPass, setErrPass] = useState("");
  const [errRePass, setErrRePass] = useState("");

  const handleResetPass = async ({ password }) => {
    console.log(password);
    console.log(sdt);
    const matKhau = password;
    const req = await changePass(sdt, matKhau)
    console.log(req);
    if (req.success) {
      navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: 'Login',
            params: {phoneNumberParams: sdt},
           }],
        })
      );
     
      } else {
        alert(req.message || "Đổi mật khẩu không thành công!");
      }
  };


  useEffect(() => {
    if(isValidResetPass(password, rePassword)) {
      setEnabled(true);
    }
    else {
      setEnabled(false);
    }
  }, [password, rePassword]);
  return (
    <LayoutDefault>
      <Text style={{ fontSize: 14, color: "gray", marginTop: 10 }}>
        Mật khẩu phải có ít nhất 8 ký tự, bao gồm chữ và số
      </Text>
      <InputDefault
        placeholder="Mật khẩu mới"
        iconLeft="lock-closed"
        iconRight={true}
        onChangeText={(text) => {
          setPassword(text);
          if (isValidPassword(text)) {
            setErrPass("");
          }
        }}
        value={password}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
        onBlur={() => {
          if (!isValidPassword(password)) {
            setErrPass("Mật khẩu không hợp lệ");
          } else {
            setErrPass("");
          }
        }}
      />
      {errPass ? (
        <Text style={{ color: "red", fontSize: 14 }}>(*){errPass}</Text>
      ) : null}
      <InputDefault
        placeholder="Nhập lại mật khẩu"
        iconLeft="lock-closed"
        iconRight={true}
        onChangeText={(text, password) => {
          setRePassword(text);
          if (isValidRePassword(text, password)) {
            setErrRePass("");
          }
        }}
        value={rePassword}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
        onBlur={() => {
          if (!isValidRePassword(password, rePassword)) {
            setErrRePass("Mật khẩu không khớp");
          } else {
            setErrRePass("");
          }
        }}
      />
      {errRePass ? (
        <Text style={{ color: "red", fontSize: 14 }}>(*){errRePass}</Text>
      ) : null}

      <ButtonPrimary
        title="Đổi mật khẩu"
        onPress={() => handleResetPass({ password})}
        enabled={enabled}
      />
    </LayoutDefault>
  );
};

export default ResetPassScreen;

const styles = StyleSheet.create({});
