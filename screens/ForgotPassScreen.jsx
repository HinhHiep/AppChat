import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import LayoutDefault from '@/components/layout/LayoutDefault'
import InputDefault from '@/components/input/InputDefault'
import ButtonPrimary from '@/components/button/ButtonPrimary'
import { useNavigation } from '@react-navigation/native'
import {getOTP,checkGmail,checkSDT} from '@/api/UserApi';
import InputPhone from '@/components/input/InputPhone'
import { CommonActions } from '@react-navigation/native';
import { isValidPhoneNumber, isValidEmail } from '@/utilities/validate'


const ForgotPassScreen = ({route}) => {
    const navigation = useNavigation()
    const [email, setEmail] = useState('')
    const [sdt, setSDT] = useState('')
    const [enabled, setEnabled] = useState(false)
    const {phoneNumber} = route.params || {};
    const [errPhone, setErrorPhone] = useState('')
    const [errEmail, setErrorEmail] = useState('')

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
            navigation.dispatch(
              CommonActions.reset({
                index: 0,
                routes: [{ name: 'VetifiOtpQMK' ,
                  params: {email: email, sdt: sdt, data:data},
                }],
              })
            );
        } else{
        alert('Email hoặc Số điện thoại không hợp lệ !')
            return
        }
    }

    useEffect(() => {
      if (isValidEmail(email) && isValidPhoneNumber(sdt)) {
        setEnabled(true);
      }
      else {
        setEnabled(false);
      }
    },[sdt,email])

    useEffect(() => {
      if (phoneNumber) {
        setSDT(phoneNumber);
      }
    }, [phoneNumber]);

  return (
    <LayoutDefault>
       <Text style={styles.textBody}>
        Vui lòng nhập Số điện thoại và Email của bạn. Chúng tôi sẽ gửi mã xác nhận đến Email của bạn.
      </Text>
      <InputDefault
        placeholder="Số điện thoại"
        iconLeft="phone-portrait"   
        onChangeText={(text) => {
          setSDT(text)  
          if (isValidPhoneNumber(text)) {
            setErrorPhone("");
          }
        }}  
        value={ sdt}
        // underlineColorAndroid="transparent"  
        autoCapitalize="none"  
        keyboardTypeNumeric
        maxLength={10}
        onBlur={() => {
          if (sdt.length != 10) {
            setErrorPhone("Số điện thoại không hợp lệ!");
          } else {
            setErrorPhone("");
          }
        }}

      />
      {errPhone.length > 0 && <Text style={{color: 'red'}}>(*) {errPhone}</Text>}

      <InputDefault placeholder="Email" iconLeft="mail"
        onChangeText={(text) => 
        {
          setEmail(text)
        if(isValidEmail(text)) {
            setErrorEmail("");
          }
          
        }}
        value={email}
        underlineColorAndroid="transparent"
        autoCapitalize="none"
        keyboardType="email-address"
        onBlur={() => {
          if (!isValidEmail(email)) {
            setErrorEmail("Email không hợp lệ!");
          } else {
            setErrorEmail("");
          }
        }}
      />
      {errEmail.length > 0 && <Text style={{color: 'red'}}>(*) {errEmail}</Text>}
     
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

export default ForgotPassScreen;

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
});
