import { QUERY_KEYS } from "@/api/query-keys.constants";
import {
  addContact,
  fetchMyContacts,
  removeContact,
} from "@/api/rest/users.api";
import { CONTACT } from "@/types/types";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export default function useContactToggle() {
  const queryClient = useQueryClient();

  const { data: myContacts = [] } = useQuery({
    queryKey: [QUERY_KEYS.REST.CONTACTS],
    queryFn: fetchMyContacts,
  });

  const removeMutation = useMutation({
    mutationFn: removeContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REST.CONTACTS] });
    },
  });

  const addMutation = useMutation({
    mutationFn: addContact,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.REST.CONTACTS] });
    },
  });

  return {
    toggleContact: function (id: number) {
      if (myContacts.find((contact: CONTACT) => contact.id === id)) {
        return {
          text: "Remove",
          toggleMutation: removeMutation.mutate,
        };
      }
      return {
        text: "Add",
        toggleMutation: addMutation.mutate,
      };
    },
  };
}
