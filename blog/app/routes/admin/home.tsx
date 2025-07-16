import { useEffect, useState } from "react";
import { SearchBar } from "~/components/SearchBar";
import { fetchBlogPosts } from "~/modules/api";
import type { BlogPostWithSeparatedContent } from "~/modules/types";
import { useNavigate, NavLink } from "react-router";
import { useAuth } from "~/contexts/AuthContext";
import Loader from "~/components/Loader";
import { placeholderImage } from "~/modules/store";

function AdminPostsList({
  posts,
  isLoading,
}: {
  posts: BlogPostWithSeparatedContent[];
  isLoading: boolean;
}) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-4">
        {[...Array(3)].map((_, i) => (
          <li key={i} className="flex flex-row gap-4 px-2 py-4 animate-pulse">
            <div className="w-32 h-24 bg-gray-300 dark:bg-gray-600 rounded-md"></div>
            <div className="flex flex-col gap-2 items-start justify-center flex-1">
              <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-1/2"></div>
            </div>
          </li>
        ))}
      </div>
    );
  }

  return (
    <>
      {posts && posts.length > 0 ? (
        posts.map((post: BlogPostWithSeparatedContent) => (
          <NavLink key={post.metadata.slug} to={`/admin/${post.metadata.slug}`}>
            <li className="flex flex-row gap-4 px-2 py-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-500 rounded-lg">
              <img
                src={post.metadata?.image || placeholderImage}
                className="object-cover w-32 h-24 rounded-md"
              />
              <div className="flex flex-col gap-2 items-start justify-center">
                <h3 className="text-sm font-semibold dark:text-gray-200">
                  {post.metadata.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(post.metadata.created_at).toLocaleDateString(
                    "en-US",
                    {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    }
                  )}
                </p>
              </div>
            </li>
          </NavLink>
        ))
      ) : (
        <li className="flex flex-col items-center justify-center py-8 text-gray-500 dark:text-gray-400">
          <p>No posts found</p>
        </li>
      )}
    </>
  );
}

export default function AdminHome() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<BlogPostWithSeparatedContent[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<
    BlogPostWithSeparatedContent[]
  >([]);
  const [isLoadingPosts, setIsLoadingPosts] = useState(true);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Load posts on initial mount only
  useEffect(() => {
    if (isAuthenticated) {
      const loadPosts = async () => {
        try {
          const fetchedPosts = await fetchBlogPosts();
          setPosts(fetchedPosts);
          setFilteredPosts(fetchedPosts);
        } catch (error) {
          console.error("Failed to fetch posts:", error);
        } finally {
          setIsLoadingPosts(false);
        }
      };
      loadPosts();
    }
  }, [isAuthenticated]);

  // Handle search filtering
  useEffect(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (trimmedQuery === "") {
      // If search is empty, show all posts
      setFilteredPosts(posts);
    } else {
      // Filter posts based on search query
      const filtered = posts.filter((post) =>
        post.metadata.title.toLowerCase().includes(trimmedQuery)
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

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
        <SearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
        <ul className="flex flex-col mt-4 dark:bg-dark-400 bg-gray-100 rounded-xl p-4 divide-y divide-gray-200 dark:divide-gray-700">
          <AdminPostsList posts={filteredPosts} isLoading={isLoadingPosts} />
        </ul>
      </div>
    </div>
  );
}
