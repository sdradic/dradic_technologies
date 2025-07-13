import { marked } from "marked";
import type { BlogPost, BlogPostMetadata, MarkdownMetadata } from "./types";

// Configure marked for better parsing
marked.use({
  breaks: true,
  gfm: true,
});

// Cache configuration
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const POSTS_METADATA_KEY = "localStoredBlogMetadata";
const BLOG_POSTS_KEY = "localStoredBlogPosts";

// Module-level cache
let cachedPostsMetadata: BlogPostMetadata[] | null = null;
let cachedBlogPosts: BlogPost[] | null = null;
let lastFetchTime = 0;

// Cache validity check
export function isCacheValid(): boolean {
  const now = Date.now();
  return now - lastFetchTime < CACHE_DURATION;
}

// Blog Posts Metadata Cache Management
export function getCachedPostsMetadata(
  force: boolean = false
): BlogPostMetadata[] | null {
  if (!force && cachedPostsMetadata && isCacheValid()) {
    return cachedPostsMetadata;
  }
  return null;
}

export function setCachedPostsMetadata(metadata: BlogPostMetadata[]): void {
  cachedPostsMetadata = metadata;
  lastFetchTime = Date.now();
  handleSaveLocalStoredBlogMetadata(metadata);
}

// Blog Posts Cache Management
export function getCachedBlogPosts(force: boolean = false): BlogPost[] | null {
  if (!force && cachedBlogPosts && isCacheValid()) {
    return cachedBlogPosts;
  }
  return null;
}

export function setCachedBlogPosts(posts: BlogPost[]): void {
  cachedBlogPosts = posts;
  lastFetchTime = Date.now();

  // Save full posts to localStorage
  try {
    localStorage.setItem(BLOG_POSTS_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error("Error saving blog posts to localStorage:", error);
  }

  // Save metadata to localStorage for offline access
  const postsMetadata: BlogPostMetadata[] = posts.map((post) => ({
    slug: post.slug,
    title: post.title,
    created_at: post.created_at,
    updated_at: post.updated_at,
    image: post.image,
    category: post.category,
    author: post.author,
  }));
  handleSaveLocalStoredBlogMetadata(postsMetadata);
}

// LocalStorage retrieval functions
export function getLocalStoredBlogMetadata(): BlogPostMetadata[] | null {
  try {
    const stored = localStorage.getItem(POSTS_METADATA_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error retrieving blog metadata from localStorage:", error);
    return null;
  }
}

export function getLocalStoredBlogPosts(): BlogPost[] | null {
  try {
    const stored = localStorage.getItem(BLOG_POSTS_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error retrieving blog posts from localStorage:", error);
    return null;
  }
}

// Fallback function for when API fails
export function getBlogPostsFallback(): BlogPost[] {
  // Try cached data first
  if (cachedBlogPosts) {
    return cachedBlogPosts;
  }

  // Try full posts from localStorage
  const localPosts = getLocalStoredBlogPosts();
  if (localPosts) {
    return localPosts;
  }

  // Fall back to metadata only (without content)
  const localMetadata = getLocalStoredBlogMetadata();
  if (localMetadata) {
    return localMetadata.map((post) => ({
      ...post,
      content: "", // No content available from localStorage metadata
    }));
  }

  return [];
}

// Fallback function for metadata when API fails
export function getPostsMetadataFallback(): BlogPostMetadata[] {
  // Try cached data first
  if (cachedPostsMetadata) {
    return cachedPostsMetadata;
  }

  // Fall back to localStorage
  const localMetadata = getLocalStoredBlogMetadata();
  return localMetadata || [];
}

// Clear cache (useful for testing or forced refresh)
export function clearBlogCache(): void {
  cachedPostsMetadata = null;
  cachedBlogPosts = null;
  lastFetchTime = 0;
}

// Update cache when posts are modified
export function updateBlogPostInCache(updatedPost: BlogPost): void {
  if (cachedBlogPosts) {
    const index = cachedBlogPosts.findIndex(
      (post) => post.slug === updatedPost.slug
    );
    if (index !== -1) {
      cachedBlogPosts[index] = updatedPost;
      setCachedBlogPosts(cachedBlogPosts);
    }
  }
}

// Add new post to cache
export function addBlogPostToCache(newPost: BlogPost): void {
  if (cachedBlogPosts) {
    cachedBlogPosts.push(newPost);
    setCachedBlogPosts(cachedBlogPosts);
  }
}

// Remove post from cache
export function removeBlogPostFromCache(slug: string): void {
  if (cachedBlogPosts) {
    cachedBlogPosts = cachedBlogPosts.filter((post) => post.slug !== slug);
    setCachedBlogPosts(cachedBlogPosts);
  }
}

export function parseMarkdown(content: string): {
  metadata: MarkdownMetadata;
  body: string;
} {
  // Split content into frontmatter and body
  const parts = content.split("---");

  if (parts.length < 3) {
    throw new Error("Invalid markdown format: Missing frontmatter");
  }

  const frontmatter = parts[1].trim();
  const body = parts.slice(2).join("---").trim();

  // Parse frontmatter
  const metadata: MarkdownMetadata = {
    title: "",
    created_at: "",
    image: "",
    category: "",
    author: "",
  };

  const frontmatterLines = frontmatter.split("\n");
  frontmatterLines.forEach((line) => {
    const [key, value] = line.split(":").map((part) => part.trim());
    if (key && value && key in metadata) {
      metadata[key as keyof MarkdownMetadata] = value;
    }
  });

  return {
    metadata,
    body,
  };
}

export async function renderMarkdownToHtml(content: string): Promise<string> {
  try {
    let markdownBody = content;

    // Check if content has frontmatter (starts with ---)
    if (content.trim().startsWith("---")) {
      try {
        // Try to parse frontmatter and get the body
        const { body } = parseMarkdown(content);
        markdownBody = body;
      } catch (error) {
        // If frontmatter parsing fails, try to extract content after the second ---
        const lines = content.split("\n");
        let inFrontmatter = false;
        let frontmatterEnded = false;
        const bodyLines: string[] = [];

        for (const line of lines) {
          if (line.trim() === "---") {
            if (!inFrontmatter) {
              inFrontmatter = true;
            } else {
              frontmatterEnded = true;
              continue;
            }
          } else if (frontmatterEnded) {
            bodyLines.push(line);
          }
        }

        markdownBody = bodyLines.join("\n");
      }
    }

    // Convert markdown to HTML
    const html = await marked.parse(markdownBody);
    return html;
  } catch (error) {
    console.error("Failed to render markdown to HTML:", error);
    // Return the original content as HTML if parsing completely fails
    const fallbackHtml = await marked.parse(content);
    return fallbackHtml;
  }
}

export function handleSaveLocalStoredBlogMetadata(posts: BlogPostMetadata[]) {
  try {
    localStorage.setItem(POSTS_METADATA_KEY, JSON.stringify(posts));
  } catch (error) {
    console.error("Error saving local stored blog metadata:", error);
    throw error;
  }
}
