import React from "react";
import { FlatList, StyleSheet } from "react-native";
import ChatMessageBubble from "./chat-message-bubble.components";

export default function ChatMessageList({
  messages,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}) {
  return (
    <FlatList
      data={messages.sort((a, b) => b.timestamp - a.timestamp)}
      renderItem={({ item }) => <ChatMessageBubble message={item} />}
      contentContainerStyle={styles.listContent}
      inverted
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.2}
    />
  );
}
const styles = StyleSheet.create({
  listContent: { padding: 10 },
});
