import { supabase } from "./supabase";
import type {
  BlogPost,
  BlogPostMetadata,
  BlogPostWithSeparatedContent,
} from "./types";
import { localState } from "./utils";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000";

class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public response?: unknown,
  ) {
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
  options: RequestInit = {},
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
        errorData,
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof ApiError) {
      throw error;
    }
    throw new ApiError(
      error instanceof Error ? error.message : "Network error",
      0,
    );
  }
}

export async function fetchPostContent(
  slug: string,
): Promise<BlogPostWithSeparatedContent> {
  try {
    // Clear cache for this post to force fresh data (temporary fix for migration)
    localState.removePost(slug);

    const post: BlogPostWithSeparatedContent = await apiRequest(
      `/api/blog/posts-separated/${slug}`,
    );
    return post;
  } catch (error) {
    console.error(`Error fetching post content for ${slug}:`, error);
    throw error;
  }
}

export async function fetchBlogPosts(): Promise<
  BlogPostWithSeparatedContent[]
> {
  try {
    // Check cache first
    if (localState.isCacheValid()) {
      const cachedPosts = localState.getCachedBlogPosts();
      if (cachedPosts.length > 0) {
        console.debug("Using cached blog posts");
        // Convert cached posts to the expected format
        return cachedPosts.map((post) => ({
          metadata: {
            slug: post.slug,
            title: post.title,
            created_at: post.created_at,
            updated_at: post.updated_at,
            image: post.image,
            category: post.category,
            author: post.author,
          },
          content: post.content,
        }));
      }
    }

    // Fetch from API if cache is invalid or empty
    console.debug("Fetching fresh blog posts from API");
    const response: {
      posts: BlogPostWithSeparatedContent[];
      total_count: number;
    } = await apiRequest("/api/blog/posts-separated");

    const posts = response.posts;

    // Update cache with converted format
    const convertedPosts = posts.map((post) => ({
      slug: post.metadata.slug,
      title: post.metadata.title,
      created_at: post.metadata.created_at,
      updated_at: post.metadata.updated_at,
      image: post.metadata.image,
      category: post.metadata.category,
      author: post.metadata.author,
      content: post.content,
    }));
    localState.setBlogPosts(convertedPosts);

    return posts;
  } catch (error) {
    console.error("Error loading blog posts:", error);

    // Return cached data if available (even if expired)
    if (localState.hasCachedPosts()) {
      console.debug("Falling back to cached posts due to API error");
      const cachedPosts = localState.getCachedBlogPosts();
      return cachedPosts.map((post) => ({
        metadata: {
          slug: post.slug,
          title: post.title,
          created_at: post.created_at,
          updated_at: post.updated_at,
          image: post.image,
          category: post.category,
          author: post.author,
        },
        content: post.content,
      }));
    }

    return [];
  }
}

export async function fetchPostsMetadata(): Promise<BlogPostMetadata[]> {
  try {
    // Check cache first
    if (localState.isCacheValid()) {
      const cachedPosts = localState.getCachedBlogPosts();
      if (cachedPosts.length > 0) {
        console.debug("Using cached posts metadata");
        // Extract metadata from cached posts
        return cachedPosts.map(
          ({
            slug,
            title,
            created_at,
            updated_at,
            image,
            category,
            author,
          }) => ({
            slug,
            title,
            created_at,
            updated_at,
            image,
            category,
            author,
          }),
        );
      }
    }

    // Fetch from API if cache is invalid or empty
    console.debug("Fetching fresh posts metadata from API");
    const metadata: BlogPostMetadata[] = await apiRequest(
      "/api/blog/posts-metadata",
    );

    return metadata;
  } catch (error) {
    console.error("Error loading blog posts metadata:", error);

    // Return cached data if available (even if expired)
    if (localState.hasCachedPosts()) {
      console.debug("Falling back to cached posts metadata due to API error");
      const cachedPosts = localState.getCachedBlogPosts();
      return cachedPosts.map(
        ({ slug, title, created_at, updated_at, image, category, author }) => ({
          slug,
          title,
          created_at,
          updated_at,
          image,
          category,
          author,
        }),
      );
    }

    return [];
  }
}

export async function verifyAuthToken(
  token: string,
): Promise<{ valid: boolean; user?: unknown }> {
  try {
    const response = await apiRequest<{ valid: boolean; user?: unknown }>(
      "/api/blog/auth/verify",
      {
        method: "POST",
        body: JSON.stringify({ token }),
      },
    );

    return response;
  } catch (error) {
    console.error("Error verifying auth token:", error);
    throw error;
  }
}

// CMS-specific API functions
export async function deletePost(slug: string): Promise<{ success: boolean }> {
  try {
    const response = await apiRequest<{ success: boolean }>(
      `/api/blog/posts/${slug}`,
      {
        method: "DELETE",
      },
    );
    return response;
  } catch (error) {
    console.error(`Error deleting post ${slug}:`, error);
    throw error;
  }
}

export async function updatePost(
  slug: string,
  post: BlogPost,
): Promise<BlogPost> {
  try {
    // Extract only the fields that the backend expects for updates
    const updateData = {
      title: post.title,
      content: post.content, // Pure markdown content
      image: post.image,
      category: post.category,
      author: post.author,
    };

    const response: BlogPost = await apiRequest(`/api/blog/posts/${slug}`, {
      method: "PUT",
      body: JSON.stringify(updateData),
    });
    return response;
  } catch (error) {
    console.error(`Error updating post ${slug}:`, error);
    throw error;
  }
}

export async function createPost(post: BlogPost): Promise<BlogPost> {
  try {
    // Extract only the fields that the backend expects for creation
    const createData = {
      slug: post.slug,
      title: post.title,
      content: post.content, // Pure markdown content
      image: post.image,
      category: post.category,
      author: post.author,
    };

    const response: BlogPost = await apiRequest("/api/blog/posts", {
      method: "POST",
      body: JSON.stringify(createData),
    });
    return response;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
}

export async function downloadFileFromBackend(filename: string): Promise<void> {
  try {
    // Download file directly from backend
    const response = await fetch(
      `${API_BASE_URL}/api/files?filename=${encodeURIComponent(filename)}`,
      {
        method: "GET",
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    // Get the filename from the Content-Disposition header
    const contentDisposition = response.headers.get("Content-Disposition");
    let downloadFilename = filename;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename=(.+)/);
      if (filenameMatch) {
        downloadFilename = filenameMatch[1].replace(/"/g, "");
      }
    }

    // Create blob from response and download
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);

    // Create a temporary link element to trigger download
    const link = document.createElement("a");
    link.href = url;
    link.download = downloadFilename;

    // Append to DOM, click, and remove
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    // Clean up the URL object
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error("Error downloading file:", error);
    throw error;
  }
}
