import { request } from "graphql-request";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const gqlRequest = async <T>(
  query: string,
  variables = {},
): Promise<T> => {
  const authStore = await AsyncStorage.getItem("auth-storage");
  const token = JSON.parse(authStore).state.token;

  return request<T>(
    process.env.EXPO_PUBLIC_GRAPHQL_API_URL || "",
    query,
    variables,
    { Authorization: `Bearer ${token}` },
  );
};
