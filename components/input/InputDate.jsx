import React, { useState } from 'react';
import { TextInput, View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const InputDate = ({
  placeholder = "Type here...",
  iconLeft = null,
  onChangeText,
  value,
}) => {
  const [formattedText, setFormattedText] = useState(value);
  
  // Hàm định dạng ngày tháng (dd/mm/yyyy)
  const handleTextInput = (text) => {
    // Loại bỏ tất cả các ký tự không phải số
    let formatted = text.replace(/\D/g, "");
    
    // Định dạng thành dd/mm/yyyy
    if (formatted.length <= 2) {
      formatted = formatted.replace(/(\d{2})(\d{0,})/, "$1/$2");
    } else if (formatted.length <= 4) {
      formatted = formatted.replace(/(\d{2})(\d{2})(\d{0,})/, "$1/$2/$3");
    } else {
      formatted = formatted.replace(/(\d{2})(\d{2})(\d{4})(\d{0,})/, "$1/$2/$3");
    }

    setFormattedText(formatted);
    if (onChangeText) {
      onChangeText(formatted);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {iconLeft && <Ionicons name={iconLeft} size={24} color="#898787" />}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={"#898787"}
          value={formattedText}
          onChangeText={handleTextInput}
          keyboardType="numeric"
          maxLength={10}  // Giới hạn 10 ký tự cho dd/mm/yyyy
        />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
    container: {
      backgroundColor: "#ffffff",
      padding: 10,
      borderWidth: 1,
      borderColor: "#898787",
      borderRadius: 10,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: 10,
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
    left: {
      flexDirection: "row",
      alignItems: "center",
      gap: 10,
    },
  });

export default InputDate;