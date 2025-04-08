import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import ButtonPrimary from '@/components/button/ButtonPrimary'
import { CommonActions } from '@react-navigation/native';
import { useNavigation } from "@react-navigation/native";
const HomeScreens = () => {
   const navigation = useNavigation();
  return (
    <View>
      <Text>HomeScreens</Text>
      <ButtonPrimary title="Đăng Xuất" onPress={() =>{
        navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: 'Login' }],
          })
        );
      }} />
    </View>
  )
}

export default HomeScreens

const styles = StyleSheet.create({})