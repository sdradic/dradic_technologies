import { useEffect, useState, useCallback } from "react";
import { fetchBlogPosts } from "~/modules/apis";
import type { BlogPost } from "~/modules/types";
import Footer from "~/components/Footer";
import PostsList from "~/components/PostsList";
import Editor from "~/components/Editor";
import MarkdownPreview from "~/components/MarkdownPreview";
import Navbar from "~/components/Navbar";
import { Toaster } from "react-hot-toast";
import { useAuth } from "~/contexts/AuthContext";

// Module-level cache for posts
let postsCache: BlogPost[] | null = null;

export default function Home() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null);
  const [selectedPostContent, setSelectedPostContent] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);
  const [isCreatingPost, setIsCreatingPost] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isGuest } = useAuth();

  const fetchPosts = useCallback(async () => {
    // Use cached posts if available while fetching fresh data
    if (postsCache) {
      setPosts(postsCache);
    }

    try {
      setIsLoading(true);
      const fetchedPosts = await fetchBlogPosts();

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
          `Failed to load ${fetchedPosts.length - validPosts.length} blog posts`
        );
      }

      postsCache = validPosts;
      setPosts(validPosts);
      setError(null);
    } catch (error) {
      console.error("Error loading blog posts:", error);
      setError("Failed to load blog posts. Please try again later.");

      // If we have cached posts, use them
      if (postsCache) {
        setPosts(postsCache);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initial data fetch
  useEffect(() => {
    setIsMounted(true);
    fetchPosts();
  }, [fetchPosts]);

  return (
    <div
      className={`flex flex-col min-h-screen inverse-gradient-background transition-opacity duration-300 ease-in-out ${
        isMounted ? "opacity-100" : "opacity-0"
      }`}
    >
      <Navbar
        selectedPost={selectedPost}
        setSelectedPost={setSelectedPost}
        selectedPostContent={selectedPostContent}
        isCreatingPost={isCreatingPost}
        setIsCreatingPost={setIsCreatingPost}
      />
      <Toaster position="top-center" />
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded m-4">
          <p>{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-red-700 underline hover:text-red-900"
          >
            Refresh page
          </button>
        </div>
      )}
      <div className="flex flex-col lg:flex-row w-full px-4 lg:px-12 flex-1 overflow-hidden">
        {/* Sidebar - Always visible on large screens, hidden when post is selected on smaller screens */}
        <div
          className={`w-full lg:w-1/3 xl:w-1/4 lg:pr-6 ${
            selectedPost ? "hidden lg:block" : "block"
          }`}
        >
          <div className="h-full overflow-y-auto pb-4">
            <PostsList
              posts={posts}
              setSelectedPost={setSelectedPost}
              setSelectedPostContent={setSelectedPostContent}
              isLoading={isLoading}
              setIsCreatingPost={setIsCreatingPost}
              onReload={fetchPosts}
              isSidebar={true}
            />
          </div>
        </div>

        {/* Editor/Markdown Preview - Takes full width on small screens, shows next to sidebar on large screens */}
        {selectedPost && (
          <div
            className={`flex-1 flex flex-col lg:flex-row items-start w-full gap-4 py-4 ${
              selectedPost ? "block" : "hidden lg:block"
            }`}
          >
            {isGuest === false && (
              <div className="w-full lg:w-1/2 h-full">
                <Editor
                  selectedPost={selectedPost}
                  selectedPostContent={selectedPostContent}
                  setSelectedPostContent={setSelectedPostContent}
                />
              </div>
            )}
            <div className={`w-full ${isGuest ? "lg:w-full" : "lg:w-1/2"}`}>
              <MarkdownPreview
                selectedPost={selectedPost}
                selectedPostContent={selectedPostContent}
              />
            </div>
          </div>
        )}

        {/* Show empty state when no post is selected on large screens */}
        {!selectedPost && (
          <div className="hidden lg:flex flex-1 items-center justify-center">
            <div className="text-center p-8 bg-white bg-opacity-80 rounded-lg shadow-md">
              <h2 className="text-2xl font-bold mb-2">No Post Selected</h2>
              <p className="text-gray-600">
                Select a post from the sidebar or create a new one
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}
