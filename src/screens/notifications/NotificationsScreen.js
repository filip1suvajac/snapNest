import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import AppHeader from "../../components/common/AppHeader";
import EmptyState from "../../components/common/EmptyState";
import PrimaryButton from "../../components/common/PrimaryButton";
import { registerForPushNotifications } from "../../services/notificationService";
import colors from "../../constants/colors";

export default function NotificationsScreen() {
  const [status, setStatus] = useState("unknown");
  const [token, setToken] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function register() {
    setLoading(true);
    setError("");
    try {
      const result = await registerForPushNotifications();
      setStatus(result.status);
      setToken(result.token || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    register();
  }, []);

  return (
    <SafeAreaView style={styles.screen}>
      <AppHeader title="Alerts" subtitle="Push notification setup" />
      <View style={styles.card}>
        <Text style={styles.label}>Permission</Text>
        <Text style={styles.value}>{status}</Text>
        {token ? (
          <>
            <Text style={styles.label}>Expo push token</Text>
            <Text style={styles.token}>{token}</Text>
          </>
        ) : null}
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton title="Register push token" onPress={register} loading={loading} />
      </View>
      <EmptyState title="No delivered notifications" message="Token registration is real. New-post delivery needs the Supabase Edge Function described in supabase/edge-functions-todo.md." />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  card: { backgroundColor: colors.surface, borderRadius: 18, gap: 10, margin: 16, padding: 16 },
  label: { color: colors.muted, fontSize: 12, fontWeight: "800", textTransform: "uppercase" },
  value: { color: colors.text, fontSize: 18, fontWeight: "900" },
  token: { color: colors.text, fontSize: 12, lineHeight: 18 },
  error: { color: colors.danger },
});
