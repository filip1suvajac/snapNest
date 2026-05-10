import { StyleSheet, Text, View } from "react-native";
import colors from "../../constants/colors";

export default function ProfileStats({ stats }) {
  const items = [
    ["Posts", stats?.posts || 0],
    ["Likes", stats?.likes || 0],
    ["Comments", stats?.comments || 0],
  ];
  return (
    <View style={styles.card}>
      {items.map(([label, value]) => (
        <View key={label} style={styles.item}>
          <Text style={styles.value}>{value}</Text>
          <Text style={styles.label}>{label}</Text>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    flexDirection: "row",
    justifyContent: "space-around",
    marginHorizontal: 16,
    padding: 16,
  },
  item: { alignItems: "center", gap: 4 },
  value: { color: colors.text, fontSize: 20, fontWeight: "900" },
  label: { color: colors.muted, fontSize: 12, fontWeight: "700" },
});
