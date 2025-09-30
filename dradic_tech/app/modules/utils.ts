import { marked } from "marked";
import { renderMarkdownToHtml as enhancedRender } from "../components/markdown";

// ******************************************************
//  MARKDOWN UTILS
// ******************************************************

// Configure marked for better parsing
marked.use({
  breaks: true,
  gfm: true,
});

// Render pure markdown content to HTML
export async function renderMarkdownToHtml(content: string): Promise<string> {
  try {
    // The content should be pure markdown without frontmatter
    return await enhancedRender(content);
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
}

// Default state
const DEFAULT_STATE: LocalStateData = {
  theme:
    typeof window !== "undefined" &&
    window?.matchMedia("(prefers-color-scheme: dark)")?.matches
      ? "dark"
      : "light",
};

// Storage key
const STORAGE_KEY = "dradic-tech-local-state";

// Global state variable
let state: LocalStateData | null = null;

// Load state from localStorage
function loadFromStorage(): void {
  // Don't try to access localStorage during SSR
  if (typeof window === "undefined") {
    state = { ...DEFAULT_STATE };
    return;
  }

  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as LocalStateData;
      // Validate the structure and merge with defaults
      state = {
        theme: parsed.theme || DEFAULT_STATE.theme,
      };
    } else {
      state = { ...DEFAULT_STATE };
    }
  } catch (error) {
    state = { ...DEFAULT_STATE };
  }
}

// Save state to localStorage
function saveToStorage(): void {
  // Don't try to access localStorage during SSR
  if (typeof window === "undefined") return;

  try {
    if (state) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch (error) {
    // Silent fail for localStorage errors
  }
}

// Initialize state on module load
loadFromStorage();

// Theme management
export function getTheme(): string {
  // During SSR, return the default theme
  if (typeof window === "undefined") {
    return DEFAULT_STATE.theme;
  }
  return state?.theme || DEFAULT_STATE.theme;
}

export function saveTheme(theme: string): void {
  if (state) {
    state.theme = theme;
    saveToStorage();
  }
}

// Clear all data (including theme)
export function clearAll(): void {
  state = { ...DEFAULT_STATE };
  saveToStorage();
}

// Export a convenience object
export const localState = {
  getTheme,
  saveTheme,
  clearAll,
};

// ******************************************************
//  BLOG CMS UTILS
// ******************************************************

// Predefined categories for dropdown
export const BLOG_CATEGORIES = [
  "Technology",
  "Programming",
  "IoT",
  "Electronics",
  "Embedded Systems",
  "Hardware",
  "Software",
  "Tutorial",
  "Project",
  "Review",
  "News",
  "Education",
  "Other",
] as const;

export type BlogCategory = (typeof BLOG_CATEGORIES)[number];

// Interface for form data
export interface BlogFormData {
  title: string;
  content: string;
  image: string;
  category: string;
  author: string;
}

// Create a blog post object from form data
export function createBlogPostFromForm(
  data: BlogFormData,
  slug: string,
  created_at?: string,
): any {
  const now = new Date().toISOString();

  return {
    slug,
    title: data.title,
    content: data.content, // Pure markdown content
    created_at: created_at || now,
    updated_at: now,
    image: data.image,
    category: data.category,
    author: data.author,
  };
}

// Validate form data
export function validateBlogForm(data: BlogFormData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (!data.title.trim()) {
    errors.push("Please enter a title for your post");
  }

  if (!data.content.trim()) {
    errors.push("Please enter some content for your post");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}

// Default form data
export function getDefaultFormData(): BlogFormData {
  return {
    title: "",
    content: "",
    image: "",
    category: "",
    author: "",
  };
}

function validateEmail(email: string) {
  // Simple email regex
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export const handleSubscribe = (userEmail: string) => {
  if (!validateEmail(userEmail)) {
    console.error("Please enter a valid email address.");
    return false;
  }
  console.log(userEmail);
  return true;
};
