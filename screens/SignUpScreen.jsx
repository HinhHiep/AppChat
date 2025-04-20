import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import LayoutDefault from "@/components/layout/LayoutDefault";
import InputDefault from "@/components/input/InputDefault";
import InputPhone from "@/components/input/InputPhone";
import ButtonPrimary from "@/components/button/ButtonPrimary";
import { useNavigation } from "@react-navigation/native";
import { getOTP, checkGmail, checkSDT } from "@/api/UserApi";

const SignUpScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [sdt, setSDT] = useState("");
  const [enabled, setEnabled] = useState(false);
  const handleLogin = () => {
    navigation.navigate("Login");
  };
  const handleSignUp = async () => {
    if (!email) {
      alert("Vui lòng nhập email !");
      return;
    }

    if (
      !(await checkGmail(email)).data.exists &&
      !(await checkSDT(sdt)).data.exists
    ) {
      
      const data = await getOTP(email);
      console.log(data);
      navigation.navigate("VetifiOtpDK", {
        email: email,
        sdt: sdt,
        data: data,
      });
    } else {
      alert("Email hoặc Số điện thoại đã tồn tại !");
      return;
    }
  };

   useEffect(() => {
        // Kiểm tra định dạng email

        if (email.length > 0 && sdt.length == 10) {
          setEnabled(true);
        }else {
          setEnabled(false);
        }
  
    }, [email, sdt]);

  return (
    <LayoutDefault>
      <InputPhone
        placeholder="Số điện thoại"
        iconLeft="phone-portrait"
        onChangeText={(text) => setSDT(text)}
        value={sdt}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
      />
      <InputDefault
        placeholder="Email"
        iconLeft="person"
        onChangeText={(text) => setEmail(text)}
        value={email}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
      />
      <ButtonPrimary title="Tiếp tục" onPress={() => handleSignUp()} enabled={enabled} />

      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={styles.textBody}>Bạn đã có tài khoản ? </Text>
        <TouchableOpacity onPress={() => handleLogin()}>
          <Text style={styles.text}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </LayoutDefault>
  );
};

export default SignUpScreen;

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
