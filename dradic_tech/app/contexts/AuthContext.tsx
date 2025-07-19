import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useCallback,
} from "react";
import type { ReactNode } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "../modules/supabase";

// Convert Supabase User to your app's User type
const mapSupabaseUser = (supabaseUser: SupabaseUser | null): User | null => {
  if (!supabaseUser) return null;

  return {
    id: supabaseUser.id,
    name:
      supabaseUser.user_metadata?.name ||
      supabaseUser.email?.split("@")[0] ||
      "User",
    email: supabaseUser.email || "",
    groups: [], // You can fetch groups from your backend or another source
  };
};

export function useAuthStore(isAdminRoute: boolean = false) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  // Listen for auth state changes only on admin routes
  useEffect(() => {
    if (!isAdminRoute) {
      // For non-admin routes, just set loading to false and return
      setIsLoading(false);
      return;
    }

    let isMounted = true;

    // Set initial loading state
    setIsLoading(true);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      try {
        if (session?.user) {
          const appUser = mapSupabaseUser(session.user);

          if (isMounted) {
            setUser(appUser);
            setIsAuthenticated(true);
          }
        } else {
          if (isMounted) {
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        if (isMounted) {
          setAuthError("Failed to load user session");
        }
        throw error;
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    });

    // Cleanup subscription on unmount
    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [isAdminRoute]);

  const login = useCallback(async (email: string, password: string) => {
    try {
      if (email !== "sdradic95@gmail.com") throw new Error("Unauthorized");
      setIsLoading(true);
      setAuthError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // The onAuthStateChange listener will handle the state update
      return mapSupabaseUser(data.user);
    } catch (error: unknown) {
      setAuthError(error instanceof Error ? error.message : "Unknown error");
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      // The onAuthStateChange listener will handle the state update
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      user,
      login,
      logout,
      isLoading,
      authError,
    }),
    [isAuthenticated, user, isLoading, authError, login, logout],
  );

  return contextValue;
}

export interface User {
  id: string;
  name: string;
  email: string;
  groups: Array<{
    group_id: string;
    group_name: string;
  }>;
}

export interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  isLoading: boolean;
  authError: string | null;
}

const AuthContext = createContext<AuthStore | undefined>(undefined);

export function AuthProvider({
  children,
  isAdminRoute = false,
}: {
  children: ReactNode;
  isAdminRoute?: boolean;
}) {
  const authStore = useAuthStore(isAdminRoute);

  return (
    <AuthContext.Provider value={authStore}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
