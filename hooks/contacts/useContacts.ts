import { QUERY_KEYS } from "@/api/query-keys.constants";
import { fetchMyContacts } from "@/api/rest/users.api";
import { useQuery } from "@tanstack/react-query";

export default function useContacts() {
  const { data, isLoading } = useQuery({
    queryKey: [QUERY_KEYS.REST.CONTACTS],
    queryFn: fetchMyContacts,
  });

  return {
    data,
    isLoading,
  };
}
