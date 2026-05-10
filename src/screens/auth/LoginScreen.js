import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import PrimaryButton from "../../components/common/PrimaryButton";
import TextInputField from "../../components/common/TextInputField";
import { signIn } from "../../services/authService";
import { validateEmail } from "../../utils/validators";
import routes from "../../constants/routes";
import colors from "../../constants/colors";

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    const emailError = validateEmail(email);
    if (emailError) return setError(emailError);
    if (!password) return setError("Password is required.");
    setLoading(true);
    setError("");
    try {
      await signIn(email, password);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : undefined} style={styles.wrap}>
        <Text style={styles.logo}>SnapNest</Text>
        <Text style={styles.title}>Welcome back</Text>
        <TextInputField label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInputField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton title="Log in" onPress={submit} loading={loading} />
        <View style={styles.row}>
          <PrimaryButton title="Create account" variant="outline" onPress={() => navigation.navigate(routes.Register)} />
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  wrap: { flex: 1, gap: 14, justifyContent: "center", padding: 22 },
  logo: { color: colors.primary, fontSize: 18, fontWeight: "900" },
  title: { color: colors.text, fontSize: 30, fontWeight: "900", marginBottom: 8 },
  error: { color: colors.danger },
  row: { marginTop: 4 },
});
