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
import  FullImageScreen from '../screens/FullImageScreen';
import { Provider } from 'react-redux';
import  store  from '../redux/store';
import FriendRequestScreen from "@/screens/FriendRequestScreen";
import  SearchBar from "@/screens/SearchBar";
import SearchFriendByPhoneScreen from "@/screens/SearchFriendByPhoneScreen";
import CreateGroupScreen from "@/screens/CreateGroupScreen";
import GroupOptionsScreen from '@/screens/GroupOptionsScreen';
import MediaFilesScreen from "@/screens/MediaFilesScreen";
import TransferRoleScreen from "@/screens/TransferRoleScreen";

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
      <Stack.Screen name="FullImageScreen" component={FullImageScreen} />
      <Stack.Screen name="FriendRequestScreen" component={FriendRequestScreen} />
      <Stack.Screen name="SearchBar" component={SearchBar} />
      <Stack.Screen name="SearchFriendByPhoneScreen" component={SearchFriendByPhoneScreen} />
      <Stack.Screen name="CreateGroupScreen" component={CreateGroupScreen} />
      <Stack.Screen name="GroupOptionsScreen" component={GroupOptionsScreen} />
      <Stack.Screen name="MediaFilesScreen" component={MediaFilesScreen} />
      <Stack.Screen name="TransferRoleScreen" component={TransferRoleScreen} />
    </Stack.Navigator>
    </Provider>
  );
};
export default AppLayout;
// 