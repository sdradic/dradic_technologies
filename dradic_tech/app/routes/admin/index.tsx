import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { SearchBar } from "~/components/SearchBar";
import { useNavigate } from "react-router";
import { useAuth } from "~/contexts/AuthContext";
import Loader from "~/components/Loader";
import { RefreshIcon } from "~/components/Icons";
import { PostsList, PostsSkeleton } from "~/components/PostList";

export default function AdminHome() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [refreshKey, setRefreshKey] = useState(0);
  const hasNavigated = useRef(false);

  const handleRefresh = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

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
    <div className="w-full">
      <h1 className="text-4xl sm:text-6xl font-semibold text-center pb-8">
        Blog <span className="text-primary-500">CMS</span>
      </h1>
      {/* Recent Posts */}
      <div className="flex flex-row items-center justify-between border-b border-gray-200 dark:border-gray-700 pb-2">
        <h1 className="font-semibold text-gray-600 dark:text-gray-400">
          All Posts
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 cursor-pointer text-gray-600 dark:text-gray-400 group hover:text-primary-500 dark:hover:text-primary-400"
            title="Refresh posts"
          >
            <RefreshIcon className="w-4 h-4 stroke-gray-600 dark:stroke-gray-400 group-hover:stroke-primary-500 dark:group-hover:stroke-primary-400" />
            Refresh
          </button>
          <button
            onClick={() => navigate("/admin/new-post")}
            className="px-4 py-2 bg-primary-500 text-white rounded-md hover:bg-primary-600 transition-colors cursor-pointer"
          >
            New Post
          </button>
        </div>
      </div>
      <SearchBar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        placeholder="Search for a post..."
      />
      <ul className="flex flex-col mt-4 dark:bg-dark-400 bg-gray-100 rounded-xl divide-y divide-gray-200 dark:divide-gray-700">
        <Suspense fallback={<PostsSkeleton />}>
          <PostsList
            reloadTrigger={refreshKey}
            isAdmin={true}
            searchQuery={searchQuery}
          />
        </Suspense>
      </ul>
    </div>
  );
}
