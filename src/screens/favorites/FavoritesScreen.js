import { FlatList, SafeAreaView, StyleSheet } from "react-native";
import AppHeader from "../../components/common/AppHeader";
import EmptyState from "../../components/common/EmptyState";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import PostCard from "../../components/posts/PostCard";
import useFavorites from "../../hooks/useFavorites";
import { removeFavorite } from "../../services/favoriteService";
import colors from "../../constants/colors";
import routes from "../../constants/routes";

export default function FavoritesScreen({ navigation }) {
  const { favorites, loading, error, refresh } = useFavorites();

  async function remove(postId) {
    await removeFavorite(postId);
    refresh();
  }

  return (
    <SafeAreaView style={styles.screen}>
      <AppHeader title="Saved" subtitle="Online and offline favorites" />
      {loading ? (
        <LoadingState message="Loading saved posts..." />
      ) : error ? (
        <ErrorState message={error} onRetry={refresh} />
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.id}
          refreshing={loading}
          onRefresh={refresh}
          ListEmptyComponent={<EmptyState title="No favorites yet" message="Save posts to keep a local offline copy here." />}
          renderItem={({ item }) => (
            <PostCard
              post={{ ...item, is_favorite: true }}
              onPress={() => !item.offline && navigation.navigate(routes.PostDetail, { postId: item.id })}
              onFavorite={() => remove(item.id)}
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
