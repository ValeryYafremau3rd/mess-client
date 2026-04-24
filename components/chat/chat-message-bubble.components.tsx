import React from "react";
import { StyleSheet, Text, View } from "react-native";

export default function ChatMessageBubble({ message }) {
  return (
    <View
      style={[
        styles.bubble,
        message.sender.name === "Me" ? styles.myBubble : styles.theirBubble, // compare by id
      ]}
    >
      <View
        style={message.sender.name === "Me" ? styles.myText : styles.theirText}
      >
        <Text style={styles.userName}>{message.sender.name}:</Text>
        <Text style={styles.messageText}>{message.message}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    padding: 10,
    borderRadius: 15,
    marginBottom: 8,
    maxWidth: "80%",
  },
  userName: {
    fontSize: 15,
    fontWeight: "bold",
    marginBottom: 2,
    color: "#555",
    opacity: 0.8,
  },
  messageText: {
    fontSize: 18,
    color: "#000",
  },
  myBubble: {
    alignSelf: "flex-end",
    backgroundColor: "#0d6efd",
  },
  theirBubble: {
    alignSelf: "flex-start",
    backgroundColor: "#e9ecef",
  },
  myText: { color: "#fff" },
  theirText: { color: "#000" },
});
