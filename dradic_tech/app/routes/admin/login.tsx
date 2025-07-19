import { useNavigate } from "react-router";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "~/contexts/AuthContext";
import { DradicTechLogo } from "~/components/Icons";

export default function AdminLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const hasNavigated = useRef(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isAuthLoading && !hasNavigated.current) {
      setIsCheckingAuth(false);
      if (isAuthenticated) {
        hasNavigated.current = true;
        navigate("/admin");
      }
    }
  }, [isAuthLoading, isAuthenticated, navigate]);

  if (isCheckingAuth || isAuthLoading) {
    return null;
  }

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      await login(email, password);
      navigate("/admin");
    } catch {
      console.error(
        "Failed to sign in. Please check your credentials and try again.",
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 dark:bg-dark-600 sm:px-2 px-8 py-16">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-dark-400 rounded-lg shadow">
        <FormHeader />
        <FormComponent handleLogin={handleLogin} isLoading={isLoading} />
      </div>
    </div>
  );
}

function FormHeader() {
  const { authError } = useAuth();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(authError);
    if (authError) {
      const timer = setTimeout(() => {
        setError(null);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [authError]);

  return (
    <div className="flex flex-col items-center justify-center gap-2">
      <div className="flex flex-row items-center justify-center gap-2 mt-4 mb-2 my-auto h-full">
        <DradicTechLogo className="size-32 stroke-4 stroke-primary-500 dark:stroke-primary-400" />
      </div>
      <h2 className="mt-6 text-center text-2xl font-bold text-gray-800 dark:text-white">
        Welcome to Blog CMS
      </h2>
      <div className="flex flex-col items-center justify-center gap-1 mt-2">
        <h3 className="text-gray-500 dark:text-gray-400 mb-2 text-center">
          Sign in to your account to continue
        </h3>
      </div>
      {authError && (
        <div className="text-red-500 dark:text-red-400 text-center">
          {error}
        </div>
      )}
    </div>
  );
}

function FormComponent({
  handleLogin,
  isLoading,
}: {
  handleLogin: (email: string, password: string) => Promise<void>;
  isLoading: boolean;
}) {
  return (
    <form
      className="space-y-6"
      onSubmit={(e) => {
        e.preventDefault();
        handleLogin(
          e.currentTarget.email.value,
          e.currentTarget.password.value,
        );
      }}
    >
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-1">
          <label
            htmlFor="email"
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            Email address
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="border bg-white dark:bg-dark-300 border-gray-300 dark:border-dark-300 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2"
            placeholder="Email address"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label
            htmlFor="password"
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            Password
          </label>
          <input
            id="password"
            name="password"
            type="password"
            required
            className="border bg-white dark:bg-dark-300 border-gray-300 dark:border-dark-300 text-gray-900 dark:text-white rounded-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm p-2"
            placeholder="Password"
          />
        </div>
      </div>

      <div>
        <button
          type="submit"
          className="group relative cursor-pointer w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
        >
          {isLoading ? "Signing in..." : "Sign in"}
        </button>
      </div>
    </form>
  );
}
