import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import Footer from "~/components/Footer";
import SectionHeader from "~/components/SectionHeader";
import Navbar from "~/components/Navbar";
import Loader from "~/components/Loader";
import { fetchPostsFromFirebase } from "~/module/apis";
import { formatDate } from "~/module/utils";
import type { BlogPost } from "~/module/types";

// Create a module-level cache that persists between route changes
let postsCache: BlogPost[] | null = null;

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      // If we have cached posts, use them while fetching fresh data
      if (postsCache) {
        setPosts(postsCache);
      }

      try {
        setIsLoading(true);
        const fetchedPosts = await fetchPostsFromFirebase();
        // Filter out any posts that failed to load
        const validPosts = fetchedPosts.filter(
          (post) =>
            post.content && !post.content.includes("Error loading content")
        );

        if (validPosts.length === 0 && fetchedPosts.length > 0) {
          setError(
            "Failed to load blog posts. Please check your connection and refresh the page."
          );
        } else if (validPosts.length < fetchedPosts.length) {
          console.warn(
            `Failed to load ${
              fetchedPosts.length - validPosts.length
            } blog posts`
          );
        }

        postsCache = validPosts;
        setPosts(validPosts);
      } catch (error) {
        console.error("Error loading blog posts:", error);
        setError("Failed to load blog posts. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="inverse-gradient-background min-h-screen flex flex-col justify-between">
      <Navbar />
      <div className="flex flex-col max-w-6xl mx-auto px-4 py-12 items-center">
        <SectionHeader title="Blog Posts" className="text-center" />

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6 w-full max-w-2xl">
            <p>{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="mt-2 text-red-700 underline hover:text-red-900"
            >
              Refresh page
            </button>
          </div>
        )}

        <ul className="flex flex-wrap gap-4">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px] w-full">
              <Loader
                showText={true}
                text={
                  posts.length > 0 ? "Loading updates..." : "Loading posts..."
                }
              />
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
