import type { BlogPost, BlogPostMetadata } from "./types";
import { handleSaveLocalStoredBlogMetadata } from "./utils";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

// Module-level cache for posts metadata
let cachedPostsMetadata: BlogPostMetadata[] | null = null;
let lastFetchTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export async function fetchSinglePost(slug: string): Promise<BlogPost | null> {
  try {
    const response = await fetch(`${API_BASE_URL}/blog/posts/${slug}`);
    if (!response.ok) {
      console.error(`Error fetching post ${slug}: ${response.statusText}`);
      return null;
    }
    const post: BlogPost = await response.json();
    return post;
  } catch (error) {
    console.error(`Error fetching post ${slug}:`, error);
    return null;
  }
}

export async function fetchBlogPosts(
  force: boolean = false
): Promise<BlogPost[]> {
  try {
    // Check cache first unless force refresh
    const now = Date.now();
    if (!force && cachedPostsMetadata && now - lastFetchTime < CACHE_DURATION) {
      return cachedPostsMetadata.map((metadata) => ({
        ...metadata,
        content: "", // No content for metadata-only responses
      }));
    }

    const response = await fetch(`${API_BASE_URL}/blog/posts-metadata`);
    if (!response.ok) {
      throw new Error(`Failed to fetch posts metadata: ${response.statusText}`);
    }

    const postsMetadata: BlogPostMetadata[] = await response.json();

    // Update cache
    cachedPostsMetadata = postsMetadata;
    lastFetchTime = now;

    // Save to localStorage for offline access
    handleSaveLocalStoredBlogMetadata(postsMetadata);

    // Return posts without content (metadata-only)
    const posts: BlogPost[] = postsMetadata.map((metadata) => ({
      ...metadata,
      content: "", // No content for listing view
    }));

    return posts;
  } catch (error) {
    console.error("Error loading blog posts:", error);

    // Return cached data if available
    if (cachedPostsMetadata) {
      return cachedPostsMetadata.map((metadata) => ({
        ...metadata,
        content: "",
      }));
    }

    // Fall back to localStorage
    const localStoredBlogMetadata = localStorage.getItem(
      "localStoredBlogMetadata"
    );
    if (localStoredBlogMetadata) {
      const localPosts: BlogPostMetadata[] = JSON.parse(
        localStoredBlogMetadata
      );
      return localPosts.map((post) => ({
        ...post,
        content: "",
      }));
    }

    return [];
  }
}
