import { supabase } from "./supabase";
import { getCurrentUser } from "./authService";

const POST_SELECT = `
  *,
  profiles:user_id(id, username, avatar_url),
  votes(value),
  comments(id),
  favorites(id, user_id)
`;

function normalizePost(post) {
  const score = (post.votes || []).reduce((sum, vote) => sum + vote.value, 0);
  return {
    ...post,
    author: post.profiles,
    vote_score: score,
    comment_count: post.comments?.length || 0,
    is_favorite: Boolean(post.favorites?.length),
  };
}

export async function getPosts() {
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return (data || []).map(normalizePost);
}

export async function getPost(postId) {
  const { data, error } = await supabase
    .from("posts")
    .select(POST_SELECT)
    .eq("id", postId)
    .single();
  if (error) throw error;
  return normalizePost(data);
}

export async function createPost({ title, message, imageUrl, latitude, longitude }) {
  const user = await getCurrentUser();
  if (!user) throw new Error("You must be logged in to create a post.");
  const { data, error } = await supabase
    .from("posts")
    .insert({
      user_id: user.id,
      title: title.trim(),
      message: message?.trim() || null,
      image_url: imageUrl,
      latitude,
      longitude,
      location_visible: true,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}
