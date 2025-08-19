import {
  createContext,
  useContext,
  useMemo,
  useState,
  useEffect,
  useRef,
  useCallback,
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

// Create a user object from Supabase user (session already contains name/email)
const createUserFromSession = (supabaseUser: SupabaseUser): User => ({
  id: supabaseUser.id,
  name:
    supabaseUser.user_metadata?.full_name ||
    supabaseUser.user_metadata?.name ||
    supabaseUser.email?.split("@")[0] ||
    "User",
  email: supabaseUser.email || "",
  isLoading: false, // No need to load if we have session data
});

export function useAuthStore() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const isInitialized = useRef(false);
  const currentUserRef = useRef<User | null>(null);

  // Load user profile - use session data first, API as fallback for additional data
  const loadUserProfile = async (supabaseUser: SupabaseUser) => {
    // Always start with session data (already cached by Supabase)
    const sessionUser = createUserFromSession(supabaseUser);
    setUser(sessionUser);
    currentUserRef.current = sessionUser;

    // Only fetch from API if we need additional data (like groups)
    // For basic name/email, session data is sufficient
    try {
      const apiUser = await mapSupabaseUser(supabaseUser);
      if (apiUser && apiUser.groups) {
        // Update with groups data from API
        const enrichedUser = { ...sessionUser, groups: apiUser.groups };
        setUser(enrichedUser);
        currentUserRef.current = enrichedUser;
      }
    } catch (error) {
      console.warn("Failed to load additional user data:", error);
      // Continue with session data - no problem
    }
  };

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
          setIsAuthenticated(true);
          setIsGuest(false);

          // Load user profile (starts with session data, then enriches from API)
          loadUserProfile(session.user);
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

          setIsAuthenticated(true);
          setIsGuest(false);

          // Load user profile (starts with session data, then enriches from API)
          loadUserProfile(session.user);
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
        setIsGuest(false);

        // Load user profile (starts with session data, then enriches from API)
        loadUserProfile(data.user);

        return createUserFromSession(data.user);
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

  const handleGuestLogin = (isLoggingIn: boolean) => {
    const mockUser = {
      id: "mock-user-id",
      name: "Mock User",
      email: "mock-user@example.com",
      groups: [],
      isLoading: false,
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
    [isAuthenticated, user, isLoading, login, isGuest, authError],
  );

  return contextValue;
}

export interface User {
  id: string;
  name: string;
  email: string;
  isLoading?: boolean; // Flag to indicate if profile is still loading
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
