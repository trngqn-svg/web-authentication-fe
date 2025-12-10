import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/authService";
import { attachInterceptors } from "../api/axios";

interface AuthContextType {
  login: (data: { email: string; password: string }) => Promise<void>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
  isReady: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [accessToken, setAccessTokenState] = useState<string | null>(
    localStorage.getItem("accessToken")
  );
  const [expiresAt, setExpiresAt] = useState<number | null>(null);

  // *** Ngăn vòng lặp chuyển hướng ***
  const [isReady, setIsReady] = useState(false);

  const queryClient = useQueryClient();

  // ===== Utils =====
  const parseExpiresIn = (str: string) => {
    if (str.endsWith("m")) return parseInt(str) * 60 * 1000;
    if (str.endsWith("s")) return parseInt(str) * 1000;
    return Number(str) * 1000;
  };

  const setAccessToken = (token: string) => {
    localStorage.setItem("accessToken", token);
    setAccessTokenState(token);
  };

  const saveExpires = (expiresIn: string) => {
    const expiresMs = parseExpiresIn(expiresIn);
    const newTime = Date.now() + expiresMs;

    localStorage.setItem("expiresAt", newTime.toString());
    setExpiresAt(newTime);
  };

  const clearAuth = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("expiresAt");
    setAccessTokenState(null);
    setExpiresAt(null);
  };

  const logoutHandler = useCallback(() => {
    clearAuth();
    queryClient.clear();

    localStorage.setItem("auth_event", Date.now().toString());
    localStorage.setItem('logout', Date.now().toString());
    window.location.href = "/login";
  }, [queryClient]);

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === "auth_event") {
        clearAuth();
        window.location.href = "/login";
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  useEffect(() => {
    attachInterceptors({
      getAccessToken: () => localStorage.getItem("accessToken"),
      setAccessToken,
      logout: logoutHandler,
    });
  }, [logoutHandler]);

  useEffect(() => {
    const saved = localStorage.getItem("expiresAt");
    if (saved) {
      const n = Number(saved);
      if (!isNaN(n) && n > Date.now()) {
        setExpiresAt(n);
      }
    }
  }, []);

  useEffect(() => {
    const refreshTokenCookieExists = document.cookie.includes('refreshToken='); // check cookie
    if (!refreshTokenCookieExists) {
      setIsReady(true);
      return;
    }

    authService.refresh()
      .then((data) => {
        setAccessToken(data.accessToken);
        saveExpires(data.expiresIn);
      })
      .catch(() => {
        clearAuth();
      })
      .finally(() => setIsReady(true));
  }, []);

  const silentRefresh = useCallback(async () => {
    try {
      const data = await authService.refresh();
      setAccessToken(data.accessToken);
      saveExpires(data.expiresIn);
    } catch {
      logoutHandler();
    }
  }, [logoutHandler]);

  useEffect(() => {
    if (!isReady) return;
    if (!expiresAt) return;

    const timeLeft = expiresAt - Date.now();
    if (timeLeft <= 0) return;

    if (timeLeft <= 10_000) {
      silentRefresh();
      return;
    }

    const id = setTimeout(() => silentRefresh(), timeLeft - 10_000);
    return () => clearTimeout(id);
  }, [isReady, expiresAt, silentRefresh]);

  useEffect(() => {
    const handleStorage = (event: StorageEvent) => {
      if (event.key === 'logout') {
        // Tab khác gọi logout → thực hiện logout ở tab này
        logoutHandler();
      }
      if (event.key === 'accessToken') {
        // Tab khác login → cập nhật accessToken ở tab này
        setAccessTokenState(event.newValue);
      }
    };

    window.addEventListener('storage', handleStorage);

    return () => {
      window.removeEventListener('storage', handleStorage);
    };
  }, [logoutHandler]);

  const loginMutation = useMutation({
    mutationFn: ({ email, password }: any) =>
      authService.login(email, password),
    onSuccess: (data) => {
      setAccessToken(data.accessToken);
      saveExpires(data.expiresIn);

      localStorage.setItem("auth_event", Date.now().toString());
    },
  });

  const login = async (data: { email: string; password: string }) => {
    await loginMutation.mutateAsync(data);
  };

  const logoutMutation = useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: logoutHandler,
    onError: logoutHandler,
  });

  const logout = async () => {
    await logoutMutation.mutateAsync();
  };

  const isAuthenticated = isReady && !!accessToken;

  const value: AuthContextType = {
    login,
    logout,
    isAuthenticated,
    isReady,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
