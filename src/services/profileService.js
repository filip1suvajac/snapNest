import { supabase } from "./supabase";
import { getCurrentUser } from "./authService";

export async function getProfile(userId) {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) throw error;
  return data;
}

export async function updateProfile({ username, bio, avatarUrl }) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Log in to update your profile.");
  const { data, error } = await supabase
    .from("profiles")
    .update({
      username: username.trim(),
      bio: bio?.trim() || null,
      avatar_url: avatarUrl || null,
    })
    .eq("id", user.id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function getProfileStats(userId) {
  const [{ data: posts }, { data: comments }, { data: votes }] = await Promise.all([
    supabase.from("posts").select("id").eq("user_id", userId),
    supabase.from("comments").select("id").eq("user_id", userId),
    supabase
      .from("votes")
      .select("value, posts!inner(user_id)")
      .eq("posts.user_id", userId)
      .eq("value", 1),
  ]);
  return {
    posts: posts?.length || 0,
    likes: votes?.length || 0,
    comments: comments?.length || 0,
  };
}

export async function getUserPosts(userId) {
  const { data, error } = await supabase
    .from("posts")
    .select("*, profiles:user_id(id, username, avatar_url), votes(value), comments(id)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map((post) => ({
    ...post,
    author: post.profiles,
    vote_score: (post.votes || []).reduce((sum, vote) => sum + vote.value, 0),
    comment_count: post.comments?.length || 0,
  }));
}
