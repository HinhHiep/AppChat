import React, { useState } from 'react';
import { TextInput, View, StyleSheet, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const InputPhone = ({
  placeholder = "Số điện thoại",
  iconLeft = null,
  onChangeText,
  value = "",
}) => {
  const [text, setText] = useState(value);
  const [isValid, setIsValid] = useState(true);

  const handleTextInput = (input) => {
    // Loại bỏ ký tự không phải số
    let clean = input.replace(/\D/g, "").substring(0, 10);

    // Regex kiểm tra đầu số Việt Nam
    const regex = /^(0[3|5|7|8|9])[0-9]{8}$/;
    const valid = regex.test(clean);

    setText(clean);
    setIsValid(valid);

    if (onChangeText) {
      onChangeText(clean, valid);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {iconLeft && <Ionicons name={iconLeft} size={24} color="#898787" />}
        <TextInput
          style={[styles.input, !isValid && styles.inputInvalid]}
          placeholder={placeholder}
          placeholderTextColor="#898787"
          value={text}
          onChangeText={handleTextInput}
          keyboardType="numeric"
          maxLength={10}
          autoCapitalize="none"
          underlineColorAndroid="transparent"
        />
      </View>
      {!isValid && <Text style={styles.error}>Số điện thoại không hợp lệ</Text>}
    </View>
  );
};

export default InputPhone;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    padding: 10,
    borderWidth: 1,
    borderColor: "#898787",
    borderRadius: 10,
    flexDirection: "column",
    gap: 5,
    marginVertical: 10,
  },
  input: {
    color: "#000000",
    fontSize: 16,
    height: 40,
    width: 250,
    outlineStyle: "none",
    borderWidth: 0,
    paddingHorizontal: 10, // Giữ khoảng cách trái phải
  paddingVertical: 8, // Điều chỉnh padding trên dưới
  lineHeight: 20, // Giảm hoặc tăng line height nếu cần
  textAlignVertical: "center", // Căn giữa nội dung theo chiều dọc trên Android
  },
  inputInvalid: {
    borderColor: "red",
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  error: {
    color: "red",
    fontSize: 12,
    marginLeft: 5,
  },
});
