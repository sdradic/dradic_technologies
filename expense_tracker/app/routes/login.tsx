import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { TallyUpLogo } from "~/components/Icons";
import { useTheme } from "~/contexts/ThemeContext";
import { useState, useEffect } from "react";
import { ErrorXIcon } from "~/components/Icons";

export default function Login() {
  const { login, handleGuestLogin, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isGuestLoading, setIsGuestLoading] = useState(false);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/", { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await login(email, password);
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(
        err.message ||
          "Failed to sign in. Please check your credentials and try again."
      );
    }
  };

  const handleGuest = () => {
    try {
      setIsGuestLoading(true);
      handleGuestLogin(true);
      navigate("/", { replace: true });
    } catch (err: any) {
      setError(err.message || "Failed to log in as guest");
    } finally {
      setIsGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 sm:px-2 px-8 max-h-screen">
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div>
          <div
            className="flex flex-row items-center justify-center gap-2 mt-4 mb-2"
            onClick={toggleTheme}
          >
            <TallyUpLogo className="w-18 h-18 stroke-primary-400 fill-primary-400 dark:stroke-primary-600 dark:fill-primary-600 cursor-pointer" />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome to TallyUp
          </h2>
          <div className="flex flex-col items-center justify-center gap-1 mt-2">
            <h3 className="text-gray-500 dark:text-gray-400 mb-8 text-center">
              Sign in to your account to continue
            </h3>
          </div>
        </div>
        {error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ErrorXIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        <form className="mt-6 space-y-6" onSubmit={handleLogin}>
          <div className="-space-y-px flex flex-col gap-6">
            <div>
              <label htmlFor="email" className="">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="relative border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-700"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password" className="">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="relative border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-700"
                placeholder="Password"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="group relative cursor-pointer w-full flex justify-center py-2 px-4 border border-transparent text-sm  rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              {isLoading ? "Signing in..." : "Sign in"}
            </button>
          </div>
        </form>
        <div className="flex flex-row w-full items-center justify-center gap-4 mt-2">
          <div className="separator"></div>
          <div className="text-sm text-gray-500 dark:text-gray-500">Or</div>
          <div className="separator"></div>
        </div>
        <div
          className="btn-secondary-long mt-6 mb-4"
          onClick={handleGuest}
          style={{
            cursor: isLoading ? "not-allowed" : "pointer",
            opacity: isLoading ? 0.7 : 1,
          }}
        >
          {isGuestLoading ? "Loading..." : "Continue as guest"}
        </div>
        <div className="flex flex-row items-center justify-center gap-2 mb-2">
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Don't have an account?
          </div>
          <a
            href="/signup"
            className="text-sm text-primary-500 dark:text-dark-100 cursor-pointer hover:text-primary-600 dark:hover:text-dark-50"
          >
            Sign up
          </a>
        </div>
      </div>
    </div>
  );
}
