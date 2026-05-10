import { Image, StyleSheet, Text, View } from "react-native";
import colors from "../../constants/colors";

export default function Avatar({ uri, name = "U", size = 42 }) {
  const initial = name?.slice(0, 1)?.toUpperCase() || "U";
  if (uri) {
    return <Image source={{ uri }} style={[styles.avatar, { width: size, height: size, borderRadius: size / 2 }]} />;
  }
  return (
    <View style={[styles.fallback, { width: size, height: size, borderRadius: size / 2 }]}>
      <Text style={[styles.initial, { fontSize: size * 0.4 }]}>{initial}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: { backgroundColor: colors.border },
  fallback: {
    alignItems: "center",
    backgroundColor: "#DBEAFE",
    justifyContent: "center",
  },
  initial: { color: colors.primaryDark, fontWeight: "800" },
});
