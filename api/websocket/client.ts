import { io, Socket } from "socket.io-client";
import { listen } from "./listeners";

export let socket: Socket;

export const initChatSocket = (token: string) => {
  let heartbeatInterval: number;

  socket = io(process.env.EXPO_PUBLIC_WEBSOCKET_API_URL, {
    auth: { token },
    path: '/websocket/socket.io/',
    query: {
      token,
    },
    transports: ["websocket"],
  });

  socket.on("connect", () => {
    heartbeatInterval = setInterval(() => socket.emit("HEARTBEAT"), 30000);
    listen(socket);
  });

  socket.on("disconnect", (reason) => {
    heartbeatInterval && clearInterval(heartbeatInterval);
    console.log("Socket disconnected:", reason);
  });
};
