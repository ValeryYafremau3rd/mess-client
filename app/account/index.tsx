import { QUERY_KEYS } from "@/api/query-keys.constants";
import { createUser, deleteUser, updateUser } from "@/api/rest/users.api";
import { initChatSocket } from "@/api/websocket/client";
import UserEdit from "@/components/user-edit.component";
import useAuthStore from "@/store/account.store";
import { useMessageStore } from "@/store/message.strore";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import React from "react";

import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function Page() {
  const queryClient = useQueryClient();
  const { setToken, setUser, deleteAccount, token, account } = useAuthStore();
  const deleteChats = useMessageStore((state) => state.deleteAll);

  const { mutate, isPending } = useMutation({
    mutationFn: updateUser,
    onSuccess: (user) => {
      setUser(user);
    },
    onError: (error) => {
      console.error("Update failed:", error);
    },
  });

  const createTestUser = useMutation({
    mutationFn: createUser,
    onSuccess: async (data: any) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REST.ACCOUNT] });
      setToken(data.access_token);
      setUser(data.user);
      initChatSocket(data.access_token);
    },
  });

  const removeUser = useMutation({
    mutationFn: deleteUser,
    onSuccess: async () => {
      deleteAccount();
      deleteChats();
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REST.ACCOUNT] });
    },
  });

  const isLoading = createUser.isPending || removeUser.isPending || isPending;

  return (
    <View style={styles.container}>
      {token && <UserEdit user={account} onChange={mutate} />}
      {isLoading && <Text>Saving changes...</Text>}

      <TouchableOpacity
        style={[
          styles.button,
          token ? styles.deleteButton : styles.createButton,
        ]}
        onPress={token ? removeUser.mutate : createTestUser.mutate}
        disabled={isLoading}
      >
        {isLoading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>
            {token ? "Delete User" : "Create User"}
          </Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, alignItems: "center" },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    minWidth: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  createButton: { backgroundColor: "#10b981" },
  deleteButton: { backgroundColor: "#ef4444" },
  buttonText: { color: "#ffffff", fontWeight: "bold", fontSize: 16 },
  errorText: { color: "#ef4444", marginTop: 10, fontSize: 12 },
});
