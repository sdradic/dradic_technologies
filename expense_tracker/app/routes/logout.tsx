import { useNavigate } from "react-router";
import { useAuth } from "~/contexts/AuthContext";
import { useEffect } from "react";
import Loader from "~/components/Loader";
import { TallyUpLogo } from "~/components/Icons";

export default function Logout() {
  const { logout, handleGuestLogin, isGuest } = useAuth();
  const navigate = useNavigate();
  useEffect(() => {
    const performLogout = async () => {
      try {
        if (isGuest) {
          handleGuestLogin(false);
        } else {
          await logout();
        }
        // Always navigate to login after logout attempt
        navigate("/login", { replace: true });
      } catch (error) {
        console.error("Error during logout:", error);
        navigate("/login", { replace: true });
      }
    };

    // Add a small delay to ensure any UI updates complete
    const timer = setTimeout(() => {
      performLogout();
    }, 100);

    return () => clearTimeout(timer);
  }, [logout, navigate, isGuest, handleGuestLogin]);
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-900 sm:px-2 px-8 max-h-screen">
      <div className="flex flex-col items-center justify-center max-w-md w-full space-y-8 p-8 bg-white dark:bg-gray-800 rounded-lg shadow">
        <TallyUpLogo className="w-18 h-18 stroke-primary-400 fill-primary-400 dark:stroke-primary-600 dark:fill-primary-600" />
        <Loader message="Logging out..." loaderSize={[12, 12]} />
      </div>
    </div>
  );
}
