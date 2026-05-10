import { StyleSheet, Text, View } from "react-native";
import Avatar from "../common/Avatar";
import colors from "../../constants/colors";

export default function ProfileHeader({ profile }) {
  return (
    <View style={styles.wrap}>
      <Avatar uri={profile?.avatar_url} name={profile?.username} size={84} />
      <Text style={styles.name}>{profile?.username || "Profile"}</Text>
      {profile?.bio ? <Text style={styles.bio}>{profile.bio}</Text> : <Text style={styles.bio}>No bio yet.</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { alignItems: "center", gap: 8, padding: 20 },
  name: { color: colors.text, fontSize: 24, fontWeight: "900" },
  bio: { color: colors.muted, lineHeight: 20, textAlign: "center" },
});
