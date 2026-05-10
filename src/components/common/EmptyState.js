import { StyleSheet, Text, View } from "react-native";
import colors from "../../constants/colors";

export default function EmptyState({ title, message }) {
  return (
    <View style={styles.state}>
      <Text style={styles.title}>{title}</Text>
      {message ? <Text style={styles.message}>{message}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  state: { alignItems: "center", padding: 30 },
  title: { color: colors.text, fontSize: 17, fontWeight: "800" },
  message: { color: colors.muted, marginTop: 6, textAlign: "center" },
});
