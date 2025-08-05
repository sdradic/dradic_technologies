import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
} from "react";
import type { ReactNode } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "../modules/supabase";
import { usersApi } from "~/modules/apis";

// Cache for user data to prevent redundant API calls
const userCache = new Map<string, User>();

// Convert Supabase User to your app's User type
const mapSupabaseUser = async (
  supabaseUser: SupabaseUser | null,
): Promise<User | null> => {
  if (!supabaseUser) return null;

  // Check cache first
  if (userCache.has(supabaseUser.id)) {
    return userCache.get(supabaseUser.id)!;
  }

  const user = await usersApi
    .getById(supabaseUser.id)
    .then((user) => {
      const appUser = {
        id: user.id,
        name: user.name,
        email: user.email,
      };
      // Cache the result
      userCache.set(supabaseUser.id, appUser);
      return appUser;
    })
    .catch((error) => {
      console.error("Error fetching user:", error);
      throw error;
    });

  return user;
};

export function useAuthStore() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const isInitialized = useRef(false);
  const currentUserRef = useRef<User | null>(null);

  // Check for existing session and listen for auth state changes
  useEffect(() => {
    // Prevent multiple initializations
    if (isInitialized.current) return;
    isInitialized.current = true;

    setIsLoading(true);
    setAuthError(null);

    // First, check for an existing session
    const checkExistingSession = async () => {
      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Error getting session:", error);
          setAuthError(
            "Failed to load user session. Please try refreshing the page.",
          );
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          const appUser = await mapSupabaseUser(session.user);
          setUser(appUser);
          currentUserRef.current = appUser;
          setIsAuthenticated(true);
          setIsGuest(false);
        } else {
          setUser(null);
          currentUserRef.current = null;
          setIsAuthenticated(false);
          setIsGuest(false);
        }
      } catch (error) {
        console.error("Error checking existing session:", error);
        setAuthError(
          "Failed to load user session. Please try refreshing the page.",
        );
      } finally {
        setIsLoading(false);
      }
    };

    // Check existing session first
    checkExistingSession();

    // Then listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      // Skip the initial session event since we already handled it
      if (event === "INITIAL_SESSION") {
        return;
      }

      try {
        if (session?.user) {
          // Clear cache for previous user if different
          if (
            currentUserRef.current &&
            currentUserRef.current.id !== session.user.id
          ) {
            userCache.delete(currentUserRef.current.id);
          }

          const appUser = await mapSupabaseUser(session.user);
          setUser(appUser);
          currentUserRef.current = appUser;
          setIsAuthenticated(true);
          setIsGuest(false);
        } else {
          // Clear cache when user logs out
          if (currentUserRef.current) {
            userCache.delete(currentUserRef.current.id);
          }
          setUser(null);
          currentUserRef.current = null;
          setIsAuthenticated(false);
          setIsGuest(false);
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
        setAuthError(
          "Failed to load user session. Please try refreshing the page.",
        );
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      setAuthError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      // Immediately update auth state after successful login
      if (data.user) {
        const appUser = await mapSupabaseUser(data.user);
        setUser(appUser);
        currentUserRef.current = appUser;
        setIsAuthenticated(true);
        setIsGuest(false);
        return appUser;
      }

      return null;
    } catch (error: unknown) {
      console.error("Login error:", error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : "An error occurred during login";
      setAuthError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = (isLoggingIn: boolean) => {
    const mockUser = {
      id: "mock-user-id",
      name: "Mock User",
      email: "mock-user@example.com",
      groups: [],
    };
    setIsLoading(true);
    try {
      setUser(isLoggingIn ? mockUser : null);
      setIsAuthenticated(isLoggingIn);
      setIsGuest(isLoggingIn);
    } catch (error: unknown) {
      setAuthError(error instanceof Error ? error.message : "Unknown error");
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("❌ Supabase logout error:", error);
        throw error;
      }

      // Immediately update auth state after successful logout
      setUser(null);
      currentUserRef.current = null;
      setIsAuthenticated(false);
      setIsGuest(false);

      // Clear user cache on logout
      userCache.clear();
      isInitialized.current = false;
    } catch (error) {
      console.error("Error signing out:", error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  // Memoize the context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      isAuthenticated,
      user,
      login,
      handleGuestLogin,
      logout,
      isLoading,
      isGuest,
      authError,
    }),
    [isAuthenticated, user, isLoading, isGuest, authError],
  );

  return contextValue;
}

export interface User {
  id: string;
  name: string;
  email: string;
  groups?: Array<{
    group_id: string;
    group_name: string;
  }>;
}

export interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  handleGuestLogin: (isLoggingIn: boolean) => void;
  logout: () => Promise<void>;
  isLoading: boolean;
  isGuest: boolean;
  authError: string | null;
}

const AuthContext = createContext<AuthStore | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const authStore = useAuthStore();

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
