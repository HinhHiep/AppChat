import { StyleSheet, Text, View } from 'react-native'
import React, { useState,useEffect } from 'react'
import LayoutDefault from '@/components/layout/LayoutDefault'
import InputDefault from '@/components/input/InputDefault'
import ButtonPrimary from '@/components/button/ButtonPrimary'
import { useNavigation } from '@react-navigation/native'
import { useDispatch } from 'react-redux'
import { changePass } from '@/api/UserApi'
import { useRoute } from "@react-navigation/native";
const ResetPassScreen = () => {
    const navigation = useNavigation()
    const route = useRoute();
    const {sdt} = route.params;
     useEffect(() => {
        console.log('Sdt:', sdt);  // In ra sdts
      }, [sdt]);
    //const route = navigation.getState().routes
    //const phoneNumber = route[route.length - 1].params.phoneNumber;
    const [password, setPassword] = useState('')
    const [rePassword, setRePassword] = useState('')
    const dispatch = useDispatch()


    const handleResetPass =async ({password, rePassword}) => {
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

        console.log(password);
        console.log(sdt);
        const matKhau = password;
        const req = await changePass(sdt, matKhau)
        console.log(req);
        if (req.success) {
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'Login',
                params: {sdt: sdt}
               }],
            })
          );
          } else {
            alert(req.message || "Đổi mật khẩu không thành công!");
          }
    }
  return (
   <LayoutDefault>
         <InputDefault 
          placeholder="Mật khẩu mới" 
          iconLeft="lock-closed" 
          iconRight={true} 
          onChangeText={(text) => setPassword(text)}
          value={password}
          underlineColorAndroid="transparent"
         autoCapitalize="none"
        />
         <InputDefault 
         placeholder="Nhập lại mật khẩu" 
         iconLeft="lock-closed" 
         iconRight={true}
          onChangeText={(text) => setRePassword(text)}
          value={rePassword}
          underlineColorAndroid="transparent"
         autoCapitalize="none"
          />
            <ButtonPrimary title="Đổi mật khẩu" onPress={()=>handleResetPass({password, rePassword})} />
    </LayoutDefault>
  )
}

export default ResetPassScreen

const styles = StyleSheet.create({})