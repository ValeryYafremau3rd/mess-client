import { useState, useEffect } from "react";
import { View, TextInput, Text, StyleSheet } from "react-native";

const UserEdit = ({ user, onChange }) => {
  const [localUser, setLocalUser] = useState(user);

  useEffect(() => {
    const timer = setTimeout(() => onChange(localUser), 1000);
    return () => clearTimeout(timer);
  }, [localUser, onChange]);

  return (
    <View style={styles.container}>
      <Text>User id: {localUser.id}</Text>
      <View style={styles.row}>
        <Text>User name: </Text>
        <TextInput
          style={styles.input}
          value={localUser.name}
          onChangeText={(name) => setLocalUser({ ...localUser, name })}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  input: {
    borderWidth: 1,
    backgroundColor: "#fff",
    borderColor: "#ccc",
    flex: 1,
    padding: 5,
  },
});
export default UserEdit;
