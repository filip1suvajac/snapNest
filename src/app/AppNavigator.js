import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useRef } from "react";
import AuthNavigator from "./AuthNavigator";
import MainTabs from "./MainTabs";
import SplashScreen from "../screens/SplashScreen";
import PostDetailScreen from "../screens/feed/PostDetailScreen";
import EditProfileScreen from "../screens/profile/EditProfileScreen";
import useSession from "../hooks/useSession";
import { registerForPushNotifications } from "../services/notificationService";
import routes from "../constants/routes";
import colors from "../constants/colors";

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { session, loading } = useSession();
  const registeredUserId = useRef(null);

  useEffect(() => {
    if (!session?.user?.id || registeredUserId.current === session.user.id) return;
    registeredUserId.current = session.user.id;
    registerForPushNotifications().catch((error) => {
      console.warn("Push registration skipped:", error.message);
    });
  }, [session?.user?.id]);

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerShown: false, contentStyle: { backgroundColor: colors.background } }}>
        {loading ? (
          <Stack.Screen name={routes.Splash} component={SplashScreen} />
        ) : session ? (
          <>
            <Stack.Screen name={routes.MainTabs} component={MainTabs} />
            <Stack.Screen name={routes.PostDetail} component={PostDetailScreen} />
            <Stack.Screen name={routes.EditProfile} component={EditProfileScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Auth" component={AuthNavigator} />
            <Stack.Screen name={routes.PostDetail} component={PostDetailScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
