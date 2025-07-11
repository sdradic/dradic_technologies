import { useNavigate } from "react-router";
import { useState, useEffect, useCallback } from "react";
import Footer from "~/components/Footer";
import SectionHeader from "~/components/SectionHeader";
import Navbar from "~/components/Navbar";
import Loader from "~/components/Loader";
import { fetchBlogPosts } from "~/module/apis";
import { formatDate } from "~/module/utils";
import type { BlogPost } from "~/module/types";
import { RefreshIcon } from "~/components/Icons";

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const fetchPosts = useCallback(async (force: boolean = false) => {
    try {
      if (force) {
        setIsRefreshing(true);
      } else {
        setIsLoading(true);
      }

      const fetchedPosts = await fetchBlogPosts(force);

      console.log("fetchedPosts", fetchedPosts);

      if (fetchedPosts.length > 0) {
        setPosts(fetchedPosts);
        setError(null);
      } else {
        setError("No blog posts found.");
      }
    } catch (error) {
      console.error("Error loading blog posts:", error);
      setError("Failed to load blog posts. Please try again later.");
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, []);

  const handleReload = useCallback(() => {
    fetchPosts(true); // Force refresh
  }, [fetchPosts]);

  useEffect(() => {
    fetchPosts(); // Initial load
  }, [fetchPosts]);

  return (
    <div className="inverse-gradient-background min-h-screen flex flex-col justify-between">
      <Navbar />
      <div className="flex flex-col max-w-6xl mx-auto px-4 py-12 items-center">
        <SectionHeader title="Blog Posts" className="text-center flex-1" />
        <button
          onClick={handleReload}
          disabled={isLoading || isRefreshing}
          className={`btn-primary justify-center mb-4 ${
            isLoading || isRefreshing ? "opacity-50 cursor-not-allowed" : ""
          }`}
          title="Reload posts"
        >
          <RefreshIcon className="w-4 h-4" />
          {isLoading ? "Loading..." : isRefreshing ? "Reloading..." : "Reload"}
        </button>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 w-full max-w-2xl">
            <p>{error}</p>
            <button
              onClick={handleReload}
              className="mt-2 text-red-700 underline hover:text-red-900"
            >
              Try again
            </button>
          </div>
        )}

        <ul className="flex flex-wrap gap-4">
          {isLoading && posts.length === 0 ? (
            <div className="flex justify-center items-center min-h-[400px] w-full">
              <Loader showText={true} text="Loading posts..." />
            </div>
          ) : (
            posts.map((post) => (
              <li
                key={post.slug}
                className="mx-auto max-w-[300px] p-4 h-full rounded-lg border border-gray-200 bg-white cursor-pointer hover:underline hover:scale-105 transition-all duration-300"
                onClick={() => {
                  navigate(`/blog/${post.slug}`, { state: { post } });
                }}
              >
                <img
                  className="size-48 object-cover w-full"
                  src={post?.image || "/blog_post_placeholder.png"}
                  alt={post.title}
                />
                <div className="text-blue-600 text-lg font-medium">
                  {post.title.slice(0, 40) + "..."}
                </div>
                <p className="text-sm text-gray-500 py-2">
                  {formatDate(post.created_at)}
                </p>
              </li>
            ))
          )}
        </ul>
      </div>
      <Footer />
    </div>
  );
}
