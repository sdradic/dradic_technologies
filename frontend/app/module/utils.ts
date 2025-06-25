/**
 * Utility functions for the application
 */

import { marked } from "marked";
import type { BlogPostMetadata } from "./types";

// Configure marked for better parsing
marked.use({
  breaks: true,
  gfm: true,
});

/**
 * Parse markdown content with frontmatter
 * @param content - markdown content with frontmatter
 * @returns parsed metadata and body content
 */
export function parseMarkdownWithFrontmatter(content: string): {
  metadata: {
    title: string;
    created_at: string;
    updated_at: string;
    image: string;
  };
  body: string;
} {
  const defaultMetadata = {
    title: "",
    created_at: "",
    updated_at: "",
    image: "",
  };

  try {
    // Split content into frontmatter and body
    const parts = content.split("---");

    if (parts.length < 3) {
      // No frontmatter, return content as body
      return {
        metadata: defaultMetadata,
        body: content,
      };
    }

    const frontmatter = parts[1].trim();
    const body = parts.slice(2).join("---").trim();

    // Parse frontmatter
    const title = frontmatter.match(/title:\s*(.*)/)?.[1]?.trim() || "";
    const created_at =
      frontmatter.match(/created_at:\s*(.*)/)?.[1]?.trim() || "";
    const updated_at =
      frontmatter.match(/updated_at:\s*(.*)/)?.[1]?.trim() || "";
    const image = frontmatter.match(/image:\s*(.*)/)?.[1]?.trim() || "";

    return {
      metadata: { title, created_at, updated_at, image },
      body,
    };
  } catch (error) {
    console.error("Error parsing markdown frontmatter:", error);
    return {
      metadata: defaultMetadata,
      body: content,
    };
  }
}

/**
 * Render markdown content to HTML
 * @param content - markdown content (with or without frontmatter)
 * @returns HTML string
 */
export async function renderMarkdownToHtml(content: string): Promise<string> {
  try {
    let markdownBody = content;

    // Check if content has frontmatter (starts with ---)
    if (content.trim().startsWith("---")) {
      try {
        // Parse frontmatter and get the body
        const { body } = parseMarkdownWithFrontmatter(content);
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

/**
 * Format a date string to a human-readable format with time
 * @param dateString - ISO date string or any valid date string
 * @param includeTime - whether to include time (hours and minutes)
 * @returns formatted date string or 'No date' if invalid
 */
export function formatDate(
  dateString: string | null | undefined,
  includeTime: boolean = true
): string {
  if (!dateString) {
    return "No date";
  }

  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      return "No date";
    }

    if (includeTime) {
      return date.toLocaleString();
    } else {
      return date.toLocaleDateString();
    }
  } catch (error) {
    console.error("Error formatting date:", error);
    return "No date";
  }
}

/**
 * Format a date string to show only date (no time)
 * @param dateString - ISO date string or any valid date string
 * @returns formatted date string or 'No date' if invalid
 */
export function formatDateOnly(dateString: string | null | undefined): string {
  return formatDate(dateString, false);
}

/**
 * Check if a date string is valid
 * @param dateString - date string to validate
 * @returns true if valid, false otherwise
 */
export function isValidDate(dateString: string | null | undefined): boolean {
  if (!dateString) return false;

  try {
    const date = new Date(dateString);
    return !isNaN(date.getTime());
  } catch {
    return false;
  }
}

export function handleSaveLocalStoredBlogMetadata(posts: BlogPostMetadata[]) {
  try {
    localStorage.setItem("localStoredBlogMetadata", JSON.stringify(posts));
  } catch (error) {
    console.error("Error saving local stored blog metadata:", error);
    throw error;
  }
}
