import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const ContactsScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Danh bạ</Text>
    </View>
  );
};

export default ContactsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});
