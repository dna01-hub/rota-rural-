"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Profile, Vehicle, UserRole } from "@/types";

interface AuthState {
  user: Profile | null;
  vehicle: Vehicle | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  setUser: (user: Profile | null) => void;
  setVehicle: (vehicle: Vehicle | null) => void;
  setLoading: (loading: boolean) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      vehicle: null,
      isAuthenticated: false,
      isLoading: true,
      setUser: (user) =>
        set({ user, isAuthenticated: !!user, isLoading: false }),
      setVehicle: (vehicle) => set({ vehicle }),
      setLoading: (isLoading) => set({ isLoading }),
      logout: () =>
        set({
          user: null,
          vehicle: null,
          isAuthenticated: false,
          isLoading: false,
        }),
    }),
    {
      name: "rota-rural-auth",
      partialize: (state) => ({
        user: state.user,
        vehicle: state.vehicle,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
