import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import AppHeader from "../../components/common/AppHeader";
import PrimaryButton from "../../components/common/PrimaryButton";
import TextInputField from "../../components/common/TextInputField";
import { getCurrentUser } from "../../services/authService";
import { updateProfile } from "../../services/profileService";
import { uploadImage } from "../../services/storageService";
import colors from "../../constants/colors";

export default function EditProfileScreen({ navigation, route }) {
  const profile = route.params?.profile || {};
  const [username, setUsername] = useState(profile.username || "");
  const [bio, setBio] = useState(profile.bio || "");
  const [avatarUri, setAvatarUri] = useState(profile.avatar_url || "");
  const [localAvatar, setLocalAvatar] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function chooseAvatar() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") return setError("Gallery permission is required.");
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.8, allowsEditing: true });
    if (!result.canceled) {
      setLocalAvatar(result.assets[0]);
      setAvatarUri(result.assets[0].uri);
    }
  }

  async function save() {
    if (!username.trim()) return setError("Username is required.");
    setLoading(true);
    setError("");
    try {
      const user = await getCurrentUser();
      const avatarUrl = localAvatar ? await uploadImage("avatars", user.id, localAvatar.uri) : avatarUri;
      await updateProfile({ username, bio, avatarUrl });
      navigation.goBack();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <AppHeader title="Edit" subtitle="Update your public profile" />
      <ScrollView contentContainerStyle={styles.content}>
        {avatarUri ? <Image source={{ uri: avatarUri }} style={styles.avatar} /> : <View style={styles.avatarPlaceholder} />}
        <PrimaryButton title="Change avatar" onPress={chooseAvatar} variant="outline" />
        <TextInputField label="Username" value={username} onChangeText={setUsername} autoCapitalize="none" />
        <TextInputField label="Bio" value={bio} onChangeText={setBio} multiline placeholder="A short profile bio" />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton title="Save changes" onPress={save} loading={loading} disabled={!username.trim()} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { alignItems: "center", gap: 14, padding: 16 },
  avatar: { borderRadius: 54, height: 108, width: 108 },
  avatarPlaceholder: { backgroundColor: colors.border, borderRadius: 54, height: 108, width: 108 },
  error: { alignSelf: "stretch", color: colors.danger },
});
