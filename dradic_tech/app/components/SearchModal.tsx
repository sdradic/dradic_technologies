import { useEffect, useState } from "react";
import { XIcon } from "./Icons";
import type { BlogPostWithSeparatedContent } from "~/modules/types";
import { fetchBlogPosts } from "~/modules/api";
import { SearchBar } from "./SearchBar";
import { placeholderImage } from "~/modules/store";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [posts, setPosts] = useState<BlogPostWithSeparatedContent[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<
    BlogPostWithSeparatedContent[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      try {
        const fetchedPosts = await fetchBlogPosts();
        setPosts(fetchedPosts);
        setFilteredPosts(fetchedPosts);
      } catch (error) {
        console.error("Failed to fetch posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (isOpen) {
      loadPosts();
    }
  }, [isOpen]);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(
        (post) =>
          post.metadata.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          post.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 backdrop-blur-lg z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4">
        <div className="bg-white dark:bg-dark-400 rounded-lg shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
              Search Posts
            </h2>
            <button
              onClick={onClose}
              className="p-2 rounded-lg transition-colors cursor-pointer"
            >
              <XIcon className="size-6 stroke-gray-500 dark:stroke-gray-400 hover:stroke-primary-500 dark:hover:stroke-primary-500" />
            </button>
          </div>

          {/* Search Bar */}
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            placeholder="Search for a post..."
          />

          {/* Results */}
          <div className="overflow-y-auto max-h-[60vh]">
            {isLoading ? (
              <div className="p-4">
                <div className="animate-pulse space-y-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex gap-4">
                      <div className="w-32 h-24 bg-gray-200 dark:bg-gray-700 rounded-md"></div>
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                        <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4">
                {filteredPosts.length > 0 ? (
                  <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredPosts.map((post) => (
                      <li key={post.metadata.slug} className="py-2">
                        <a
                          href={`/blog/${post.metadata.slug}`}
                          className="flex gap-4 p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          onClick={onClose}
                        >
                          <img
                            src={post.metadata?.image || placeholderImage}
                            alt={post.metadata.title}
                            className="object-cover w-32 h-24 rounded-md"
                          />
                          <div className="flex flex-col gap-2 items-start justify-center">
                            <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-200">
                              {post.metadata.title}
                            </h3>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              {new Date(
                                post.metadata.created_at
                              ).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              })}
                            </p>
                          </div>
                        </a>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 dark:text-gray-400">
                      {searchQuery
                        ? "No posts found matching your search."
                        : "No posts available."}
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};
