import request from "graphql-request";

export const gqlRequest = <T>(query: string, variables = {}): Promise<T> => {
  return request<T>(
    process.env.EXPO_PUBLIC_GRAPHQL_API_URL || "",
    query,
    variables,
  );
};
