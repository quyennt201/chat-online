import { create } from "zustand";
import { persist } from "zustand/middleware";

interface UserStore {
  accessToken: string | null;
  userId: string | null;
  setUser: (token: string, userId: string) => void;
}

export const useUserStore = create<UserStore>()(
  persist(
    (set) => ({
      accessToken: null,
      userId: null,
      setUser: (token: string, userId: string) =>
        set({ accessToken: token, userId }),
    }),
    {
      name: "user-app",
    },
  ),
);
