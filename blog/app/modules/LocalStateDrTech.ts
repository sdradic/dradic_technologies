import type { BlogPost } from "./types";

// LocalStorage structure
interface LocalStateData {
  theme: string;
  blogPosts: BlogPost[];
  timestamp: number;
}

// Default state
const DEFAULT_STATE: LocalStateData = {
  theme: "light",
  blogPosts: [],
  timestamp: Date.now(),
};

// Cache duration for blog data (5 minutes)
const CACHE_DURATION = 5 * 60 * 1000;

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

// Debug utility to inspect current state
export function debugLocalState(): void {
  console.log("=== LocalStateDrTech Debug ===");
  console.log("Theme:", getTheme());
  console.log("Cache valid:", isCacheValid());
  console.log("Cache age (ms):", getCacheAge());
  console.log("Blog posts count:", getBlogPosts().length);
  console.log("Full state:", state);
  console.log("=============================");
}
