import AsyncStorage from "@react-native-async-storage/async-storage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type User = { id: number; name: string };

const useAuthStore = create()(
  persist(
    (set) => ({
      token: "",
      account: {},

      setToken: (token: string) => set({ token }),

      setUser: (user: User) => set({ account: user }),

      deleteAccount: () =>
        set({
          token: "",
          account: {},
        }),
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);

export default useAuthStore;
