import { useState, useEffect, useRef } from "react";
import { SearchBar } from "~/components/SearchBar";
import { PostsList } from "~/components/PostList";
import { useNavigate } from "react-router";
import { useAuth } from "~/contexts/AuthContext";
import Loader from "~/components/Loader";

export default function AdminHome() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const hasNavigated = useRef(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !hasNavigated.current) {
      hasNavigated.current = true;
      navigate("/admin/login");
    }
  }, [isLoading, isAuthenticated, navigate]);

  // Show loading state while checking authentication
  if (isLoading) {
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

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4">
      {/* Recent Posts */}
      <div className="flex flex-col mt-6 justify-center text-left mx-4">
        <h1 className="text-4xl font-semibold text-center my-12">
          Blog <span className="text-primary-500">CMS</span>
        </h1>
        <div className="flex flex-row items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
          <h1 className="font-semibold text-gray-600 dark:text-gray-400">
            All Posts
          </h1>
          <button
            onClick={() => navigate("/admin/new-post")}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors cursor-pointer"
          >
            New Post
          </button>
        </div>
        <SearchBar
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          placeholder="Search for a post..."
        />
        <ul className="flex flex-col mt-4 dark:bg-dark-400 bg-gray-100 rounded-xl p-4 divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700">
          <PostsList isAdmin={true} searchQuery={searchQuery} />
        </ul>
      </div>
    </div>
  );
}
