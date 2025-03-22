import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LayoutDefault from '@/components/layout/LayoutDefault'
import InputDefault from '@/components/input/InputDefault'
import ButtonPrimary from '@/components/button/ButtonPrimary'
import { useNavigation } from '@react-navigation/native'

const ResetPassScreen = () => {
    const navigation = useNavigation()
    const handleResetPass = () => {
        navigation.navigate('Login')
    }
  return (
   <LayoutDefault>
         <InputDefault placeholder="Số điện thoại" iconLeft="person" />
         <InputDefault placeholder="Mật khẩu mới" iconLeft="lock-closed" iconRight={true} />
         <InputDefault placeholder="Nhập lại mật khẩu" iconLeft="lock-closed" iconRight={true} />
            <ButtonPrimary title="Đổi mật khẩu" onPress={()=>handleResetPass()}/>
    </LayoutDefault>
  )
}

export default ResetPassScreen

const styles = StyleSheet.create({})