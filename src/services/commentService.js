import { supabase } from "./supabase";
import { getCurrentUser } from "./authService";

export async function getComments(postId) {
  const { data, error } = await supabase
    .from("comments")
    .select("*, profiles:user_id(id, username, avatar_url)")
    .eq("post_id", postId)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createComment(postId, content) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Log in to comment.");
  if (!content?.trim()) throw new Error("Comment cannot be empty.");
  const { data, error } = await supabase
    .from("comments")
    .insert({ post_id: postId, user_id: user.id, content: content.trim() })
    .select("*, profiles:user_id(id, username, avatar_url)")
    .single();
  if (error) throw error;
  return data;
}

export async function deleteComment(commentId) {
  const { error } = await supabase.from("comments").delete().eq("id", commentId);
  if (error) throw error;
}
