import { Platform } from "react-native";
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import { supabase } from "./supabase";
import { getCurrentUser } from "./authService";

export async function requestNotificationPermission() {
  const current = await Notifications.getPermissionsAsync();

  if (current.status === "granted") {
    return current;
  }

  return Notifications.requestPermissionsAsync();
}

function getProjectId() {
  return (
    Constants.expoConfig?.extra?.eas?.projectId ||
    Constants.easConfig?.projectId ||
    null
  );
}

export async function getExpoPushToken() {
  const projectId = getProjectId();

  if (!projectId) {
    throw new Error(
      'Missing EAS projectId. Run "eas init" and add extra.eas.projectId to app.json.'
    );
  }

  const response = await Notifications.getExpoPushTokenAsync({
    projectId,
  });

  return response.data;
}

export async function savePushToken(token, platform = Platform.OS) {
  const user = await getCurrentUser();

  if (!user) {
    throw new Error("Log in to register push notifications.");
  }

  const { error } = await supabase.from("push_tokens").upsert(
    {
      user_id: user.id,
      token,
      platform,
    },
    {
      onConflict: "user_id,token",
    }
  );

  if (error) throw error;
}

export async function registerForPushNotifications() {
  const permission = await requestNotificationPermission();

  if (permission.status !== "granted") {
    return {
      status: permission.status,
      token: null,
      message: "Notification permission not granted.",
    };
  }

  const token = await getExpoPushToken();

  await savePushToken(token);

  return {
    status: "granted",
    token,
    message: "Push token registered.",
  };
}