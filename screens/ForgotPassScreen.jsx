import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import LayoutDefault from '@/components/layout/LayoutDefault'
import InputDefault from '@/components/input/InputDefault'
import ButtonPrimary from '@/components/button/ButtonPrimary'
import { useNavigation } from '@react-navigation/native'
import {getOTP,checkGmail,checkSDT} from '@/api/UserApi';
import InputPhone from '@/components/input/InputPhone'
const ForgotPassScreen = ({route}) => {
    const navigation = useNavigation()
    const [email, setEmail] = useState('')
    const [sdt, setSDT] = useState('')
    const [enabled, setEnabled] = useState(false)
    const {phoneNumber} = route.params || {};

    const handleLogin = () => {
        navigation.navigate('Login')
    }
    const handleForgetPass =async () => {
        if (!email) {
            alert('Vui lòng nhập email !')
            return
        }
        console.log(email); 
        console.log(sdt);
       const reqEmail = await checkGmail(email);
        const reqSDT = await checkSDT(sdt);
        console.log(reqEmail.data.exists);
        console.log(reqSDT.data.exists);
        if (reqEmail.data.exists && reqSDT.data.exists) {
            const data = await getOTP(email);
        navigation.navigate('VetifiOtpQMK',{
            email: email,sdt:sdt,data: data
        });
        } else{
        alert('Email hoặc Số điện thoại không hợp lệ !')
            return
        }
    }

    useEffect(() => {
      if((sdt.length == 10 || phoneNumber.length == 10 )&& email.length > 0){
        setEnabled(true)
      }else{
        setEnabled(false)
      }
    },[sdt,email])

  return (
    <LayoutDefault>
      <InputDefault
        placeholder="Số điện thoại"
        iconLeft="phone-portrait"   
        onChangeText={(text) => setSDT(text)}  
        value={ phoneNumber || sdt}
        // underlineColorAndroid="transparent"  
        autoCapitalize="none"  
        keyboardTypeNumeric

      />

      <InputDefault placeholder="Email" iconLeft="mail"
        onChangeText={(text) => setEmail(text)}
        value={email}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
      />
      <Text style={styles.textBody}>
        Vui lòng nhập Số điện thoại và Email của bạn. Chúng tôi sẽ gửi mã xác nhận đến Email của bạn.
      </Text>
        <ButtonPrimary title="Gửi mã xác nhận" onPress={()=>handleForgetPass()} enabled={enabled} />
        <Text style={styles.textBody}>
          Bạn chưa nhận được mã xác nhận ?{' '}
          <TouchableOpacity onPress={()=> handleForgetPass()}>
            <Text style={styles.text}>Gửi lại mã xác nhận</Text>  
          </TouchableOpacity>
        </Text>
        

        <View style={{ flexDirection: "row", justifyContent: "center" }}>
        <Text style={styles.textBody}>
          Bạn đã nhớ mật khẩu ?{' '}
         
        </Text>
        <TouchableOpacity onPress={()=> handleLogin()}>
            <Text style={styles.text}>Đăng nhập</Text>  
          </TouchableOpacity>
        </View>
    </LayoutDefault>
  )
}

export default ForgotPassScreen

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
})