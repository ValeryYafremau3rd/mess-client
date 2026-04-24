import React from "react";
import { FlatList, StyleSheet, View } from "react-native";
import ChatListItem from "./chat-item-list.component";

export function ChatList({
  chats,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
}) {
  return (
    <View style={styles.container}>
      <FlatList
        data={chats || []}
        keyExtractor={(item) => `contact-${item.id}`}
        renderItem={({ item }) => <ChatListItem item={item} />}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center" },
  header: { fontSize: 22, fontWeight: "bold", padding: 20, color: "#333" },
});
