import { socket } from "./client";
import { encryptPayload } from "./signal/signal";

export async function sendMessage(from: any, to: string, message: string) {
  const messageMetadata = {
    from: from.id,
    sender: from,
    message,
    createdAt: new Date().toISOString(),
    id: Math.random().toString(),
  };

  try {
    const encryptedData = await encryptPayload(to, messageMetadata);

    socket.emit("MESSAGE", {
      to,
      from: String(from.id),
      payload: encryptedData,
    });

    return { to, ...messageMetadata };
  } catch (error) {
    console.error("Encryption failed:", error);
    throw error;
  }
}
