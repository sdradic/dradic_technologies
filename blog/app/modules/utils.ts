import { marked } from "marked";
import { renderMarkdownToHtml as enhancedRender } from "../components/markdown";
import type { MarkdownMetadata } from "./types";

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
