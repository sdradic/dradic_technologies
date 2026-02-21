import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import useBlogPostsData from "~/hooks/useBlogPostsData";
import type { BlogPostWithSeparatedContent } from "~/modules/types";

interface PostListProps {
  isAdmin?: boolean;
  searchQuery?: string;
  reloadTrigger: number;
  showLatestPost?: boolean;
  max?: number;
  layout?: "row" | "grid";
}

function PostsList({
  isAdmin = false,
  searchQuery = "",
  reloadTrigger,
  showLatestPost = true,
  max = 10,
  layout = "row",
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
      const filtered = posts.filter((post: BlogPostWithSeparatedContent) =>
        post.metadata.title.toLowerCase().includes(trimmedQuery),
      );
      setFilteredPosts(filtered);
    }
  }, [searchQuery, posts]);

  useEffect(() => {
    setIsLoading(false);
  }, [posts]);

  const baseUrl = isAdmin ? "/admin" : "/blog";
  const firstPost = showLatestPost ? 0 : 1;

  // Layout classes
  const containerClass =
    layout === "grid" ? "grid md:grid-cols-3 gap-8" : "flex flex-col gap-4";

  return (
    <>
      {isLoading ? (
        <PostsSkeleton layout={layout} max={max} />
      ) : (
        <ul className={containerClass}>
          {filteredPosts
            .slice(firstPost, max)
            .map((post: BlogPostWithSeparatedContent) => (
              <NavLink
                key={post.metadata.slug}
                to={`${baseUrl}/${post.metadata.slug}`}
                state={{ post }}
                className="contents"
              >
                <li
                  className={
                    layout === "grid"
                      ? "flex flex-col h-full gap-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden transition-all"
                      : "flex flex-row gap-4 p-4 cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
                  }
                >
                  <img
                    src={
                      post.metadata?.image ||
                      "/assets/blog_post_placeholder.webp"
                    }
                    alt={post.metadata.title}
                    className={
                      layout === "grid"
                        ? "object-cover w-full h-48 rounded-t-2xl"
                        : "object-cover w-32 h-24 rounded-2xl"
                    }
                  />
                  <div
                    className={
                      layout === "grid"
                        ? "flex flex-col gap-2 items-start justify-center p-6"
                        : "flex flex-col gap-2 items-start justify-center"
                    }
                  >
                    <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                      {post.metadata.title}
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
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
            ))}
        </ul>
      )}
    </>
  );
}

export default PostsList;

// Skeleton loader supports max and layout props for flexible preview rendering
export function PostsSkeleton({
  layout = "row",
  max = 3,
}: {
  layout?: "row" | "grid";
  max?: number;
}) {
  const containerClass =
    layout === "grid" ? "grid md:grid-cols-3 gap-8" : "flex flex-col gap-4";
  return (
    <ul className={containerClass}>
      {Array.from({ length: max }).map((_, i) => (
        <li
          key={i}
          className={
            layout === "grid"
              ? "flex flex-col h-full gap-4 border border-slate-200 dark:border-slate-800 rounded-2xl bg-white dark:bg-slate-900 shadow-sm overflow-hidden"
              : "flex flex-row gap-4 w-full py-4 px-2 rounded-xl"
          }
        >
          <div
            className={
              layout === "grid"
                ? "w-full h-48 rounded-t-2xl bg-slate-200 dark:bg-slate-700 animate-pulse"
                : "w-32 h-24 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse"
            }
          ></div>
          <div
            className={
              layout === "grid"
                ? "flex flex-col gap-2 items-start justify-center p-6"
                : "flex flex-col gap-2 items-start justify-center"
            }
          >
            <div className="w-24 h-4 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
            <div className="w-16 h-3 bg-slate-200 dark:bg-slate-700 rounded animate-pulse"></div>
          </div>
        </li>
      ))}
    </ul>
  );
}
