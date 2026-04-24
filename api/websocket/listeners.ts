import useAuthStore from "@/store/account.store";
import { useMessageStore } from "@/store/message.strore";
import { Socket } from "socket.io-client";
import {
  generateAndRegisterKeys,
  replenishPreKeys,
  decryptPayload,
} from "./signal/signal";

const prekeysCount = 5;

export const listen = function (socket: Socket) {
  const addMessageToChat = useMessageStore.getState().addMessageToChat;

  socket.on("REQUEST_REGISTRATION", async (_data: any) => {
    try {
      const userId = useAuthStore.getState().account?.id;
      await generateAndRegisterKeys(userId, 1, prekeysCount);
    } catch (err) {
      console.error("Registration error:", err);
    }
  });

  socket.on("REQUEST_PREKEYS", async (data: any) => {
    try {
      const userId = useAuthStore.getState().account?.id;

      await replenishPreKeys(userId, data.lastKeyId, prekeysCount);
    } catch (err) {
      console.error("Key generation error:", err);
    }
  });

  socket.on("MESSAGE", async (data: any) => {
    try {
      const decrypted = await decryptPayload(data.payload, data.from);
      addMessageToChat(decrypted.from, decrypted);
    } catch (err) {
      console.error("Message decryption error:", err);
    }
  });

  socket.on("PENDING_MESSAGES", async (data: any[]) => {
    try {
      for (const message of data) {
        const decrypted = await decryptPayload(message.payload, message.from);
        addMessageToChat(decrypted.from, decrypted);
      }
    } catch (err) {
      console.error("Pending messages decryption error:", err);
    }
  });
};
