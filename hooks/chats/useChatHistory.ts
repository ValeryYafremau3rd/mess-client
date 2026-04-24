import { useMessageStore } from "@/store/message.strore";

const EMTY_ARRAY = [];

export const useChatHistory = (id: string) => {
  const messages = useMessageStore(
    (state) => state.chats[id] || EMTY_ARRAY,
  );

  return {
    messages
  };
};
