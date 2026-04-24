import { initChatSocket } from "@/api/websocket/client";
import useAuthStore from "@/store/account.store";
import { useEffect } from "react";

export default function useWebSocket() {
  const token = useAuthStore((state) => state.token);

  useEffect(() => {
    initChatSocket(token);
  }, [token]);
}
