import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";
import type { ReactNode } from "react";

import { getCurrentUser, type User } from "../services/auth";

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (accessToken: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

export function AuthProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [user, setUser] = useState<User | null>(null);

  const [token, setToken] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);

  // Restore authentication after page refresh
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = localStorage.getItem("access_token");

      if (!storedToken) {
        setLoading(false);
        return;
      }

      try {
        setToken(storedToken);

        const currentUser = await getCurrentUser();

        setUser(currentUser);
      } catch (error) {
        console.error("Failed to restore session:", error);

        localStorage.removeItem("access_token");

        setToken(null);

        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (accessToken: string) => {
    localStorage.setItem("access_token", accessToken);

    setToken(accessToken);

    const currentUser = await getCurrentUser();

    setUser(currentUser);
  };

  const logout = () => {
    localStorage.removeItem("access_token");

    setToken(null);

    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error(
      "useAuth must be used within an AuthProvider"
    );
  }

  return context;
}