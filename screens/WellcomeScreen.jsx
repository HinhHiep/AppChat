import { Image, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import LayoutDefault from '../components/layout/LayoutDefault'
import ButtonPrimary from '../components/button/ButtonPrimary'
import ButtonSecondary from '../components/button/ButtonSecondary'
import { useNavigation } from "@react-navigation/native";


const WellcomeScreen = () => {
    const navigation = useNavigation()

    const handleLogin = () => {
        navigation.navigate('Login')
    }
    const handleSignUp = () => {
        navigation.navigate('SignUp')
    }

  return (
    <LayoutDefault>
        <Image source={require('../assets/images/default/imageChat.png')} style={styles.image} />
        <ButtonPrimary title="Đăng nhập" onPress={()=> handleLogin()} />
        <ButtonSecondary title="Tạo tài khoản mới" onPress={() => handleSignUp()} />
    </LayoutDefault>
  )
}

export default WellcomeScreen

const styles = StyleSheet.create({})