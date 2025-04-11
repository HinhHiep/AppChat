import { createNativeStackNavigator } from "@react-navigation/native-stack";
import LoginScreen from "../screens/LoginScreen";
import WellcomeScreen from "../app/index"
import SignUpScreen from "../screens/SignUpScreen";
import SignUpInfoScreen from "../screens/SignUpInfoScreen";
import HomeScreen from "../screens/HomeScreen";
import ForgotPassScreen from "../screens/ForgotPassScreen";
import ResetPassScreen from "../screens/ResetPassScreen";
import VetifiOtp from "../screens/VetifiOtpDK";
import VetifiOtpQMK from "../screens/VetifiOtpQMK";
import  BottomTabBar  from '@/components/bottomtab/BottomTab';
import  ProfileScreen  from "../screens/ProfileScreen";
import ChatScreen from "../screens/ChatScreen";
import { Provider } from 'react-redux'
import  store  from '../redux/store'
 
const Stack = createNativeStackNavigator();
export const AppLayout = () => {
  return (
    <Provider store={store}>
      
    <Stack.Navigator
      screenOptions={{ headerShown: false }}
      initialRouteName="Wellcome"
    >
      <Stack.Screen name="Wellcome" component={WellcomeScreen} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="SignUp" component={SignUpScreen} />
      <Stack.Screen name="SignUpInfo" component={SignUpInfoScreen} />
      <Stack.Screen name="Home" component={BottomTabBar} />
      <Stack.Screen name="ForgotPass" component={ForgotPassScreen} />
      <Stack.Screen name="ResetPass" component={ResetPassScreen} />
      <Stack.Screen name = "VetifiOtpDK" component={VetifiOtp} />
      <Stack.Screen name = "VetifiOtpQMK" component={VetifiOtpQMK} />
      <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      <Stack.Screen name="ChatScreen" component={ChatScreen} />
    </Stack.Navigator>
    </Provider>
  );
};
export default AppLayout;
