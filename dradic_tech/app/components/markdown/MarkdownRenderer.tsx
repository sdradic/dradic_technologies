import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkFrontmatter from "remark-frontmatter";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  // Strip frontmatter manually since remark-frontmatter only parses it
  const stripFrontmatter = (content: string): string => {
    if (!content.trim().startsWith("---")) return content;
    const endIndex = content.indexOf("---", 3);
    if (endIndex === -1) return content;
    return content.slice(endIndex + 3).trimStart();
  };

  const contentWithoutFrontmatter = stripFrontmatter(content);

  return (
    <article className={`markdown-content ${className}`}>
      <ReactMarkdown remarkPlugins={[remarkGfm, remarkFrontmatter]}>
        {contentWithoutFrontmatter}
      </ReactMarkdown>
    </article>
  );
}
