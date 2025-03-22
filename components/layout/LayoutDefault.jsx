import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";

const LayoutDefault = ({ children }) => {
  return (
    <View style={styles.container}>
      <Image
        source={require("../../assets/images/default/Logo.png")}
        style={styles.image}
      />
      {children}
    </View>
  );
};

export default LayoutDefault;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padingVertical: 20,
    paddingHorizontal: 20,
    backgroundColor: "#ffffff",
  },
  image: {
    width: 200,
    height: 200,
    alignSelf: "center",
    marginVertical: 20,
  },
});
