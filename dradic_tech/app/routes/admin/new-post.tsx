import { useEffect, useRef } from "react";
import { useNavigate } from "react-router";
import { useAuth } from "~/contexts/AuthContext";
import PostEditor from "~/components/PostEditor";
import Loader from "~/components/Loader";

export default function NewPost() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const hasNavigated = useRef(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated && !hasNavigated.current) {
      hasNavigated.current = true;
      navigate("/admin/login");
    }
  }, [isAuthLoading, isAuthenticated, navigate]);

  // Show loading state while checking authentication
  if (isAuthLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return <PostEditor isNewPost={true} />;
}
