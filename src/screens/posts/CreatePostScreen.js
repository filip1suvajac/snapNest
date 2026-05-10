import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import AppHeader from "../../components/common/AppHeader";
import PrimaryButton from "../../components/common/PrimaryButton";
import TextInputField from "../../components/common/TextInputField";
import { getCurrentUser } from "../../services/authService";
import { getOptionalLocation } from "../../services/locationService";
import { createPost } from "../../services/postService";
import { uploadImage, uploadPostImage } from "../../services/storageService";
import colors from "../../constants/colors";
import routes from "../../constants/routes";

export default function CreatePostScreen({ navigation }) {
  const [image, setImage] = useState(null);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function pickImage(fromCamera) {
    const permission = fromCamera
      ? await ImagePicker.requestCameraPermissionsAsync()
      : await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (permission.status !== "granted") {
      setError(fromCamera ? "Camera permission is required." : "Gallery permission is required.");
      return;
    }
    const result = fromCamera
      ? await ImagePicker.launchCameraAsync({ quality: 0.85, allowsEditing: true })
      : await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 0.85, allowsEditing: true });
    if (!result.canceled) setImage(result.assets[0]);
  }

  async function publish() {
    if (!image?.uri) return setError("Image is required.");
    if (!title.trim()) return setError("Title is required.");
    setLoading(true);
    setError("");
    try {
      const user = await getCurrentUser();
      const location = await getOptionalLocation();
      const imageUrl = await uploadPostImage(user.id, image.uri);
      const post = await createPost({
        title,
        message,
        imageUrl,
        latitude: location?.latitude ?? null,
        longitude: location?.longitude ?? null,
      });
      setImage(null);
      setTitle("");
      setMessage("");
      navigation.navigate(routes.PostDetail, { postId: post.id });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.screen}>
      <AppHeader title="Create" subtitle="Publish a new photo" />
      <ScrollView contentContainerStyle={styles.content}>
        {image ? <Image source={{ uri: image.uri }} style={styles.preview} /> : <View style={styles.placeholder}><Text style={styles.placeholderText}>Choose or take a photo</Text></View>}
        <View style={styles.row}>
          <PrimaryButton title="Camera" onPress={() => pickImage(true)} variant="outline" />
          <PrimaryButton title="Gallery" onPress={() => pickImage(false)} variant="outline" />
        </View>
        <TextInputField label="Title" value={title} onChangeText={setTitle} placeholder="A clear photo title" />
        <TextInputField label="Message" value={message} onChangeText={setMessage} placeholder="Add a short description" multiline />
        {error ? <Text style={styles.error}>{error}</Text> : null}
        <PrimaryButton title="Publish post" onPress={publish} loading={loading} disabled={!image || !title.trim()} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  content: { gap: 14, padding: 16 },
  preview: { aspectRatio: 1, backgroundColor: colors.border, borderRadius: 18, width: "100%" },
  placeholder: {
    alignItems: "center",
    aspectRatio: 1.25,
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderRadius: 18,
    borderStyle: "dashed",
    borderWidth: 1,
    justifyContent: "center",
  },
  placeholderText: { color: colors.muted, fontWeight: "700" },
  row: { flexDirection: "row", gap: 10 },
  error: { color: colors.danger },
});
