
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect } from "react";
import LayoutDefault from "@/components/layout/LayoutDefault";
import InputDefault from "@/components/input/InputDefault";
import ButtonPrimary from "@/components/button/ButtonPrimary";
import { useNavigation } from "@react-navigation/native";

const VetifiOtpQMK = ({ route }) => {
  const navigation = useNavigation();
  const { email, sdt, data } = route.params;
  useEffect(() => {
    console.log("Email:", email); // In ra email
    console.log("Data:", data); // In ra data
    console.log("Sdt:", sdt); // In ra sdt
  }, [email, sdt, data]);
  const [enabled, setEnabled] = useState(false);
  const [OTP, setOTP] = useState("");
  const handleLogin = () => {
    navigation.navigate("Login");
  };
  const handleSignUp = () => {
    if (!OTP) {
      alert("Vui lòng nhập OTP !");
      return;
    }
    if (OTP !== data.otp) {
      alert("OTP không đúng !");
      return;
    }
    navigation.navigate("ResetPass", {
      email: email,
      sdt: sdt,
    });
  };

  useEffect(() => {
    if (OTP.length == 6) {
      setEnabled(true);
    } else {
      setEnabled(false);
    }
  }, [OTP]);

  return (
    <LayoutDefault>
      <InputDefault
        placeholder="key"
        //iconLeft="person"
        onChangeText={(text) => setOTP(text)}
        value={OTP}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
      />
      <ButtonPrimary
        title="Tiếp tục"
        onPress={() => handleSignUp()}
        enabled={enabled}
      />
      <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={styles.textBody}>Bạn đã có tài khoản ? </Text>
        <TouchableOpacity onPress={() => handleLogin()}>
          <Text style={styles.text}>Đăng nhập</Text>
        </TouchableOpacity>
      </View>
    </LayoutDefault>
  );
};
export default VetifiOtpQMK;
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
