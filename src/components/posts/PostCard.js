import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import Avatar from "../common/Avatar";
import FavoriteButton from "./FavoriteButton";
import VoteButtons from "./VoteButtons";
import colors from "../../constants/colors";
import { formatDate } from "../../utils/formatDate";

export default function PostCard({ post, onPress, onVote, onFavorite, showActions = true }) {
  const author = post.author || post.profiles || {};
  return (
    <Pressable onPress={onPress} style={styles.card}>
      <Image source={{ uri: post.image_url }} style={styles.image} />
      <View style={styles.body}>
        <View style={styles.authorRow}>
          <Avatar uri={author.avatar_url} name={author.username} size={34} />
          <View style={styles.authorText}>
            <Text style={styles.author}>{author.username || "Unknown"}</Text>
            <Text style={styles.date}>{formatDate(post.created_at)}</Text>
          </View>
          {post.offline ? <Text style={styles.badge}>Offline</Text> : null}
        </View>
        <Text style={styles.title}>{post.title}</Text>
        {post.message ? <Text numberOfLines={2} style={styles.message}>{post.message}</Text> : null}
        <View style={styles.metaRow}>
          <Text style={styles.meta}>{post.comment_count || 0} comments</Text>
          {showActions ? (
            <View style={styles.actions}>
              {onVote ? <VoteButtons score={post.vote_score || 0} userVote={post.user_vote} onVote={onVote} /> : null}
              {onFavorite ? <FavoriteButton active={post.is_favorite} onPress={onFavorite} /> : null}
            </View>
          ) : (
            <Text style={styles.score}>{post.vote_score || 0} votes</Text>
          )}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    marginHorizontal: 16,
    marginVertical: 9,
    overflow: "hidden",
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 3,
  },
  image: { aspectRatio: 1.15, backgroundColor: colors.border, width: "100%" },
  body: { gap: 10, padding: 14 },
  authorRow: { alignItems: "center", flexDirection: "row", gap: 10 },
  authorText: { flex: 1 },
  author: { color: colors.text, fontWeight: "800" },
  date: { color: colors.muted, fontSize: 12, marginTop: 1 },
  badge: {
    backgroundColor: "#ECFDF5",
    borderRadius: 10,
    color: colors.success,
    fontSize: 12,
    fontWeight: "800",
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  title: { color: colors.text, fontSize: 19, fontWeight: "900" },
  message: { color: colors.muted, lineHeight: 20 },
  metaRow: { alignItems: "center", flexDirection: "row", justifyContent: "space-between" },
  meta: { color: colors.muted, fontSize: 13 },
  score: { color: colors.text, fontWeight: "800" },
  actions: { alignItems: "center", flexDirection: "row", gap: 10 },
});
