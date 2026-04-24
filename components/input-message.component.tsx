import React, { useState } from "react";
import { Button, StyleSheet, TextInput, View } from "react-native";

export default function InputMessage({ sendMessage }) {
  const [msg, setMsg] = useState("");

  const handleSend = () => {
    if (msg.trim()) {
      sendMessage(msg);
      setMsg("");
    }
  };

  return (
    <View style={styles.inputArea}>
      <TextInput
        value={msg}
        onChangeText={setMsg}
        onSubmitEditing={handleSend}
        placeholder="Type a message..."
        style={styles.input}
      />
      <Button title="Send" onPress={handleSend} />
    </View>
  );
}

const styles = StyleSheet.create({
  inputArea: {
    flexDirection: "row",
    padding: 10,
    backgroundColor: "#fff",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#eee",
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 8,
    marginRight: 10,
  },
});
