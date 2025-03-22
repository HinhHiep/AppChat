import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import LayoutDefault from '@/components/layout/LayoutDefault'
import InputDefault from '@/components/input/InputDefault'
import ButtonPrimary from '@/components/button/ButtonPrimary'
import { useNavigation } from '@react-navigation/native'

const SignUpScreen = () => {
  const navigation = useNavigation()
  const handleLogin = () => {
    navigation.navigate('Login')
  }
  const handleSignUp = () => {
    navigation.navigate('SignUpInfo')
  }
  return (
   <LayoutDefault>
       <InputDefault placeholder="Số điện thoại" iconLeft="person" />
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