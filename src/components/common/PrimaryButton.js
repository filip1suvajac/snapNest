import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import colors from "../../constants/colors";

export default function PrimaryButton({ title, onPress, disabled, loading, variant = "primary" }) {
  const outline = variant === "outline";
  return (
    <Pressable
      onPress={onPress}
      disabled={disabled || loading}
      style={({ pressed }) => [
        styles.button,
        outline && styles.outline,
        (disabled || loading) && styles.disabled,
        pressed && styles.pressed,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={outline ? colors.primary : colors.surface} />
      ) : (
        <Text style={[styles.text, outline && styles.outlineText]}>{title}</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingHorizontal: 18,
    paddingVertical: 13,
  },
  outline: {
    backgroundColor: colors.surface,
    borderColor: colors.primary,
    borderWidth: 1,
  },
  disabled: {
    opacity: 0.55,
  },
  pressed: {
    opacity: 0.85,
  },
  text: {
    color: colors.surface,
    fontSize: 15,
    fontWeight: "700",
  },
  outlineText: {
    color: colors.primary,
  },
});
