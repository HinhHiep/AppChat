import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'
import DateTimePicker from '@react-native-community/datetimepicker'

const InputDate = ({
  onPress = () => {},
  value = "",
  onChangeText = () => {},
}
) => {
  
  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPress}>
        <Ionicons name="calendar" size={24} color="#898787" />
      </TouchableOpacity>
      <TextInput 
        style={styles.input}
        placeholder='Ngày sinh'
        placeholderTextColor={"#898787"}
        value={value}
        onChangeText={onChangeText}
        editable={false} // Ngăn không cho người dùng nhập liệu trực tiếp
      />
    </View>
  )
}

export default InputDate

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderWidth: 1,
    borderColor: "#898787",
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginVertical: 10,
  },
  input: {
    color: "#000000",
    fontSize: 16,
    height: 40,
    width: 230,
    outlineStyle: "none",
    borderWidth: 0,
    paddingHorizontal: 10, // Giữ khoảng cách trái phải
  paddingVertical: 8, // Điều chỉnh padding trên dưới
  lineHeight: 20, // Giảm hoặc tăng line height nếu cần
  textAlignVertical: "center", // Căn giữa nội dung theo chiều dọc trên Android

  },
})