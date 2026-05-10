import { ActivityIndicator, StyleSheet, Text, View } from "react-native";
import colors from "../../constants/colors";

export default function LoadingState({ message = "Loading..." }) {
  return (
    <View style={styles.state}>
      <ActivityIndicator color={colors.primary} />
      <Text style={styles.text}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  state: { alignItems: "center", gap: 10, padding: 28 },
  text: { color: colors.muted },
});
