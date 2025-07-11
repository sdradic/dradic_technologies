import { Outlet, Navigate } from "react-router";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { useAuth } from "../contexts/AuthContext";
import Loader from "../components/Loader";

export default function Layout() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading state while checking auth
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader message="Loading..." size={[12, 12]} />
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Show the protected layout
  return (
    <div className="flex h-screen overflow-hidden">
      {/* Desktop Sidebar - only show on lg and above */}
      <div className="hidden md:block">
        <Sidebar />
      </div>

      {/* Main content area */}
      <main className="flex-1 overflow-auto">
        {/* Mobile/Tablet Navbar - only show on screens smaller than lg */}
        <div className="md:hidden">
          <Navbar />
        </div>
        <Outlet />
      </main>
    </div>
  );
}
