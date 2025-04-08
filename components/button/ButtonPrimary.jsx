import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const ButtonPrimary = ({
    title,
    onPress,
    enabled = true
}) => {
  return (
    <TouchableOpacity 
        style={ enabled ? styles.button : styles.buttonDisabled}
        onPress={enabled ? onPress : null}
        
    >
        <Text style={styles.text}>{title}</Text>
    </TouchableOpacity>
  )
}

export default ButtonPrimary

const styles = StyleSheet.create({
    button:{
        backgroundColor:'#03C7F7',
        padding:15,
        borderRadius:20,
        marginVertical:10
    },
    text:{
        color:'#ffffff',
        textAlign:'center',
        fontWeight:'bold'
    }, 
    buttonDisabled:{
        padding:15,
        borderRadius:20,
        marginVertical:10,
        backgroundColor: '#ccc'
    }
})