import { supabase } from "./supabase";

export async function signUp(email, password, username) {
  const { data, error } = await supabase.auth.signUp({
    email: email.trim(),
    password,
  });
  if (error) throw error;
  const user = data.user;
  if (user) {
    const { error: profileError } = await supabase.from("profiles").insert({
      id: user.id,
      username: username.trim(),
      avatar_url: null,
      bio: null,
    });
    if (profileError) throw profileError;
  }
  return data;
}

export async function signIn(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password,
  });
  if (error) throw error;
  return data;
}

export async function signOut() {
  const { error } = await supabase.auth.signOut();
  if (error) throw error;
}

export async function getCurrentSession() {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw error;
  return data.session;
}

export async function getCurrentUser() {
  const session = await getCurrentSession();
  if (!session) return null;
  const { data, error } = await supabase.auth.getUser();
  if (error) throw error;
  return data.user;
}
