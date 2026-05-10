import { Pressable, StyleSheet, Text } from "react-native";
import colors from "../../constants/colors";

export default function FavoriteButton({ active, onPress }) {
  return (
    <Pressable onPress={onPress} style={[styles.button, active && styles.active]}>
      <Text style={[styles.text, active && styles.activeText]}>{active ? "Saved" : "Save"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderWidth: 1,
    paddingHorizontal: 13,
    paddingVertical: 8,
  },
  active: { backgroundColor: "#DBEAFE", borderColor: "#BFDBFE" },
  text: { color: colors.muted, fontWeight: "800" },
  activeText: { color: colors.primaryDark },
});
