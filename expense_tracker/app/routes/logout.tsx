import { useAuth } from "~/contexts/AuthContext";
import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import Loader from "~/components/Loader";
import { TallyUpLogo } from "~/components/Icons";

export default function Logout() {
  const { logout, handleGuestLogin, isGuest, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const hasTriggeredLogout = useRef(false);

  useEffect(() => {
    // If already logged out, redirect immediately
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Only trigger logout once
    if (hasTriggeredLogout.current) return;
    hasTriggeredLogout.current = true;

    const performLogout = async () => {
      try {
        if (isGuest) {
          handleGuestLogin(false);
        } else {
          await logout();
        }
      } catch (error) {
        console.error("Logout error:", error);
        navigate("/login");
      }
    };

    performLogout();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, navigate]); // Intentionally excluding logout functions to prevent infinite loops

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 sm:px-2 px-8 max-h-screen">
      <div className="flex flex-col items-center justify-center max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
        <TallyUpLogo className="w-18 h-18 stroke-primary-400 fill-primary-400 dark:stroke-primary-600 dark:fill-primary-600" />
        <Loader message="Logging out..." loaderSize={[12, 12]} />
      </div>
    </div>
  );
}
