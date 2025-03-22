import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LayoutDefault from '@/components/layout/LayoutDefault'
import InputDefault from '@/components/input/InputDefault'
import ButtonPrimary from '@/components/button/ButtonPrimary'
import { useNavigation } from '@react-navigation/native'



const SignUpInfoScreen = () => {
  const navigation = useNavigation()
    const handleSignUp = () => {
        navigation.navigate('Login')
    }



  return (
    <LayoutDefault>
       <InputDefault placeholder="Tên hiển thị" iconLeft="person" />
       <InputDefault placeholder="Ngày sinh" iconLeft="calendar" />
         <InputDefault placeholder="Mật khẩu" iconLeft="lock-closed" iconRight={true} />
         <InputDefault placeholder="Nhập lại mật khẩu" iconLeft="lock-closed" iconRight={true} />
       <ButtonPrimary title="Tạo tài khoản" onPress={()=> handleSignUp()} />
    </LayoutDefault>
  )
}

export default SignUpInfoScreen

const styles = StyleSheet.create({})