import { fetchUsersBySearch } from "@/api/graphql/search.api";
import { QUERY_KEYS } from "@/api/query-keys.constants";
import { useEffect, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";

export default function useSearchUsers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedTerm, setDebouncedTerm] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedTerm(searchTerm);
    }, 1000);

    return () => clearTimeout(handler);
  }, [searchTerm]);

  const {
    data,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [QUERY_KEYS.GRAPHQL.USERS, debouncedTerm],
    queryFn: fetchUsersBySearch(debouncedTerm),
    initialPageParam: null,
    enabled: debouncedTerm.trim().length > 0,
    getNextPageParam: (lastPage) => lastPage?.nextCursor,
    staleTime: 1000,
    gcTime: 1000 * 60 * 5,
  });

  const flattenedData =
    data && Array.isArray(data.pages)
      ? data.pages.flatMap((page) => page?.data ?? [])
      : [];

  return {
    data: flattenedData,
    setQuery: setSearchTerm,
    query: searchTerm,
    isLoading,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  };
}
