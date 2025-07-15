import { useEffect } from "react";
import { Outlet, useLocation, useNavigate } from "react-router";
import { useAuth } from "~/contexts/AuthContext";
import Loader from "~/components/Loader";

const protectedRoutes = ["/"];

export default function AppShell() {
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const requiredAuth = protectedRoutes.includes(location.pathname);

  useEffect(() => {
    if (requiredAuth && !isAuthenticated) {
      navigate("/login", { replace: true });
    } else {
      navigate("/");
    }
  }, [isAuthenticated]);

  if (requiredAuth && isAuthenticated === false) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen inverse-gradient-background">
        <Loader />
      </div>
    );
  }

  return <Outlet />;
}
