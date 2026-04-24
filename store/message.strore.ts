import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

interface Message {
  from: number | string;
  message: string;
  sender: {
    id: number | string;
    name: string;
  };
}

interface MessageState {
  chats: Record<string, any[]>;
  addMessageToChat: (chatId: string, message: any) => void;
  clearChat: (chatId: string) => void;
  deleteAll: () => void;
}

export const useMessageStore = create<MessageState>()(
  persist(
    (set, get) => ({
      chats: {},

      addMessageToChat: (chatId, message) => {
        const now = Date.now();
        set((state) => {
          const chatKey = String(chatId);
          const existing = state.chats[chatKey] || [];

          if (existing.some((m) => m.id === message.id)) return state;

          const msgWithTime = {
            ...message,
            localTimestamp: message.localTimestamp || now,
          };

          return {
            chats: {
              ...state.chats,
              [chatKey]: [...existing, msgWithTime].sort(
                (a, b) => b.localTimestamp - a.localTimestamp,
              ),
            },
          };
        });
      },

      clearChat: (chatId) =>
        set((state) => {
          const newChats = { ...state.chats };
          delete newChats[chatId];
          return { chats: newChats };
        }),

      deleteAll: () =>
        set(() => {
          return { chats: {} };
        }),
    }),
    {
      name: "chat-storage",
      storage: createJSONStorage(() => AsyncStorage)
    },
  ),
);
