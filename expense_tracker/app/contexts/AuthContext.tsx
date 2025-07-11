import { createContext, useContext, useMemo, useState, useEffect } from "react";
import type { ReactNode } from "react";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { supabase } from "../modules/supabase";
import { usersApi } from "~/modules/apis";

// Convert Supabase User to your app's User type
const mapSupabaseUser = async (
  supabaseUser: SupabaseUser | null
): Promise<User | null> => {
  if (!supabaseUser) return null;

  const user = await usersApi
    .getById(supabaseUser.id)
    .then((user) => {
      return {
        id: user.id,
        name: user.name,
        email: user.email,
      };
    })
    .catch(async (error) => {
      console.error("Error fetching user:", error);

      // If user doesn't exist in backend, try to create it
      if (error.status === 404) {
        try {
          console.log("User not found in backend, creating profile...");
          const createdUser = await usersApi.create({
            id: supabaseUser.id,
            name:
              supabaseUser.user_metadata?.name ||
              supabaseUser.email?.split("@")[0] ||
              "Unknown",
            email: supabaseUser.email || "",
          });
          return {
            id: createdUser.id,
            name: createdUser.name,
            email: createdUser.email,
          };
        } catch (createError) {
          console.error("Error creating user profile:", createError);
          // Return a basic user object with Supabase data as fallback
          return {
            id: supabaseUser.id,
            name:
              supabaseUser.user_metadata?.name ||
              supabaseUser.email?.split("@")[0] ||
              "Unknown",
            email: supabaseUser.email || "",
          };
        }
      }

      // For other errors, return a basic user object with Supabase data
      return {
        id: supabaseUser.id,
        name:
          supabaseUser.user_metadata?.name ||
          supabaseUser.email?.split("@")[0] ||
          "Unknown",
        email: supabaseUser.email || "",
      };
    });

  return user;
};

export function useAuthStore() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isGuest, setIsGuest] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Listen for auth state changes
  useEffect(() => {
    setIsLoading(true);
    setAuthError(null);

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      try {
        if (session?.user) {
          const appUser = await mapSupabaseUser(session.user);
          setUser(appUser);
          setIsAuthenticated(true);
          setIsGuest(false);
        } else {
          setUser(null);
          setIsAuthenticated(false);
          setIsGuest(false);
        }
      } catch (error) {
        console.error("Error in auth state change:", error);
        setAuthError(
          "Failed to load user session. Please try refreshing the page."
        );
      } finally {
        setIsLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const signup = async (email: string, password: string, name: string) => {
    try {
      setIsLoading(true);
      setAuthError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name: name,
          },
        },
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Wait a moment for the session to be available
        // In some cases, the session might not be immediately available
        let session = data.session;
        if (!session) {
          // Wait for the session to be established
          await new Promise((resolve) => setTimeout(resolve, 1000));
          const { data: sessionData } = await supabase.auth.getSession();
          session = sessionData.session;
        }

        // Only create user profile if we have a valid session
        if (session) {
          // Create user profile in your backend
          await usersApi.create({
            id: data.user.id,
            name,
            email,
          });
        } else {
          // If no session, the user might need to confirm their email
          // In this case, we'll create the user profile when they confirm
          console.log(
            "User created but needs to confirm email. User profile will be created upon confirmation."
          );
        }

        return mapSupabaseUser(data.user);
      }

      return null;
    } catch (error: any) {
      console.error("Signup error:", error);
      const errorMessage = error.message || "An error occurred during signup";
      setAuthError(errorMessage);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

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

      return mapSupabaseUser(data.user);
    } catch (error: any) {
      console.error("Login error:", error);
      const errorMessage = error.message || "An error occurred during login";
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
    } catch (error: any) {
      setAuthError(error.message);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
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
      signup,
      authError,
    }),
    [isAuthenticated, user, isLoading, isGuest, authError]
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
  signup: (
    email: string,
    password: string,
    name: string
  ) => Promise<User | null>;
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
