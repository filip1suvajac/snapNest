import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import AppHeader from "../../components/common/AppHeader";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import PostCard from "../../components/posts/PostCard";
import usePosts from "../../hooks/usePosts";
import { addFavorite, removeFavorite } from "../../services/favoriteService";
import { votePost } from "../../services/voteService";
import routes from "../../constants/routes";
import colors from "../../constants/colors";

export default function HomeFeedScreen({ navigation }) {
  const { posts, loading, error, refresh } = usePosts();

  async function handleVote(post, value) {
    await votePost(post.id, value);
    refresh();
  }

  async function handleFavorite(post) {
    if (post.is_favorite) {
      await removeFavorite(post.id);
    } else {
      await addFavorite(post);
    }
    refresh();
  }

  return (
    <SafeAreaView style={styles.screen}>
      <AppHeader title="Home" subtitle="Newest shared photos" />
      {loading ? (
        <LoadingState message="Loading feed..." />
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        <FlatList
          data={posts}
          keyExtractor={(item) => item.id}
          refreshing={loading}
          onRefresh={refresh}
          ListEmptyComponent={<EmptyState title="No posts yet" message="Publish a photo from the Create tab." />}
          renderItem={({ item }) => (
            <PostCard
              post={item}
              onPress={() => navigation.navigate(routes.PostDetail, { postId: item.id })}
              onVote={(value) => handleVote(item, value)}
              onFavorite={() => handleFavorite(item)}
            />
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
});
