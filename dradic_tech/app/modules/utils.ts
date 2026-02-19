import { marked } from "marked";
import { renderMarkdownToHtml as enhancedRender } from "../components/markdown";

marked.use({
  breaks: true,
  gfm: true,
});

export async function renderMarkdownToHtml(content: string): Promise<string> {
  try {
    return await enhancedRender(content);
  } catch (error) {
    console.error("Failed to render markdown to HTML:", error);
    return await marked.parse(content);
  }
}

// Local storage
interface LocalStateData {
  theme: string;
}

const DEFAULT_STATE: LocalStateData = {
  theme:
    typeof window !== "undefined" &&
    window?.matchMedia("(prefers-color-scheme: dark)")?.matches
      ? "dark"
      : "light",
};

const STORAGE_KEY = "dradic-tech-local-state";
let state: LocalStateData | null = null;

function loadFromStorage(): void {
  if (typeof window === "undefined") {
    state = { ...DEFAULT_STATE };
    return;
  }
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as LocalStateData;
      state = { theme: parsed.theme || DEFAULT_STATE.theme };
    } else {
      state = { ...DEFAULT_STATE };
    }
  } catch {
    state = { ...DEFAULT_STATE };
  }
}

function saveToStorage(): void {
  if (typeof window === "undefined") return;
  try {
    if (state) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    }
  } catch {
    // Silent fail
  }
}

loadFromStorage();

export function getTheme(): string {
  if (typeof window === "undefined") return DEFAULT_STATE.theme;
  return state?.theme || DEFAULT_STATE.theme;
}

export function saveTheme(theme: string): void {
  if (state) {
    state.theme = theme;
    saveToStorage();
  }
}

// Blog CMS
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

export interface BlogFormData {
  title: string;
  content: string;
  image: string;
  category: string;
  author: string;
}

export function createBlogPostFromForm(
  data: BlogFormData,
  slug: string,
  created_at?: string,
): any {
  const now = new Date().toISOString();
  return {
    slug,
    title: data.title,
    content: data.content,
    created_at: created_at || now,
    updated_at: now,
    image: data.image,
    category: data.category,
    author: data.author,
  };
}

export function validateBlogForm(data: BlogFormData): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  if (!data.title.trim()) errors.push("Please enter a title for your post");
  if (!data.content.trim())
    errors.push("Please enter some content for your post");
  return { isValid: errors.length === 0, errors };
}

export function getDefaultFormData(): BlogFormData {
  return { title: "", content: "", image: "", category: "", author: "" };
}

function validateEmail(email: string) {
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
