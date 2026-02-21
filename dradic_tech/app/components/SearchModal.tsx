import { useEffect, useState } from "react";
import { XIcon } from "./Icons";
import type { BlogPostWithSeparatedContent } from "~/modules/types";
import { SearchBar } from "./SearchBar";
import { blogStore } from "~/modules/blogStore";

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal = ({ isOpen, onClose }: SearchModalProps) => {
  const [filteredPosts, setFilteredPosts] = useState<
    BlogPostWithSeparatedContent[]
  >([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState<BlogPostWithSeparatedContent[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Subscribe to blog store updates
  useEffect(() => {
    const unsubscribe = blogStore.subscribe(() => {
      const newPosts = blogStore.getPosts();
      setPosts(newPosts);
      setIsLoading(false);
    });

    // Get initial posts if they're already loaded
    const initialPosts = blogStore.getPosts();

    if (initialPosts.length > 0) {
      setPosts(initialPosts);
      setIsLoading(false);
    }

    return () => {
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter(
        (post) =>
          post.metadata.title
            .toLowerCase()
            .includes(searchQuery.toLowerCase()) ||
          post.content?.toLowerCase().includes(searchQuery.toLowerCase()),
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
      <div
        className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Escape") {
            onClose();
          }
        }}
        tabIndex={-1}
        role="presentation"
      />

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-6">
        <div className="bg-white dark:bg-slate-950 rounded-3xl shadow-xl w-full max-w-4xl max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between py-6 px-6 border-b border-slate-200 dark:border-slate-700">
            <h2 className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
              Search Posts
            </h2>
            <button
              onClick={onClose}
              className="rounded-lg transition-colors cursor-pointer"
            >
              <XIcon className="size-6 stroke-slate-500 dark:stroke-slate-400 hover:stroke-brand-500 dark:hover:stroke-brand-400" />
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
              <div className="animate-pulse space-y-4 px-6 py-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="flex gap-4">
                    <div className="w-32 h-24 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
                    <div className="flex-1 space-y-2">
                      <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
                      <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : posts.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-slate-500 dark:text-slate-400">
                  No posts available. Please visit the blog page first.
                </p>
              </div>
            ) : (
              <div className="px-6 py-6">
                {filteredPosts.length > 0 ? (
                  <ul className="divide-y divide-slate-200 dark:divide-slate-700">
                    {filteredPosts.map((post) => (
                      <li key={post.metadata.slug} className="py-2">
                        <a
                          href={`/blog/${post.metadata.slug}`}
                          className="flex gap-4 p-2 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-lg transition-colors"
                          onClick={onClose}
                        >
                          <img
                            src={
                              post.metadata?.image ||
                              "/assets/blog_post_placeholder.webp"
                            }
                            alt={post.metadata.title}
                            className="object-cover w-32 h-24 rounded-md"
                          />
                          <div className="flex flex-col gap-2 items-start justify-center">
                            <h3 className="text-sm font-semibold text-slate-900 dark:text-slate-200">
                              {post.metadata.title}
                            </h3>
                            <p className="text-xs text-slate-500 dark:text-slate-400">
                              {new Date(
                                post.metadata.created_at,
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
                    <p className="text-slate-500 dark:text-slate-400">
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
