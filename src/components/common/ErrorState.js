import { StyleSheet, Text, View } from "react-native";
import PrimaryButton from "./PrimaryButton";
import colors from "../../constants/colors";

export default function ErrorState({ message, onRetry }) {
  return (
    <View style={styles.state}>
      <Text style={styles.title}>Something went wrong</Text>
      <Text style={styles.message}>{message}</Text>
      {onRetry ? <PrimaryButton title="Try again" onPress={onRetry} variant="outline" /> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  state: { gap: 10, padding: 24 },
  title: { color: colors.danger, fontSize: 16, fontWeight: "800", textAlign: "center" },
  message: { color: colors.muted, textAlign: "center" },
});
