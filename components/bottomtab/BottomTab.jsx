import React from 'react';
import { Text, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MessageScreen from '@/screens/MessageScreen';
import ContacsScreen from '@/screens/ContactsScreen';
import DiaryScreen from '@/screens/DiaryScreen';
import IndividualScreen from '@/screens/IndividualScreen';

const Tab = createBottomTabNavigator();

const BottomTab = () =>{
  return (
      <Tab.Navigator
        initialRouteName="Tin Nhắn"
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color }) => {
            let iconName;
            if (route.name === 'Tin Nhắn') iconName = 'chat-bubble';
            else if (route.name === 'Danh bạ') iconName = 'contacts';
            else if (route.name === 'Nhật ký') iconName = 'history';
            else if (route.name === 'Cá nhân') iconName = 'person';
            return <Icon name={iconName} size={24} color={color} />;
          },
          tabBarActiveTintColor: '#ffffff',
  tabBarInactiveTintColor: '#b3e5fc',
  tabBarShowLabel: true,
  tabBarStyle: {
    backgroundColor: '#00caff',
    borderTopWidth: 0,
    height: 80,
    paddingBottom: 10,
    paddingTop: 10,
    justifyContent: 'center',
    width: '100%',
    position: 'absolute',
    left: 0,
    right: 0,
  },
  tabBarLabelStyle: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 5,
  },
  headerShown: false,
})}
      >
        <Tab.Screen name="Tin Nhắn" component={MessageScreen} />
        <Tab.Screen name="Danh bạ" component={ContacsScreen} />
        <Tab.Screen name="Nhật ký" component={DiaryScreen} />
        <Tab.Screen name="Cá nhân" component={IndividualScreen} />
      </Tab.Navigator>
  );
}
export default BottomTab;
