import { StyleSheet, Text, View } from "react-native";
import LoadingState from "../components/common/LoadingState";
import colors from "../constants/colors";

export default function SplashScreen() {
  return (
    <View style={styles.screen}>
      <Text style={styles.logo}>SnapNest</Text>
      <LoadingState message="Checking your session..." />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { alignItems: "center", backgroundColor: colors.background, flex: 1, justifyContent: "center" },
  logo: { color: colors.primary, fontSize: 34, fontWeight: "900" },
});
