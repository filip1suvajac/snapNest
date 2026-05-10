import { KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import PrimaryButton from "../../components/common/PrimaryButton";
import TextInputField from "../../components/common/TextInputField";
import { signUp } from "../../services/authService";
import { required, validateEmail, validatePassword } from "../../utils/validators";
import routes from "../../constants/routes";
import colors from "../../constants/colors";

export default function RegisterScreen({ navigation }) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    const validation = required(username, "Username") || validateEmail(email) || validatePassword(password);
    if (validation) return setError(validation);
    setLoading(true);
    setError("");
    try {
      await signUp(email, password, username);
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
        <Text style={styles.title}>Create your account</Text>
        <TextInputField label="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
        <TextInputField label="Email" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
        <TextInputField label="Password" value={password} onChangeText={setPassword} secureTextEntry />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton title="Register" onPress={submit} loading={loading} />
        <View style={styles.row}>
          <PrimaryButton title="I already have an account" variant="outline" onPress={() => navigation.navigate(routes.Login)} />
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
