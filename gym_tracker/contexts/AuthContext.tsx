"use client";

import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
} from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "../lib/supabase";
import type { User } from "../lib/types";

interface AuthStore {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<User | null>;
  logout: () => Promise<void>;
  isLoading: boolean;
  authError: string | null;
}

const AuthContext = createContext<AuthStore | undefined>(undefined);

// Convert Supabase User to app User type
const createUserFromSession = (supabaseUser: SupabaseUser): User => ({
  id: supabaseUser.id,
  name:
    supabaseUser.user_metadata?.full_name ||
    supabaseUser.user_metadata?.name ||
    supabaseUser.email?.split("@")[0] ||
    "User",
  email: supabaseUser.email || "",
});

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);
  const isInitialized = useRef(false);

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
            "Failed to load user session. Please try refreshing the page."
          );
          setIsLoading(false);
          return;
        }

        if (session?.user) {
          setIsAuthenticated(true);
          setUser(createUserFromSession(session.user));
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error checking existing session:", error);
        setAuthError(
          "Failed to load user session. Please try refreshing the page."
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
          setIsAuthenticated(true);
          setUser(createUserFromSession(session.user));
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
        setAuthError(
          "Failed to load user session. Please try refreshing the page."
        );
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
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

      // Immediately update auth state
      if (data.user) {
        setIsAuthenticated(true);
        const newUser = createUserFromSession(data.user);
        setUser(newUser);
        return newUser;
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
  }, []);

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error("Supabase logout error:", error);
        throw error;
      }

      // Immediately update auth state after successful logout
      setUser(null);
      setIsAuthenticated(false);
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
      logout,
      isLoading,
      authError,
    }),
    [isAuthenticated, user, isLoading, login, authError]
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
