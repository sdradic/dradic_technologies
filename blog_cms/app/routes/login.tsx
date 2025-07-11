import { useNavigate, Navigate } from "react-router";
import { useState, useEffect } from "react";
import { useAuth } from "../contexts/AuthContext";
import { Toaster, toast } from "react-hot-toast";
import Loader from "~/components/Loader";

export default function Login() {
  const {
    login,
    handleGuestLogin,
    isAuthenticated,
    isLoading: isAuthLoading,
  } = useAuth();
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(false);
  const [isGuestLoading, setIsGuestLoading] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // Redirect if already authenticated
  useEffect(() => {
    if (!isAuthLoading) {
      setIsCheckingAuth(false);
      if (isAuthenticated) {
        navigate("/");
      }
    }
  }, [isAuthLoading, isAuthenticated, navigate]);

  if (isCheckingAuth || isAuthLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader showText={true} />
      </div>
    );
  }

  const handleLogin = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      toast.promise(login(email, password), {
        loading: "Signing in...",
        success: () => {
          navigate("/");
          return "Successfully signed in!";
        },
        error:
          "Failed to sign in. Please check your credentials and try again.",
      });
    } catch (err) {
      toast.error(
        "Failed to sign in. Please check your credentials and try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuest = (isLoggingIn: boolean) => {
    handleGuestLogin(isLoggingIn);
    navigate("/");
    toast.success("Logged in as guest");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 sm:px-2 px-8 inverse-gradient-background">
      <Toaster position="top-center" />
      <div className="max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
        <div>
          <div className="flex flex-row items-center justify-center gap-2 mt-4 mb-2">
            <img
              src="/dradic_tech_logo.png"
              alt="Dradic Technologies"
              className={` h-16 w-auto object-contain`}
            />
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
            Welcome to Dradic CMS
          </h2>
          <div className="flex flex-col items-center justify-center gap-1 mt-2">
            <h3 className="text-gray-500 dark:text-gray-400 mb-8 text-center">
              Sign in to your account to continue
            </h3>
          </div>
        </div>
        <form
          className="mt-6 space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            handleLogin(
              e.currentTarget.email.value,
              e.currentTarget.password.value
            );
          }}
        >
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
                className="relative border border-gray-300 dark:border-gray-600 placeholder-gray-500 dark:placeholder-gray-400 text-gray-900 dark:text-white rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm dark:bg-gray-700"
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
        <div className="flex flex-row w-full items-center justify-center gap-4 mt-2">
          <div className="separator"></div>
          <div className="text-sm text-gray-500 dark:text-gray-500">Or</div>
          <div className="separator"></div>
        </div>
        <div className="mt-6">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              handleGuest(true);
            }}
            disabled={isGuestLoading}
            className={`btn-secondary-long ${
              isGuestLoading ? "opacity-75 cursor-not-allowed" : ""
            }`}
          >
            {isGuestLoading ? "Please wait..." : "Continue as Guest"}
          </button>
        </div>
      </div>
    </div>
  );
}
