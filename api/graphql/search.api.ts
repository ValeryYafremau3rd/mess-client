import { SEARCH_USERS_QUERY } from "@/api/graphql/queries";
import { gqlRequest } from "./request";

export const fetchUsersBySearch = (name: string, limit = 10) => {
  return async ({ pageParam }: { pageParam: string[] }) => {
    const response = await gqlRequest<any>(SEARCH_USERS_QUERY, {
      name: name,
      limit: limit,
      cursor: pageParam,
    });
    return response.searchUsers;
  };
};

export const fetchUsersMutation = async (variables: any) => {
  const data = await gqlRequest<any>(SEARCH_USERS_QUERY, variables);
  return data.searchUsers;
};
