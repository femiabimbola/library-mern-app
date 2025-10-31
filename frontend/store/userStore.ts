import { create } from "zustand";

interface AppUser {
  id: string;
  fullName: string;
  email: string;
  universityId: string;
  universityCard: string;
  role: string;
  lastActivityDate: string;
  createdAt: string;
}

interface UserState {
  user: AppUser | null;
  isLoading: boolean;
  error: Error | null;
  fetchUser: () => Promise<void>;
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  isLoading: false,
  error: null,
  fetchUser: async () => {
    set({ isLoading: true, error: null });
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/api/user`, {
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Failed to fetch user data");
      }
      const data = await response.json();
      set({ user: data.user, isLoading: false });
    } catch (error) {
      set({ error: error as Error, isLoading: false });
    }
  },
}));
