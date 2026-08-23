import { create } from "zustand";
import { persist } from "zustand/middleware";
import { configureAuthHandlers } from "@/lib/api";

export interface User {
  id: number;
  name: string;
  email: string;
  profilePicture: string | null;
}

interface AuthState {
  user: User | null;
  accessToken: string | null;
  setSession: (user: User, accessToken: string) => void;
  setAccessToken: (accessToken: string | null) => void;
  logout: () => void;
  isAuthenticated: () => boolean;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,

      setSession: (user, accessToken) => {
        set({ user, accessToken });
      },

      setAccessToken: (accessToken) => {
        set({ accessToken });
      },

      logout: () => {
        set({ user: null, accessToken: null });
      },

      isAuthenticated: () => Boolean(get().accessToken && get().user),
    }),
    {
      name: "video-transcription-auth",
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
      }),
    }
  )
);

configureAuthHandlers({
  getAccessToken: () => useAuthStore.getState().accessToken,
  setAccessToken: (token) => useAuthStore.getState().setAccessToken(token),
  onUnauthorized: () => useAuthStore.getState().logout(),
});
