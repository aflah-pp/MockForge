import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import useAuthStore from "@/service/store/authStore";
import {
  getCurrentUser,
  loginUser,
  logoutAllUsers,
  logoutUser,
  refreshUserToken,
} from "@/service/endpoints/auth";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const queryClient = useQueryClient();
  const { accessToken, user, isAuthenticated, setAccessToken, setUser, clearAuth } = useAuthStore();
  const [isBootstrapping, setIsBootstrapping] = useState(true);

  const bootstrapAuth = useCallback(async () => {
    try {
      const data = await refreshUserToken();

      if (!data?.access) {
        throw new Error("Refresh response did not contain an access token.");
      }

      setAccessToken(data.access);

      const currentUser = await getCurrentUser();

      setUser(currentUser);

      queryClient.setQueryData(["auth", "me"], currentUser);
    } catch {
      clearAuth();

      queryClient.removeQueries({
        queryKey: ["auth"],
      });
    } finally {
      setIsBootstrapping(false);
    }
  }, [clearAuth, queryClient, setAccessToken, setUser]);

  useEffect(() => {
    bootstrapAuth();
  }, [bootstrapAuth]);

  const login = useCallback(
    async (credentials) => {
      const data = await loginUser(credentials);

      if (!data?.access) {
        throw new Error("Login response did not contain an access token.");
      }

      setAccessToken(data.access);

      const currentUser = await getCurrentUser();

      setUser(currentUser);

      queryClient.setQueryData(["auth", "me"], currentUser);

      return currentUser;
    },
    [queryClient, setAccessToken, setUser],
  );

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      clearAuth();

      queryClient.removeQueries({
        queryKey: ["auth"],
      });
    }
  }, [clearAuth, queryClient]);

  const logoutAll = useCallback(async () => {
    try {
      await logoutAllUsers();
    } finally {
      clearAuth();

      queryClient.removeQueries({
        queryKey: ["auth"],
      });
    }
  }, [clearAuth, queryClient]);

  const value = useMemo(
    () => ({
      accessToken,
      user,
      isAuthenticated,
      isBootstrapping,
      isLoading: isBootstrapping,
      login,
      logout,
      logoutAll,
    }),
    [accessToken, user, isAuthenticated, isBootstrapping, login, logout, logoutAll],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider.");
  }

  return context;
}
