import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import useBlogPostsData from "~/hooks/useBlogPostsData";
import type { BlogPostWithSeparatedContent } from "~/modules/types";

interface PostListProps {
  isAdmin?: boolean;
  searchQuery?: string;
  reloadTrigger: number;
}

export function PostsList({
  isAdmin = false,
  searchQuery = "",
  reloadTrigger,
}: PostListProps) {
  const [filteredPosts, setFilteredPosts] = useState<
    BlogPostWithSeparatedContent[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  // Use the new hook with refresh trigger
  const posts = useBlogPostsData({ reloadTrigger });

  // Handle search filtering
  useEffect(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (trimmedQuery === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) =>
        post.metadata.title.toLowerCase().includes(searchQuery),
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  useEffect(() => {
    setIsLoading(false);
  }, [posts]);

  const baseUrl = isAdmin ? "/admin" : "/blog";

  return (
    <>
      {isLoading ? (
        <PostsSkeleton />
      ) : (
        filteredPosts.slice(1, 10).map((post: BlogPostWithSeparatedContent) => (
          <NavLink
            key={post.metadata.slug}
            to={`${baseUrl}/${post.metadata.slug}`}
          >
            <li className="flex flex-row gap-4 p-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-300 rounded-xl">
              <img
                src={
                  post.metadata?.image || "/assets/blog_post_placeholder.webp"
                }
                alt={post.metadata.title}
                className="object-cover w-32 h-24 rounded-2xl"
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
                    },
                  )}
                </p>
              </div>
            </li>
          </NavLink>
        ))
      )}
    </>
  );
}

export function PostsSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <li key={i} className="flex flex-row gap-4 w-full py-4 px-2 rounded-xl">
          <div className="w-32 h-24 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div className="flex flex-col gap-2 items-start justify-center">
            <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          </div>
        </li>
      ))}
    </>
  );
}
