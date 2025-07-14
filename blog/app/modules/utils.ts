import { marked } from "marked";
import { renderMarkdownToHtml as enhancedRender } from "../components/markdown";
import type { BlogPost, BlogPostMetadata, MarkdownMetadata } from "./types";

// Configure marked for better parsing
marked.use({
  breaks: true,
  gfm: true,
});

// Simple cache with localStorage fallback
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const CACHE_KEY = "blogCache";

interface CacheData {
  posts: BlogPost[];
  metadata: BlogPostMetadata[];
  timestamp: number;
}

// Unified cache management
class BlogCache {
  private cache: CacheData | null = null;

  isValid(): boolean {
    return (
      this.cache !== null && Date.now() - this.cache.timestamp < CACHE_DURATION
    );
  }

  get(): BlogPost[] | null {
    if (this.isValid()) {
      return this.cache!.posts;
    }

    // Try localStorage fallback
    try {
      const stored = localStorage.getItem(CACHE_KEY);
      if (stored) {
        const data: CacheData = JSON.parse(stored);
        if (Date.now() - data.timestamp < CACHE_DURATION) {
          this.cache = data;
          return data.posts;
        }
      }
    } catch (error) {
      console.error("Error reading from localStorage:", error);
    }

    return null;
  }

  set(posts: BlogPost[]): void {
    const metadata: BlogPostMetadata[] = posts.map(
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

    this.cache = { posts, metadata, timestamp: Date.now() };

    // Save to localStorage
    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify(this.cache));
    } catch (error) {
      console.error("Error saving to localStorage:", error);
    }
  }

  clear(): void {
    this.cache = null;
    localStorage.removeItem(CACHE_KEY);
  }

  updatePost(updatedPost: BlogPost): void {
    if (this.cache) {
      const index = this.cache.posts.findIndex(
        (post) => post.slug === updatedPost.slug
      );
      if (index !== -1) {
        this.cache.posts[index] = updatedPost;
        this.set(this.cache.posts);
      }
    }
  }

  addPost(newPost: BlogPost): void {
    if (this.cache) {
      this.cache.posts.push(newPost);
      this.set(this.cache.posts);
    }
  }

  removePost(slug: string): void {
    if (this.cache) {
      this.cache.posts = this.cache.posts.filter((post) => post.slug !== slug);
      this.set(this.cache.posts);
    }
  }
}

export const blogCache = new BlogCache();

// Simplified markdown parsing
export function parseMarkdown(content: string): {
  metadata: MarkdownMetadata;
  body: string;
} {
  const parts = content.split("---");

  if (parts.length < 3) {
    throw new Error("Invalid markdown format: Missing frontmatter");
  }

  const frontmatter = parts[1].trim();
  const body = parts.slice(2).join("---").trim();

  const metadata: MarkdownMetadata = {
    title: "",
    created_at: "",
    image: "",
    category: "",
    author: "",
  };

  // Use regex-based parsing to handle values that may contain colons (like URLs)
  const title = frontmatter.match(/title:\s*(.*)/)?.[1]?.trim() || "";
  const created_at = frontmatter.match(/created_at:\s*(.*)/)?.[1]?.trim() || "";
  const image = frontmatter.match(/image:\s*(.*)/)?.[1]?.trim() || "";
  const category = frontmatter.match(/category:\s*(.*)/)?.[1]?.trim() || "";
  const author = frontmatter.match(/author:\s*(.*)/)?.[1]?.trim() || "";

  return {
    metadata: { title, created_at, image, category, author },
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
