import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { Ionicons } from "@expo/vector-icons";

import HomeFeedScreen from "../screens/feed/HomeFeedScreen";
import CreatePostScreen from "../screens/posts/CreatePostScreen";
import FavoritesScreen from "../screens/favorites/FavoritesScreen";
import NotificationsScreen from "../screens/notifications/NotificationsScreen";
import ProfileScreen from "../screens/profile/ProfileScreen";

import routes from "../constants/routes";
import colors from "../constants/colors";

const Tab = createBottomTabNavigator();

const tabs = {
  [routes.HomeFeed]: {
    label: "Home",
    icon: "home-outline",
    activeIcon: "home",
  },
  [routes.CreatePost]: {
    label: "Create",
    icon: "add-circle-outline",
    activeIcon: "add-circle",
  },
  [routes.Favorites]: {
    label: "Saved",
    icon: "bookmark-outline",
    activeIcon: "bookmark",
  },
  [routes.Notifications]: {
    label: "Alerts",
    icon: "notifications-outline",
    activeIcon: "notifications",
  },
  [routes.Profile]: {
    label: "Profile",
    icon: "person-outline",
    activeIcon: "person",
  },
};

export default function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => {
        const tab = tabs[route.name];

        return {
          headerShown: false,
          tabBarLabel: tab.label,
          tabBarActiveTintColor: colors.primary,
          tabBarInactiveTintColor: colors.muted,
          tabBarStyle: {
            borderTopColor: colors.border,
            height: 72,
            paddingBottom: 10,
            paddingTop: 8,
            backgroundColor: colors.surface,
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "700",
          },
          tabBarIcon: ({ color, size, focused }) => (
            <Ionicons
              name={focused ? tab.activeIcon : tab.icon}
              size={focused ? 25 : 23}
              color={color}
            />
          ),
        };
      }}
    >
      <Tab.Screen name={routes.HomeFeed} component={HomeFeedScreen} />
      <Tab.Screen name={routes.CreatePost} component={CreatePostScreen} />
      <Tab.Screen name={routes.Favorites} component={FavoritesScreen} />
      <Tab.Screen name={routes.Notifications} component={NotificationsScreen} />
      <Tab.Screen name={routes.Profile} component={ProfileScreen} />
    </Tab.Navigator>
  );
}