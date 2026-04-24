import { QUERY_KEYS } from "@/api/query-keys.constants";
import { getUserById } from "@/api/rest/users.api";
import { sendMessage } from "@/api/websocket/messages";
import ChatMessageList from "@/components/chat/chat-message-list.component";
import InputMessage from "@/components/input-message.component";
import { useChatHistory } from "@/hooks/chats/useChatHistory";
import useAuthStore from "@/store/account.store";
import { useMessageStore } from "@/store/message.strore";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import { useMemo } from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ChatScreenPage() {
  const { id } = useLocalSearchParams();
  const chatId = String(id);

  const { data: chat } = useQuery({
    queryKey: [QUERY_KEYS.REST.CHAT, id],
    queryFn: () => getUserById(Number(id)),
    enabled: !!id,
  });

  const user = useAuthStore((state) => state.account);
  const addMessageToChat = useMessageStore((state) => state.addMessageToChat);

  const { messages } = useChatHistory(chatId);

  const formattedMessages = useMemo(() => {
    return messages.map((item) => ({
      ...item,
      sender: {
        id: item.sender?.id,
        name: String(item.from) === chatId ? item.sender?.name : "Me",
      },
    }));
  }, [messages, chatId]);

  const handleSendMessage = async (text: string) => {
    try {
      const optimisticMsg = await sendMessage(user, chatId, text);
      addMessageToChat(String(id), optimisticMsg);
    } catch (err) {
      console.error("Failed to send", err);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerText}>{chat?.name}</Text>
      </View>

      <ChatMessageList
        messages={formattedMessages}
        hasNextPage={false}
        isFetchingNextPage={false}
        fetchNextPage={() => {}}
      />

      <InputMessage sendMessage={handleSendMessage} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  header: {
    padding: 20,
    paddingTop: 50,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  headerText: {
    fontWeight: "bold",
    fontSize: 16,
  },
});
