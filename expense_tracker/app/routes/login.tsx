import { useNavigate } from "react-router";
import { useAuth } from "../contexts/AuthContext";
import { TallyUpLogo } from "~/components/Icons";

import { useState, useActionState } from "react";
import { ErrorXIcon, EyeIcon, EyeSlashIcon } from "~/components/Icons";
import Loader from "~/components/Loader";
import { ThemeToggle } from "~/components/ThemeToggle";

export default function Login() {
  const { login, handleGuestLogin, isLoading } = useAuth();
  const navigate = useNavigate();
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // React 19 useActionState expects (state, formData) => newState
  const [state, submitAction] = useActionState(
    async (prevState: { error?: string } | null, formData: FormData) => {
      const email = formData.get("email");
      const password = formData.get("password");
      if (!email || !password) {
        return { error: "Email and password are required" };
      }
      try {
        await login(email as string, password as string);
        navigate("/", { replace: true });
        return null;
      } catch (err: unknown) {
        console.error(err);
        return {
          error:
            "Failed to sign in. Please check your credentials and try again.",
        };
      }
    },
    null,
  );

  const handleGuest = () => {
    try {
      setIsGuestLoading(true);
      handleGuestLogin(true);
      navigate("/", { replace: true });
    } catch (err: unknown) {
      console.error(err);
      return { error: "Failed to log in as guest" };
    } finally {
      setIsGuestLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-900 min-h-screen py-8 px-4">
      <div className="modal-content-fintrack max-w-md w-full overflow-visible">
        <div className="px-10 pt-10 pb-6">
          <div className="flex justify-center mb-6">
            <TallyUpLogo className="w-16 h-16 stroke-primary-500 fill-primary-500 dark:stroke-primary-600 dark:fill-primary-600" />
          </div>
          <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white tracking-tighter text-center">
            Welcome to TallyUp
          </h2>
          <p className="text-xs font-bold text-gray-400 uppercase tracking-widest mt-1 text-center">
            Sign in to your account to continue
          </p>
        </div>
        {state?.error && (
          <div className="mx-10 mb-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-2xl p-4 flex items-center gap-3">
            <ErrorXIcon className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-sm font-semibold text-red-700 dark:text-red-300">
              {state.error}
            </p>
          </div>
        )}
        <form className="px-10 pb-10 space-y-6" action={submitAction}>
          <div>
            <label htmlFor="email" className="label-fintrack">
              Email address
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              className="input-fintrack"
              placeholder="Email address"
              autoComplete="username"
            />
          </div>
          <div>
            <label htmlFor="password" className="label-fintrack">
              Password
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                required
                className="input-fintrack pr-12"
                placeholder="Password"
                autoComplete="current-password"
              />
              <button
                type="button"
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeSlashIcon className="h-5 w-5 stroke-current" />
                ) : (
                  <EyeIcon className="h-5 w-5 stroke-current" />
                )}
              </button>
            </div>
          </div>
          <button
            type="submit"
            className={`btn-primary-long w-full py-4 rounded-2xl font-bold ${
              isLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader
                loaderSize={[4, 4]}
                loaderColor="border-white dark:border-white"
              />
            ) : (
              "Sign in"
            )}
          </button>
        </form>
        <div className="flex items-center gap-4 px-10 pb-6">
          <div className="separator flex-1" />
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            Or
          </span>
          <div className="separator flex-1" />
        </div>
        <div className="px-10 pb-8">
          <button
            type="button"
            className={`btn-secondary-long w-full py-4 rounded-2xl font-bold ${
              isGuestLoading ? "opacity-50 cursor-not-allowed" : ""
            }`}
            disabled={isGuestLoading}
            onClick={handleGuest}
          >
            {isGuestLoading ? (
              <Loader loaderSize={[4, 4]} />
            ) : (
              "Continue as guest"
            )}
          </button>
        </div>
        <div className="flex flex-col items-center justify-center gap-2 pb-8">
          <p className="text-xs text-gray-500 dark:text-gray-400">
            &copy; {new Date().getFullYear()} Dradic Technologies
          </p>
          <ThemeToggle />
        </div>
      </div>
    </div>
  );
}
