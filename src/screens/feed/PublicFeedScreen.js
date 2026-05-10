import { FlatList, SafeAreaView, StyleSheet, View } from "react-native";
import AppHeader from "../../components/common/AppHeader";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import PrimaryButton from "../../components/common/PrimaryButton";
import PostCard from "../../components/posts/PostCard";
import usePosts from "../../hooks/usePosts";
import routes from "../../constants/routes";
import colors from "../../constants/colors";

export default function PublicFeedScreen({ navigation }) {
  const { posts, loading, error, refresh } = usePosts();
  const goLogin = () => navigation.navigate(routes.Login);

  return (
    <SafeAreaView style={styles.screen}>
      <AppHeader
        title="SnapNest"
        subtitle="Public photo feed"
        right={
          <View style={styles.authRow}>
            <PrimaryButton title="Log in" onPress={goLogin} />
          </View>
        }
      />
      {loading ? (
        <LoadingState message="Loading photos..." />
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          refreshing={loading}
          onRefresh={refresh}
          ListEmptyComponent={<EmptyState title="No posts yet" message="Create an account to publish the first photo." />}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              showActions={false}
              onPress={() => navigation.navigate(routes.PostDetail, { postId: item.id })}
              onVote={goLogin}
              onFavorite={goLogin}
            />
          )}
        />
      )}
      <View style={styles.footer}>
        <PrimaryButton title="Create account" onPress={() => navigation.navigate(routes.Register)} variant="outline" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  authRow: { width: 90 },
  footer: { padding: 16 },
});
