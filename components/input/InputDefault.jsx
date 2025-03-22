import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { Ionicons } from "@expo/vector-icons";

const InputDefault = ({
  placeholder = "Type here...",
  iconLeft = null,
  iconRight = false,
}) => {
    const [showPass, setShowPass] = useState(false)
    const handlePass = () => {
        setShowPass(!showPass)
    }

  return (
    <View style={styles.container}>
      <View style={styles.left}>
        {iconLeft && <Ionicons name={iconLeft} size={24} color="#898787" />}
        <TextInput
          style={styles.input}
          placeholder={placeholder}
          placeholderTextColor={"#898787"}
            secureTextEntry={
                iconRight && showPass ? false : iconRight ? true : false
            }
        />
      </View>
      {iconRight && (
        showPass ? (
          <TouchableOpacity onPress={()=> handlePass()}>
            <Ionicons name="eye" size={24} color="#898787" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={()=> handlePass()}>
            <Ionicons name="eye-off" size={24} color="#898787" />
          </TouchableOpacity>
        )
        )}
    </View>
  );
};

export default InputDefault;

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
    height: 30,
    width: 250,
  },
  left: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
});
