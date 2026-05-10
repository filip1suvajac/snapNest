import { decode } from "base64-arraybuffer";
import * as FileSystem from "expo-file-system/legacy";
import { supabase } from "./supabase";

function extensionFromUri(uri) {
  if (!uri) return "jpg";

  const cleanUri = uri.split("?")[0];
  const ext = cleanUri.split(".").pop()?.toLowerCase();

  if (!ext || ext.length > 5) return "jpg";

  return ext;
}

function contentTypeFromExtension(ext) {
  if (ext === "png") return "image/png";
  if (ext === "webp") return "image/webp";
  if (ext === "heic") return "image/heic";
  if (ext === "heif") return "image/heif";
  return "image/jpeg";
}

export async function uploadImage(bucket, userId, uri) {
  if (!bucket) throw new Error("Storage bucket is missing.");
  if (!userId) throw new Error("User ID is missing.");
  if (!uri) throw new Error("Image URI is missing.");

  const fileInfo = await FileSystem.getInfoAsync(uri);

  if (!fileInfo.exists) {
    throw new Error("Image file does not exist.");
  }

  if (fileInfo.size === 0) {
    throw new Error("Image file is empty.");
  }

  const extension = extensionFromUri(uri);
  const contentType = contentTypeFromExtension(extension);
  const path = `${userId}/${Date.now()}.${extension}`;

  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });

  if (!base64 || base64.length < 100) {
    throw new Error("Image file could not be read correctly.");
  }

  const arrayBuffer = decode(base64);

  const { error } = await supabase.storage.from(bucket).upload(path, arrayBuffer, {
    contentType,
    upsert: true,
  });

  if (error) throw error;

  const { data } = supabase.storage.from(bucket).getPublicUrl(path);

  return data.publicUrl;
}

export function uploadPostImage(userId, uri) {
  return uploadImage("post-images", userId, uri);
}

export function uploadAvatar(userId, uri) {
  return uploadImage("avatars", userId, uri);
}