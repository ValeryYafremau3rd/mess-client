import { gql } from "graphql-request";

export const SEARCH_USERS_QUERY = gql`
  query SearchUsers($name: String!, $limit: Int!, $cursor: [String!]) {
    searchUsers(name: $name, limit: $limit, cursor: $cursor) {
      total
      nextCursor
      data {
        id
        name
      }
    }
  }
`;
