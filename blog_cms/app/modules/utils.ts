import { marked } from "marked";
import { renderMarkdownToHtml as enhancedRender } from "../components/markdown";
import type { BlogPost, MarkdownMetadata } from "./types";

// ******************************************************
//  MARKDOWN UTILS
// ******************************************************

// Configure marked for better parsing
marked.use({
  breaks: true,
  gfm: true,
});

// Simplified markdown parsing
export function parseMarkdown(content: string): {
  metadata: MarkdownMetadata;
  body: string;
} {
  // Check if content has frontmatter
  if (!content.trim().startsWith("---")) {
    // No frontmatter, return default metadata with full content as body
    const now = new Date().toISOString();
    return {
      metadata: {
        title: "Untitled",
        created_at: now,
        updated_at: now,
        image: "",
        category: "",
        author: "",
      },
      body: content.trim(),
    };
  }

  const parts = content.split("---");

  if (parts.length < 3) {
    // Invalid frontmatter format, return default metadata with full content as body
    const now = new Date().toISOString();
    return {
      metadata: {
        title: "Untitled",
        created_at: now,
        updated_at: now,
        image: "",
        category: "",
        author: "",
      },
      body: content.trim(),
    };
  }

  const frontmatter = parts[1].trim();
  const body = parts.slice(2).join("---").trim();

  // Use regex-based parsing to handle values that may contain colons (like URLs)
  const title = frontmatter.match(/title:\s*(.*)/)?.[1]?.trim() || "Untitled";
  const created_at =
    frontmatter.match(/created_at:\s*(.*)/)?.[1]?.trim() ||
    new Date().toISOString();
  const updated_at =
    frontmatter.match(/updated_at:\s*(.*)/)?.[1]?.trim() ||
    new Date().toISOString();
  const image = frontmatter.match(/image:\s*(.*)/)?.[1]?.trim() || "";
  const category = frontmatter.match(/category:\s*(.*)/)?.[1]?.trim() || "";
  const author = frontmatter.match(/author:\s*(.*)/)?.[1]?.trim() || "";

  return {
    metadata: { title, created_at, updated_at, image, category, author },
    body,
  };
}

export async function renderMarkdownToHtml(content: string): Promise<string> {
  try {
    let markdownBody = content;

    // Extract body if content has frontmatter
    if (content.trim().startsWith("---")) {
      try {
        const { body } = parseMarkdown(content);
        markdownBody = body;
      } catch {
        // Fallback: extract content after second ---
        const lines = content.split("\n");
        let frontmatterEnded = false;
        const bodyLines: string[] = [];

        for (const line of lines) {
          if (line.trim() === "---") {
            if (frontmatterEnded) {
              bodyLines.push(line);
            } else {
              frontmatterEnded = true;
            }
          } else if (frontmatterEnded) {
            bodyLines.push(line);
          }
        }

        markdownBody = bodyLines.join("\n");
      }
    }

    // Use the enhanced markdown renderer
    return await enhancedRender(markdownBody);
  } catch (error) {
    console.error("Failed to render markdown to HTML:", error);
    return await marked.parse(content);
  }
}

// ******************************************************
//  LOCAL STORAGE UTILS
// ******************************************************

// LocalStorage structure
interface LocalStateData {
  theme: string;
  blogPosts: BlogPost[];
  timestamp: number;
}

// Default state
const DEFAULT_STATE: LocalStateData = {
  theme:
    typeof window !== "undefined" &&
    window?.matchMedia("(prefers-color-scheme: dark)")?.matches
      ? "dark"
      : "light",
  blogPosts: [],
  timestamp: Date.now(),
};

// Cache duration for blog data (1 hour for testing)
const CACHE_DURATION = 60 * 60 * 1000;

// Storage key
const STORAGE_KEY = "dradic-tech-local-state";

// Global state variable
let state: LocalStateData | null = null;

// Load state from localStorage
function loadFromStorage(): void {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as LocalStateData;
      // Validate the structure and merge with defaults
      state = {
        theme: parsed.theme || DEFAULT_STATE.theme,
        blogPosts: Array.isArray(parsed.blogPosts)
          ? parsed.blogPosts
          : DEFAULT_STATE.blogPosts,
        timestamp: parsed.timestamp || DEFAULT_STATE.timestamp,
      };
    } else {
      state = { ...DEFAULT_STATE };
    }
  } catch (error) {
    console.error("Error loading local state:", error);
    state = { ...DEFAULT_STATE };
  }
}

// Save state to localStorage
function saveToStorage(): void {
  try {
    if (state) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch (error) {
    console.error("Error saving local state:", error);
  }
}

// Initialize state on module load
loadFromStorage();

// Theme management
export function getTheme(): string {
  return state?.theme || DEFAULT_STATE.theme;
}

export function setTheme(theme: string): void {
  if (state) {
    state.theme = theme;
    saveToStorage();
  }
}

// Blog posts management
export function getBlogPosts(): BlogPost[] {
  if (!state) return [];

  // Check if cache is still valid
  if (Date.now() - state.timestamp < CACHE_DURATION) {
    return state.blogPosts;
  }

  // Cache expired, clear posts
  state.blogPosts = [];
  saveToStorage();
  return [];
}

export function setBlogPosts(posts: BlogPost[]): void {
  if (state) {
    state.blogPosts = posts;
    state.timestamp = Date.now();
    saveToStorage();
  }
}

// Get a specific post
export function getPost(slug: string): BlogPost | null {
  const posts = getBlogPosts();
  return posts.find((p) => p.slug === slug) || null;
}

// Get a specific post content
export function getPostContent(slug: string): string | null {
  const post = getPost(slug);
  return post?.content || null;
}

// Set a specific post
export function setPost(post: BlogPost): void {
  if (state) {
    const existingIndex = state.blogPosts.findIndex(
      (p) => p.slug === post.slug
    );
    if (existingIndex !== -1) {
      state.blogPosts[existingIndex] = post;
    } else {
      state.blogPosts.push(post);
    }
    state.timestamp = Date.now();
    saveToStorage();
  }
}

// Remove a specific post
export function removePost(slug: string): void {
  if (state) {
    state.blogPosts = state.blogPosts.filter((p) => p.slug !== slug);
    state.timestamp = Date.now();
    saveToStorage();
  }
}

// Clear all blog data
export function clearBlogData(): void {
  if (state) {
    state.blogPosts = [];
    state.timestamp = Date.now();
    saveToStorage();
  }
}

// Clear all data (including theme)
export function clearAll(): void {
  state = { ...DEFAULT_STATE };
  saveToStorage();
}

// Check if cache is valid
export function isCacheValid(): boolean {
  if (!state) return false;
  return Date.now() - state.timestamp < CACHE_DURATION;
}

// Get cache age in milliseconds
export function getCacheAge(): number {
  if (!state) return Infinity;
  return Date.now() - state.timestamp;
}

// Export a convenience object
export const localState = {
  getTheme,
  setTheme,
  getBlogPosts,
  setBlogPosts,
  getPost,
  getPostContent,
  setPost,
  removePost,
  clearBlogData,
  clearAll,
  isCacheValid,
  getCacheAge,
};
