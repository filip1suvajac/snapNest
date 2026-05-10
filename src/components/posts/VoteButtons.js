import { Pressable, StyleSheet, Text, View } from "react-native";
import colors from "../../constants/colors";

export default function VoteButtons({ score = 0, userVote, onVote }) {
  return (
    <View style={styles.row}>
      <Pressable onPress={() => onVote?.(1)} style={[styles.button, userVote === 1 && styles.active]}>
        <Text style={[styles.icon, userVote === 1 && styles.activeText]}>+</Text>
      </Pressable>
      <Text style={styles.score}>{score}</Text>
      <Pressable onPress={() => onVote?.(-1)} style={[styles.button, userVote === -1 && styles.active]}>
        <Text style={[styles.icon, userVote === -1 && styles.activeText]}>-</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  row: { alignItems: "center", flexDirection: "row", gap: 9 },
  button: {
    alignItems: "center",
    backgroundColor: "#EFF6FF",
    borderRadius: 20,
    height: 36,
    justifyContent: "center",
    width: 36,
  },
  active: { backgroundColor: colors.primary },
  icon: { color: colors.primary, fontSize: 22, fontWeight: "900", lineHeight: 24 },
  activeText: { color: colors.surface },
  score: { color: colors.text, fontWeight: "800", minWidth: 24, textAlign: "center" },
});
