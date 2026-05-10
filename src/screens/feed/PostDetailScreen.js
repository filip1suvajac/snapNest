import { Image, SafeAreaView, ScrollView, StyleSheet, Text, View } from "react-native";
import { useEffect, useState } from "react";
import CommentInput from "../../components/comments/CommentInput";
import CommentList from "../../components/comments/CommentList";
import Avatar from "../../components/common/Avatar";
import ErrorState from "../../components/common/ErrorState";
import LoadingState from "../../components/common/LoadingState";
import PrimaryButton from "../../components/common/PrimaryButton";
import FavoriteButton from "../../components/posts/FavoriteButton";
import VoteButtons from "../../components/posts/VoteButtons";
import useSession from "../../hooks/useSession";
import { createComment, getComments } from "../../services/commentService";
import { addFavorite, removeFavorite } from "../../services/favoriteService";
import { getPost } from "../../services/postService";
import { getUserVote, votePost } from "../../services/voteService";
import colors from "../../constants/colors";
import routes from "../../constants/routes";
import { formatDate } from "../../utils/formatDate";

export default function PostDetailScreen({ navigation, route }) {
  const { postId } = route.params;
  const { session } = useSession();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [userVote, setUserVote] = useState(null);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const requireLogin = () => navigation.navigate("Auth", { screen: routes.Login });

  async function load() {
    setLoading(true);
    setError("");
    try {
      const [nextPost, nextComments, nextVote] = await Promise.all([
        getPost(postId),
        getComments(postId),
        getUserVote(postId),
      ]);
      setPost(nextPost);
      setComments(nextComments);
      setUserVote(nextVote);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, [postId]);

  async function handleVote(value) {
    if (!session) return requireLogin();
    await votePost(postId, value);
    load();
  }

  async function handleFavorite() {
    if (!session) return requireLogin();
    if (post.is_favorite) await removeFavorite(post.id);
    else await addFavorite(post);
    load();
  }

  async function handleComment() {
    if (!session) return requireLogin();
    setSubmitting(true);
    try {
      await createComment(postId, comment);
      setComment("");
      setComments(await getComments(postId));
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) return <LoadingState message="Opening post..." />;
  if (error && !post) return <ErrorState message={error} onRetry={load} />;

  const author = post.author || {};
  return (
    <SafeAreaView style={styles.screen}>
      <ScrollView>
        <Image source={{ uri: post.image_url }} style={styles.hero} />
        <View style={styles.content}>
          <View style={styles.authorRow}>
            <Avatar uri={author.avatar_url} name={author.username} size={42} />
            <View style={styles.authorText}>
              <Text style={styles.author}>{author.username || "Unknown"}</Text>
              <Text style={styles.date}>{formatDate(post.created_at)}</Text>
            </View>
            <FavoriteButton active={post.is_favorite} onPress={handleFavorite} />
          </View>
          <Text style={styles.title}>{post.title}</Text>
          {post.message ? <Text style={styles.message}>{post.message}</Text> : null}
          {post.latitude && post.longitude && post.location_visible ? (
            <Text style={styles.location}>Location saved: {post.latitude.toFixed(4)}, {post.longitude.toFixed(4)}</Text>
          ) : null}
          <VoteButtons score={post.vote_score || 0} userVote={userVote} onVote={handleVote} />
          {error ? <Text style={styles.error}>{error}</Text> : null}
        </View>
        <Text style={styles.sectionTitle}>Comments</Text>
        <CommentList comments={comments} />
        {session ? (
          <CommentInput value={comment} onChangeText={setComment} onSubmit={handleComment} loading={submitting} />
        ) : (
          <View style={styles.loginBox}>
            <PrimaryButton title="Log in to comment" onPress={requireLogin} />
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: { backgroundColor: colors.background, flex: 1 },
  hero: { aspectRatio: 1, backgroundColor: colors.border, width: "100%" },
  content: { backgroundColor: colors.surface, gap: 14, padding: 18 },
  authorRow: { alignItems: "center", flexDirection: "row", gap: 10 },
  authorText: { flex: 1 },
  author: { color: colors.text, fontWeight: "900" },
  date: { color: colors.muted, fontSize: 12, marginTop: 2 },
  title: { color: colors.text, fontSize: 26, fontWeight: "900" },
  message: { color: colors.text, fontSize: 16, lineHeight: 24 },
  location: { color: colors.muted, fontSize: 13 },
  sectionTitle: { color: colors.text, fontSize: 20, fontWeight: "900", padding: 16 },
  loginBox: { padding: 16 },
  error: { color: colors.danger },
});
