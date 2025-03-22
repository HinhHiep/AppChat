import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import LayoutDefault from '@/components/layout/LayoutDefault'
import InputDefault from '@/components/input/InputDefault'
import ButtonPrimary from '@/components/button/ButtonPrimary'
import { useNavigation } from '@react-navigation/native'

const ForgotPassScreen = () => {
    const navigation = useNavigation()
    const handleLogin = () => {
        navigation.navigate('Login')
    }
    const handleForgetPass = () => {
        navigation.navigate('ResetPass')
    }
  return (
    <LayoutDefault>
      <InputDefault placeholder="Số điện thoại" iconLeft="person" />
      <Text style={styles.textBody}>
        Vui lòng nhập số điện thoại của bạn. Chúng tôi sẽ gửi mã xác nhận đến số điện thoại của bạn.
      </Text>
        <ButtonPrimary title="Gửi mã xác nhận" onPress={()=>handleForgetPass()} />

        <Text style={styles.textBody}>
          Bạn đã nhớ mật khẩu ?{' '}
          <TouchableOpacity onPress={()=> handleLogin()}>
            <Text style={styles.text}>Đăng nhập</Text>  
          </TouchableOpacity>
        </Text>
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