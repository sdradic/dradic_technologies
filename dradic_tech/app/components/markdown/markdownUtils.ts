import { marked } from "./MarkdownConfig";

// Process markdown content with additional features
export function processMarkdownContent(content: string): string {
  // Add syntax highlighting hints
  let processed = content;

  // Enhance code blocks with language detection
  processed = processed.replace(
    /```(\w+)?\n([\s\S]*?)```/g,
    (match, lang, code) => {
      const language = lang || "text";
      return `\`\`\`${language}\n${code}\n\`\`\``;
    },
  );

  // Add callout blocks
  processed = processed.replace(
    /^> \[!NOTE\](.*$)/gm,
    '<div class="callout callout-note">$1</div>',
  );
  processed = processed.replace(
    /^> \[!WARNING\](.*$)/gm,
    '<div class="callout callout-warning">$1</div>',
  );
  processed = processed.replace(
    /^> \[!TIP\](.*$)/gm,
    '<div class="callout callout-tip">$1</div>',
  );

  return processed;
}

// Calculate reading time
export function calculateReadingTime(content: string): number {
  const wordsPerMinute = 200;
  const words = content.trim().split(/\s+/).length;
  return Math.ceil(words / wordsPerMinute);
}

// Extract table of contents
export function extractTableOfContents(
  content: string,
): Array<{ level: number; text: string; id: string }> {
  const toc: Array<{ level: number; text: string; id: string }> = [];
  const lines = content.split("\n");

  lines.forEach((line) => {
    const headingMatch = line.match(/^(#{1,6})\s+(.+)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      const id = text.toLowerCase().replace(/[^\w]+/g, "-");
      toc.push({ level, text, id });
    }
  });

  return toc;
}

// Enhanced markdown to HTML conversion
export async function renderMarkdownToHtml(content: string): Promise<string> {
  try {
    // Process markdown with enhanced features
    const processedMarkdown = processMarkdownContent(content);

    // Parse markdown with enhanced renderer
    const html = await marked.parse(processedMarkdown);

    // Add wrapper classes for better styling
    return `<div class="markdown-content prose prose-lg max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-headings:text-gray-900 dark:prose-headings:text-gray-100 prose-p:text-gray-700 dark:prose-p:text-gray-300 prose-p:leading-relaxed prose-a:text-primary-600 dark:prose-a:text-primary-400 prose-a:no-underline hover:prose-a:text-primary-700 dark:hover:prose-a:text-primary-300 prose-strong:text-gray-900 dark:prose-strong:text-gray-100 prose-strong:font-semibold prose-em:text-gray-700 dark:prose-em:text-gray-300 prose-blockquote:border-l-primary-500 dark:prose-blockquote:border-l-primary-400 prose-blockquote:bg-gray-50 dark:prose-blockquote:bg-gray-800/50 prose-code:text-gray-800 dark:prose-code:text-gray-200 prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-pre:bg-gray-100 dark:prose-pre:bg-gray-800 prose-pre:border prose-pre:border-gray-300 dark:prose-pre:border-gray-600 prose-img:rounded-lg prose-img:shadow-lg">${html}</div>`;
  } catch (error) {
    console.error("Failed to render markdown to HTML:", error);
    return await marked.parse(content);
  }
}
