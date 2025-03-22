import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const ButtonSecondary = ({
    title,
    onPress,
}) => {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}

export default ButtonSecondary

const styles = StyleSheet.create({
    button:{
        backgroundColor:'#ffffff',
        padding:15,
        borderRadius:20,
        marginVertical:10,
        borderWidth:1,
        borderColor:'#03C7F7'
    },
    text:{
        color:'#03C7F7',
        textAlign:'center',
        fontWeight:'bold',
        fontSize:16,
    }
})