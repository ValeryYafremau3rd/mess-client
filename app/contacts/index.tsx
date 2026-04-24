import { ChatList } from "@/components/chat/chat-list.component";
import Search from "@/components/search.component";
import useContacts from "@/hooks/contacts/useContacts";
import useSearchUsers from "@/hooks/useSearchUsers";
import React from "react";
import { StyleSheet, View } from "react-native";

export default function ContactListPage() {
  const { data: contacts } = useContacts();
  const {
    data: searchResults,
    setQuery,
    query,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useSearchUsers();

  const isSearching = query.trim().length > 0;

  return (
    <View style={styles.container}>
      <Search searchTerm={setQuery} />
      <View style={styles.content}>
        <ChatList
          chats={isSearching ? (isLoading ? [] : searchResults) : contacts}
          hasNextPage={isSearching && hasNextPage}
          isFetchingNextPage={isFetchingNextPage}
          fetchNextPage={fetchNextPage}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
  },
});
