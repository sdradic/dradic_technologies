import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { TallyUpLogo } from "~/components/Icons";
import { useTheme } from "~/contexts/ThemeContext";
import { useState, useEffect } from "react";
import { ErrorXIcon } from "~/components/Icons";

export default function SignUp() {
  const { signup, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { toggleTheme } = useTheme();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate("/");
    }
  }, [isAuthenticated, navigate]);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      await signup(email, password, name);
      navigate("/");
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to sign up. Please check your credentials and try again.",
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-8 px-4">
      <div className="modal-content-fintrack max-w-md w-full overflow-visible">
        <div className="px-10 pt-10 pb-6">
          <div className="flex justify-center mb-6">
            <TallyUpLogo
              className="w-16 h-16 stroke-primary-500 fill-primary-500 dark:stroke-primary-600 dark:fill-primary-600 cursor-pointer"
              onClick={toggleTheme}
            />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tighter text-center">
            Sign up for TallyUp
          </h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 text-center">
            Create your account
          </p>
        </div>
        {error && (
          <div className="mx-10 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-center gap-3">
            <ErrorXIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">
              {error}
            </p>
          </div>
        )}
        <form onSubmit={handleSignUp} className="px-10 pb-10 space-y-6">
          <div>
            <label htmlFor="name" className="label-fintrack">
              Name
            </label>
            <input
              id="name"
              name="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="input-fintrack"
              placeholder="Enter your name"
            />
          </div>
          <div>
            <label htmlFor="email" className="label-fintrack">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input-fintrack"
              placeholder="Email address"
            />
          </div>
          <div>
            <label htmlFor="password" className="label-fintrack">
              Password
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-fintrack"
              placeholder="Password"
            />
          </div>
          <div className="pt-4">
            <button
              type="submit"
              className="btn-primary-long w-full py-4 rounded-2xl font-bold"
              disabled={isLoading}
            >
              {isLoading ? "Signing up..." : "Sign up"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
