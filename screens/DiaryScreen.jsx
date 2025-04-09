import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const DiaryScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Nhật ký</Text>
    </View>
  );
};

export default DiaryScreen;

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
