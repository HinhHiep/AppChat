import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import LayoutDefault from '@/components/layout/LayoutDefault'
import InputDefault from '@/components/input/InputDefault'
import ButtonPrimary from '@/components/button/ButtonPrimary'
import { useNavigation } from '@react-navigation/native'
import {getOTP,checkGmail} from '@/api/UserApi';

const SignUpScreen = () => {
  const navigation = useNavigation()
  const [email, setEmail] = useState('')
  const handleLogin = () => {
    navigation.navigate('Login')
  }
  const handleSignUp = async () => {
    if (!email) {
      alert('Vui lòng nhập email !')
      return
    }
    console.log((await checkGmail(email)).data.exists);
     if ((await checkGmail(email)).data.exists) {
      alert('Email đã tồn tại !')
      return
    }
    const data = await getOTP(email);
    console.log(data);
    navigation.navigate('VetifiOtp',{
      email: email,data: data
    })
  }
  return (
   <LayoutDefault>
       <InputDefault 
        placeholder="Email" 
        iconLeft="person" 
        onChangeText={(text) => setEmail(text)}
        value={email}
      />
       <ButtonPrimary title="Tiếp tục" onPress={()=> handleSignUp()} />
        <Text style={styles.textBody}>
          Bạn đã có tài khoản ?{' '}
          <TouchableOpacity onPress={()=> handleLogin()}>
            <Text style={styles.text}>Đăng nhập</Text>  
          </TouchableOpacity>
        </Text>
    </LayoutDefault>
  )
}

export default SignUpScreen

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