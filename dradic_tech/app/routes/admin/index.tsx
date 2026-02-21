import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { SearchBar } from "~/components/SearchBar";
import { useNavigate } from "react-router";
import { useAuth } from "~/contexts/AuthContext";
import Loader from "~/components/Loader";
import { RefreshIcon } from "~/components/Icons";
import PostsList from "~/components/PostList";
import { PostsSkeleton } from "~/components/PostList";

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
    <div className="w-full h-screen">
      <h1 className="text-4xl sm:text-6xl font-semibold text-center pb-8">
        Blog <span className="text-brand-600">CMS</span>
      </h1>
      {/* Recent Posts */}
      <div className="flex flex-row items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-2">
        <h1 className="font-semibold text-slate-600 dark:text-slate-400">
          All Posts
        </h1>
        <div className="flex items-center gap-4">
          <button
            onClick={handleRefresh}
            className="flex items-center gap-2 cursor-pointer text-slate-600 dark:text-slate-400 group hover:text-brand-500 dark:hover:text-brand-400"
            title="Refresh posts"
          >
            <RefreshIcon className="w-4 h-4 stroke-slate-600 dark:stroke-slate-400 group-hover:stroke-brand-500 dark:group-hover:stroke-brand-400" />
            Refresh
          </button>
          <button
            onClick={() => navigate("/admin/new-post")}
            className="px-4 py-2 bg-brand-600 text-white rounded-md hover:bg-brand-700 transition-colors cursor-pointer"
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
      <ul className="flex flex-col mt-4 glass border border-slate-200 dark:border-slate-800 rounded-xl divide-y divide-slate-200 dark:divide-slate-700">
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
