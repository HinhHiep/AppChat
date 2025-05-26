import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState,useEffect } from 'react'
import LayoutDefault from '@/components/layout/LayoutDefault'
import InputDefault from '@/components/input/InputDefault'
import ButtonPrimary from '@/components/button/ButtonPrimary'
import { useNavigation } from '@react-navigation/native'
import { CommonActions } from '@react-navigation/native'
import {getOTP} from '@/api/UserApi';
const VetifiOtpDK = ({route}) => {
  const navigation = useNavigation()
  const {email,sdt, data} = route.params;
  const [timer, setTimer] = useState(60);
  
    useEffect(() => {
      if (timer > 0) {
        const interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
        return () => clearInterval(interval);
      }
    }, [timer]);

  const [enabled,setEnabled] = useState(false)
  useEffect(() => {
    console.log('Email:', email);  // In ra email
    console.log('Data:', data);    // In ra data
  }, [email,sdt, data]);
  const [OTP, setOTP] = useState('')
  const [isOTPValid, setIsOTPValid] = useState(data?.otp || ""); // Giả sử data.otp là OTP đã gửi

  const handleLogin = () => {
    navigation.navigate('Login')
  }
  const handleSignUp = () => {
    if (!OTP) {
      alert('Vui lòng nhập OTP !')
      return
    }
    if (OTP !== isOTPValid) {
      alert('OTP không đúng !')
      return
    }
    navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: 'SignUpInfo',
          params: { email: email, sdt: sdt }
         }],
      })
    );
  }

  useEffect(() => {
          // Kiểm tra định dạng email
  
          if (OTP.length == 6) {
            setEnabled(true);
          }else {
            setEnabled(false);
          }
    
      }, [OTP]);
   const handleResend = async () => {
      if (timer === 0) {
        setTimer(60);
        // Gửi lại OTP tại đây
       const data = await getOTP(email);
       setIsOTPValid(data.otp); // Cập nhật OTP mới
       alert("OTP resent!");
      }
    };
  return (
   <LayoutDefault>
       <InputDefault 
        placeholder="OTP" 
        //iconLeft="person" 
        onChangeText={(text) => setOTP(text)}
        value={OTP}
        underlineColorAndroid="transparent"
         autoCapitalize="none"
         keyboardTypeNumeric
      />
       <ButtonPrimary title="Tiếp tục" onPress={()=> handleSignUp()} enabled={enabled} />
        <View style={styles.resendContainer}>
                      {timer > 0 ? (
                        <Text style={styles.timerText}>
                          Resend OTP in {timer}s
                        </Text>
                      ) : (
                        <TouchableOpacity onPress={handleResend}>
                          <Text style={styles.resendText}>Resend OTP</Text>
                        </TouchableOpacity>
                      )}
                    </View>
       <View style={{ flexDirection: "row", justifyContent: "center" }}>
               <Text style={styles.textBody}>Bạn đã có tài khoản ? </Text>
               <TouchableOpacity onPress={() => handleLogin()}>
                 <Text style={styles.text}>Đăng nhập</Text>
               </TouchableOpacity>
             </View>
    </LayoutDefault>
  )
}
export default VetifiOtpDK
const styles = StyleSheet.create({
  text: {
    color: '#03C7F7',
    textAlign: 'right',
    marginVertical: 10,
    textDecorationLine: 'underline',
    fontSize: 16,
  },
  textBody: {
    textAlign: 'center',
    marginVertical: 10,
    fontSize: 16,
  },
  resendContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 10,
  },
  timerText: {
    color: "#230C02",
    fontSize: 14,
  },
  resendText: {
    color: "#834D1E",
    fontSize: 14,
    fontWeight: "bold",
    textDecorationLine: "underline",
  },
})