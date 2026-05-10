import { createNativeStackNavigator } from "@react-navigation/native-stack";
import PublicFeedScreen from "../screens/feed/PublicFeedScreen";
import LoginScreen from "../screens/auth/LoginScreen";
import RegisterScreen from "../screens/auth/RegisterScreen";
import routes from "../constants/routes";

const Stack = createNativeStackNavigator();

export default function AuthNavigator() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name={routes.PublicFeed} component={PublicFeedScreen} />
      <Stack.Screen name={routes.Login} component={LoginScreen} />
      <Stack.Screen name={routes.Register} component={RegisterScreen} />
    </Stack.Navigator>
  );
}
