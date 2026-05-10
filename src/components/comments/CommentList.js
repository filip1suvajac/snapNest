import { StyleSheet, Text, View } from "react-native";
import Avatar from "../common/Avatar";
import EmptyState from "../common/EmptyState";
import colors from "../../constants/colors";
import { formatDate } from "../../utils/formatDate";

export default function CommentList({ comments }) {
  if (!comments?.length) {
    return <EmptyState title="No comments yet" message="Be the first to respond." />;
  }
  return (
    <View style={styles.list}>
      {comments.map((comment) => (
        <View key={comment.id} style={styles.comment}>
          <Avatar uri={comment.profiles?.avatar_url} name={comment.profiles?.username} size={34} />
          <View style={styles.bubble}>
            <View style={styles.row}>
              <Text style={styles.name}>{comment.profiles?.username || "Unknown"}</Text>
              <Text style={styles.date}>{formatDate(comment.created_at)}</Text>
            </View>
            <Text style={styles.content}>{comment.content}</Text>
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  list: { gap: 12, padding: 16 },
  comment: { flexDirection: "row", gap: 10 },
  bubble: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    flex: 1,
    padding: 12,
  },
  row: { flexDirection: "row", justifyContent: "space-between", gap: 8 },
  name: { color: colors.text, fontWeight: "800" },
  date: { color: colors.muted, fontSize: 12 },
  content: { color: colors.text, lineHeight: 20, marginTop: 6 },
});
