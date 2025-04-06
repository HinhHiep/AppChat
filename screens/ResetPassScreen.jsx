import { StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import LayoutDefault from '@/components/layout/LayoutDefault'
import InputDefault from '@/components/input/InputDefault'
import ButtonPrimary from '@/components/button/ButtonPrimary'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { changePass } from '@/api/UserApi'

const ResetPassScreen = () => {
    const navigation = useNavigation()
    const route = navigation.getState().routes;
    const phoneNumber = route[route.length - 1].params.phoneNumber;
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
    const dispatch = useDispatch()


    const handleResetPass = ({password, rePassword}) => {
        if (!password || !rePassword) {
            alert('Vui lòng nhập đầy đủ thông tin !')
            return
        }
        if (password.length < 6) {
            alert('Mật khẩu không hợp lệ !')
            return
        }
        if (password !== rePassword) {
            alert('Mật khẩu không khớp !')
            return
        }
        dispatch(changePass({ phoneNumber, password }))
        .unwrap()
        .then(() => {
            console.log('Đổi mật khẩu thành công')
            navigation.navigate('Login',{
                phoneNumber: phoneNumber,
            })
        })
        .catch((error) => {
            console.error('Đổi mật khẩu thất bại:', error)
            alert('Đổi mật khẩu thất bại !')
        })

    }
  return (
   <LayoutDefault>
         <InputDefault 
          placeholder="Mật khẩu mới" 
          iconLeft="lock-closed" 
          iconRight={true} 
          onChangeText={(text) => setPassword(text)}
          value={password}
        />
         <InputDefault 
         placeholder="Nhập lại mật khẩu" 
         iconLeft="lock-closed" 
         iconRight={true}
          onChangeText={(text) => setRePassword(text)}
          value={rePassword}
          />
            <ButtonPrimary title="Đổi mật khẩu" onPress={()=>handleResetPass({password, rePassword})} />
    </LayoutDefault>
  )
}

export default ResetPassScreen

const styles = StyleSheet.create({})