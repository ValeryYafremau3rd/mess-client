import useContactToggle from "@/hooks/contacts/useContactToggle";
import { Link } from "expo-router";
import React from "react";
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

export default function ChatListItem({ item }) {
  const { text, toggleMutation } = useContactToggle().toggleContact(item.id); //!!! CHANGE
  return (
    <View style={styles.contactItem}>
      <Link
        href={{
          pathname: "/contacts/[id]",
          params: { id: item.id },
        }}
      >
        <View style={styles.avatar}>
          <Pressable>
            <Text style={styles.id}>{item.id}</Text>
          </Pressable>
        </View>
        <Text style={styles.name}>{item.name}</Text>
      </Link>
      <TouchableOpacity
        style={styles.removeButton}
        onPress={() => toggleMutation(item.id)}
      >
        <Text style={styles.text}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  contactItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    flex: 1,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: "#007AFF",
    justifyContent: "center",
    alignItems: "center",
  },
  id: { fontSize: 16, fontWeight: "600" },
  name: { fontSize: 16, fontWeight: "600", paddingHorizontal: 12 },
  empty: { textAlign: "center", marginTop: 50, color: "#999" },
  removeButton: {
    backgroundColor: "#ffebee",
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#000",
  },
  text: { fontSize: 12 },
});
