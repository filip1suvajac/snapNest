import { supabase } from "./supabase";
import { getCurrentUser } from "./authService";

export async function votePost(postId, value) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Log in to vote on posts.");
  const { error } = await supabase.from("votes").upsert(
    {
      post_id: postId,
      user_id: user.id,
      value,
    },
    { onConflict: "post_id,user_id" }
  );
  if (error) throw error;
}

export async function removeVote(postId) {
  const user = await getCurrentUser();
  if (!user) throw new Error("Log in to remove your vote.");
  const { error } = await supabase
    .from("votes")
    .delete()
    .eq("post_id", postId)
    .eq("user_id", user.id);
  if (error) throw error;
}

export async function getUserVote(postId) {
  const user = await getCurrentUser();
  if (!user) return null;
  const { data, error } = await supabase
    .from("votes")
    .select("value")
    .eq("post_id", postId)
    .eq("user_id", user.id)
    .maybeSingle();
  if (error) throw error;
  return data?.value ?? null;
}

export async function getPostScore(postId) {
  const { data, error } = await supabase
    .from("votes")
    .select("value")
    .eq("post_id", postId);
  if (error) throw error;
  return (data || []).reduce((sum, vote) => sum + vote.value, 0);
}
