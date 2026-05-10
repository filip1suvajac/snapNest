import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import { useCallback, useState } from "react";
import { useFocusEffect } from "@react-navigation/native";
import AppHeader from "../../components/common/AppHeader";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import PrimaryButton from "../../components/common/PrimaryButton";
import PostCard from "../../components/posts/PostCard";
import ProfileHeader from "../../components/profile/ProfileHeader";
import ProfileStats from "../../components/profile/ProfileStats";
import useSession from "../../hooks/useSession";
import { signOut } from "../../services/authService";
import { getProfile, getProfileStats, getUserPosts } from "../../services/profileService";
import colors from "../../constants/colors";
import routes from "../../constants/routes";

export default function ProfileScreen({ navigation }) {
  const { user } = useSession();
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function load() {
    if (!user) return;
    setLoading(true);
    setError("");
    try {
      const [nextProfile, nextStats, nextPosts] = await Promise.all([
        getProfile(user.id),
        getProfileStats(user.id),
        getUserPosts(user.id),
      ]);
      setProfile(nextProfile);
      setStats(nextStats);
      setPosts(nextPosts);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useFocusEffect(useCallback(() => { load(); }, [user?.id]));

  async function logout() {
    await signOut();
  }

  if (loading) return <LoadingState message="Loading profile..." />;
  if (error) return <ErrorState message={error} onRetry={load} />;

  return (
    <SafeAreaView style={styles.screen}>
      <AppHeader title="Profile" subtitle="Your SnapNest activity" />
      <FlatList
        data={posts}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={
          <>
            <ProfileHeader profile={profile} />
            <ProfileStats stats={stats} />
            <View style={styles.actions}>
              <PrimaryButton title="Edit profile" onPress={() => navigation.navigate(routes.EditProfile, { profile })} />
              <PrimaryButton title="Log out" variant="outline" onPress={logout} />
            </View>
          </>
        }
        ListEmptyComponent={<EmptyState title="No posts yet" message="Your published photos will appear here." />}
        renderItem={({ item }) => (
          <PostCard post={item} showActions={false} onPress={() => navigation.navigate(routes.PostDetail, { postId: item.id })} />
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  actions: { gap: 10, padding: 16 },
});
