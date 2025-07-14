import { supabase } from "./supabase";
import type { BlogPost, BlogPostMetadata } from "./types";
import { blogCache } from "./utils";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

class ApiError extends Error {
  constructor(message: string, public status: number, public response?: any) {
    super(message);
    this.name = "ApiError";
  }
}

// Get authentication headers
async function getAuthHeaders(): Promise<Record<string, string>> {
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (session?.access_token) {
    return {
      Authorization: `Bearer ${session.access_token}`,
    };
  }

  return {};
}

// Generic API request handler
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE_URL}${endpoint}`;

  const authHeaders = await getAuthHeaders();
  const defaultHeaders = {
    "Content-Type": "application/json",
    ...authHeaders,
  };

  const config: RequestInit = {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  };

  try {
    const response = await fetch(url, config);

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new ApiError(
        errorData.detail || `HTTP ${response.status}: ${response.statusText}`,
        response.status,
        errorData
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Network error",
      0
    );
  }
}

export async function fetchPostContent(slug: string): Promise<string> {
  try {
    const post: BlogPost = await apiRequest(`/api/blog/posts/${slug}`);
    return post.content;
  } catch (error) {
    console.error(`Error fetching post content for ${slug}:`, error);
    throw error;
  }
}

export async function fetchBlogPosts(): Promise<BlogPost[]> {
  try {
    // Check cache first
    const cachedPosts = blogCache.get();
    if (cachedPosts) {
      return cachedPosts;
    }

    // Fetch from API
    const response: { posts: BlogPost[]; total_count: number } =
      await apiRequest("/api/blog/posts");

    const posts = response.posts;

    // Update cache
    blogCache.set(posts);

    return posts;
  } catch (error) {
    console.error("Error loading blog posts:", error);
    return [];
  }
}

export async function fetchPostsMetadata(): Promise<BlogPostMetadata[]> {
  try {
    // Check cache first
    const cachedPosts = blogCache.get();
    if (cachedPosts) {
      return cachedPosts.map(
        ({ slug, title, created_at, updated_at, image, category, author }) => ({
          slug,
          title,
          created_at,
          updated_at,
          image,
          category,
          author,
        })
      );
    }

    // Fetch from API
    const metadata: BlogPostMetadata[] = await apiRequest(
      "/api/blog/posts-metadata"
    );

    return metadata;
  } catch (error) {
    console.error("Error loading blog posts metadata:", error);
    return [];
  }
}

export async function verifyAuthToken(token: string): Promise<any> {
  try {
    const response = await apiRequest("/api/blog/verify-token", {
      method: "POST",
      body: JSON.stringify({ token }),
    });

    return response;
  } catch (error) {
    console.error("Error verifying auth token:", error);
    throw error;
  }
}
