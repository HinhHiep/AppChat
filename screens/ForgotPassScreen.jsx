import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import LayoutDefault from '@/components/layout/LayoutDefault'
import InputDefault from '@/components/input/InputDefault'
import ButtonPrimary from '@/components/button/ButtonPrimary'
import { useNavigation } from '@react-navigation/native'

const ForgotPassScreen = () => {
    const navigation = useNavigation()
    const [phoneNumber, setPhoneNumber] = useState('')
    const handleLogin = () => {
        navigation.navigate('Login')
    }
    const handleForgetPass = () => {
        if (!phoneNumber) {
            alert('Vui lòng nhập số điện thoại !')
            return
        }
        navigation.navigate('ResetPass',{
            phoneNumber: phoneNumber,
        })
    }
  return (
    <LayoutDefault>
      <InputDefault placeholder="Số điện thoại" iconLeft="person"
        onChangeText={(text) => setPhoneNumber(text)}
        value={phoneNumber}
        keyboardType="numeric"
      />
      <Text style={styles.textBody}>
        Vui lòng nhập số điện thoại của bạn. Chúng tôi sẽ gửi mã xác nhận đến số điện thoại của bạn.
      </Text>
        <ButtonPrimary title="Gửi mã xác nhận" onPress={()=>handleForgetPass()}/>
        <Text style={styles.textBody}>
          Bạn chưa nhận được mã xác nhận ?{' '}
          <TouchableOpacity onPress={()=> handleForgetPass()}>
            <Text style={styles.text}>Gửi lại mã xác nhận</Text>  
          </TouchableOpacity>
        </Text>
        

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