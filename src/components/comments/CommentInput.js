import { StyleSheet, View } from "react-native";
import PrimaryButton from "../common/PrimaryButton";
import TextInputField from "../common/TextInputField";

export default function CommentInput({ value, onChangeText, onSubmit, loading }) {
  return (
    <View style={styles.wrap}>
      <TextInputField
        value={value}
        onChangeText={onChangeText}
        placeholder="Write a comment..."
        multiline
      />
      <PrimaryButton title="Post comment" onPress={onSubmit} loading={loading} disabled={!value?.trim()} />
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 10, padding: 16 },
});
