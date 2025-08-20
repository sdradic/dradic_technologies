import { use, useRef } from "react";
import { fetchBlogPosts } from "~/modules/apis";
import type { BlogPostWithSeparatedContent } from "~/modules/types";

// Manual cache to ensure stability
export const blogPostsCache = new Map<
  string,
  Promise<BlogPostWithSeparatedContent[]>
>();

function useBlogPostsData({ reloadTrigger }: { reloadTrigger: number }) {
  const lastReloadTrigger = useRef(0);

  // Create a stable cache key
  const cacheKey = `blog-posts-${reloadTrigger}`;

  // Only clear cache when reloadTrigger actually changes
  if (reloadTrigger !== lastReloadTrigger.current && reloadTrigger > 0) {
    blogPostsCache.delete(cacheKey);
    lastReloadTrigger.current = reloadTrigger;
  }

  // Get or create the promise
  if (!blogPostsCache.has(cacheKey)) {
    const promise = fetchBlogPosts();
    blogPostsCache.set(cacheKey, promise);
  }

  const posts = use(blogPostsCache.get(cacheKey)!);
  return posts;
}

// Export the featured post (most recent one)
export function useFeaturedPost({ reloadTrigger }: { reloadTrigger: number }) {
  const posts = useBlogPostsData({ reloadTrigger });
  if (!posts || posts.length === 0) return null;
  // Sort by created_at descending, fallback to updated_at if needed
  const sorted = [...posts].sort((a, b) => {
    const aDate = new Date(
      a.metadata.created_at || a.metadata.updated_at || 0,
    ).getTime();
    const bDate = new Date(
      b.metadata.created_at || b.metadata.updated_at || 0,
    ).getTime();
    return bDate - aDate;
  });
  return sorted[0];
}

export default useBlogPostsData;
