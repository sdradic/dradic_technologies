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
    <div className="flex items-center justify-center bg-gray-50 dark:bg-gray-900 sm:px-2 px-4 my-auto min-h-screen py-8 sm:py-0">
      <div className="max-w-md w-full space-y-8 p-4 bg-white dark:bg-gray-800 rounded-md shadow">
        <div>
          <div className="flex flex-row items-center justify-center gap-2 mt-4 mb-2">
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
        {state?.error && (
          <div className="bg-red-50 border-l-4 border-red-400 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <ErrorXIcon className="h-5 w-5 text-red-400" />
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{state.error}</p>
              </div>
            </div>
          </div>
        )}
        <form className="mt-6 space-y-6" action={submitAction}>
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
                className="relative border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-700"
                placeholder="Email address"
                autoComplete="username"
              />
            </div>
            <div>
              <label htmlFor="password" className="">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  className="relative border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm dark:bg-gray-700"
                  placeholder="Password"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 cursor-pointer"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 stroke-gray-400 dark:stroke-dark-200" />
                  ) : (
                    <EyeIcon className="h-5 w-5 stroke-gray-400 dark:stroke-dark-200" />
                  )}
                </button>
              </div>
            </div>
          </div>
          <button
            type="submit"
            className={`btn-primary-long dark:text-white ${
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
        <div className="flex flex-row w-full items-center justify-center gap-4 mt-2">
          <div className="separator"></div>
          <div className="text-sm text-gray-500 dark:text-gray-500">Or</div>
          <div className="separator"></div>
        </div>
        <button
          className={`btn-secondary-long ${
            isGuestLoading ? "opacity-50 cursor-not-allowed" : ""
          }`}
          disabled={isGuestLoading}
          onClick={() => {}}
        >
          {isGuestLoading ? (
            <Loader loaderSize={[4, 4]} />
          ) : (
            "Continue as guest"
          )}
        </button>
        <div className="flex flex-col items-center justify-center text-sm">
          <div className="flex items-center gap-2 mt-2">
            <p className="text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} Dradic Technologies
            </p>
            <ThemeToggle />
          </div>
        </div>
      </div>
    </div>
  );
}
