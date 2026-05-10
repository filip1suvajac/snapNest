import AsyncStorage from "@react-native-async-storage/async-storage";
import { supabase } from "./supabase";
import { getCurrentUser } from "./authService";

const FAVORITES_KEY = "snapnest.offlineFavorites";

function cacheShape(post) {
  return {
    id: post.id,
    title: post.title,
    message: post.message,
    image_url: post.image_url,
    author_username: post.author?.username || post.profiles?.username || "Unknown",
    author_avatar: post.author?.avatar_url || post.profiles?.avatar_url || null,
    created_at: post.created_at,
    cached_at: new Date().toISOString(),
  };
}

async function readCache() {
  const raw = await AsyncStorage.getItem(FAVORITES_KEY);
  return raw ? JSON.parse(raw) : [];
}

async function writeCache(items) {
  await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(items));
}

export async function addFavorite(post) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Log in to save favorites.");
  const { error } = await supabase
    .from("favorites")
    .upsert({ post_id: post.id, user_id: user.id }, { onConflict: "post_id,user_id" });
  if (error) throw error;
  const cached = await readCache();
  await writeCache([cacheShape(post), ...cached.filter((item) => item.id !== post.id)]);
}

export async function removeFavorite(postId) {
  const user = await getCurrentUser();
  if (user) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("post_id", postId)
      .eq("user_id", user.id);
    if (error) throw error;
  }
  await writeCache((await readCache()).filter((item) => item.id !== postId));
}

export async function getFavorites() {
  const user = await getCurrentUser();
  if (!user) return getOfflineFavorites();
  const { data, error } = await supabase
    .from("favorites")
    .select("posts(*, profiles:user_id(id, username, avatar_url), votes(value), comments(id))")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });
  if (error) return getOfflineFavorites();
  const posts = (data || []).map((row) => {
    const post = row.posts;
    return {
      ...post,
      author: post.profiles,
      vote_score: (post.votes || []).reduce((sum, vote) => sum + vote.value, 0),
      comment_count: post.comments?.length || 0,
    };
  });
  await writeCache(posts.map(cacheShape));
  return posts;
}

export async function isFavorite(postId) {
  const user = await getCurrentUser();
  if (!user) return (await readCache()).some((item) => item.id === postId);
  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw error;
  return Boolean(data);
}

export async function getOfflineFavorites() {
  return (await readCache()).map((item) => ({
    ...item,
    author: { username: item.author_username, avatar_url: item.author_avatar },
    offline: true,
  }));
}
