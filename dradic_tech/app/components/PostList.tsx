import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { fetchBlogPosts } from "~/modules/api";
import type { BlogPostWithSeparatedContent } from "~/modules/types";
import { placeholderImage } from "~/modules/store";

interface PostListProps {
  isAdmin?: boolean;
  searchQuery?: string;
}

export function PostsList({
  isAdmin = false,
  searchQuery = "",
}: PostListProps) {
  const [posts, setPosts] = useState<BlogPostWithSeparatedContent[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<
    BlogPostWithSeparatedContent[]
  >([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      const posts = await fetchBlogPosts();
      setPosts(posts);
      setFilteredPosts(posts);
      setIsLoading(false);
    };
    loadPosts();
  }, []);

  // Handle search filtering
  useEffect(() => {
    const trimmedQuery = searchQuery.trim().toLowerCase();
    if (trimmedQuery === "") {
      setFilteredPosts(posts);
    } else {
      const filtered = posts.filter((post) =>
        post.metadata.title.toLowerCase().includes(trimmedQuery),
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  if (isLoading) {
    return <PostsSkeleton />;
  }

  const baseUrl = isAdmin ? "/admin" : "/blog";

  return (
    <>
      {filteredPosts && filteredPosts.length > 0 ? (
        filteredPosts.map((post: BlogPostWithSeparatedContent) => (
          <NavLink
            key={post.metadata.slug}
            to={`${baseUrl}/${post.metadata.slug}`}
          >
            <li className="flex flex-row gap-4 px-2 py-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-500 rounded-lg">
              <img
                src={post.metadata?.image || placeholderImage}
                alt={post.metadata.title}
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
                    },
                  )}
                </p>
              </div>
            </li>
          </NavLink>
        ))
      ) : (
        <li className="text-center text-gray-500 dark:text-gray-400">
          No posts found
        </li>
      )}
    </>
  );
}

export function PostsSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <li key={i} className="flex flex-row gap-4 w-full py-4">
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
