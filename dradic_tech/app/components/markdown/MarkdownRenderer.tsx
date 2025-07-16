import { useEffect, useRef } from "react";
import DOMPurify from "dompurify";

interface MarkdownRendererProps {
  content: string;
  className?: string;
}

export function MarkdownRenderer({
  content,
  className = "",
}: MarkdownRendererProps) {
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (contentRef.current) {
      // Sanitize the HTML content
      const sanitizedHtml = DOMPurify.sanitize(content, {
        ALLOWED_TAGS: [
          "h1",
          "h2",
          "h3",
          "h4",
          "h5",
          "h6",
          "p",
          "br",
          "strong",
          "em",
          "del",
          "ul",
          "ol",
          "li",
          "blockquote",
          "pre",
          "code",
          "table",
          "thead",
          "tbody",
          "tr",
          "th",
          "td",
          "a",
          "img",
          "hr",
          "div",
          "span",
        ],
        ALLOWED_ATTR: [
          "href",
          "src",
          "alt",
          "title",
          "id",
          "class",
          "target",
          "rel",
          "loading",
        ],
        ALLOW_DATA_ATTR: false,
      });

      contentRef.current.innerHTML = sanitizedHtml;

      // Add copy button to code blocks
      const preBlocks = contentRef.current.querySelectorAll("pre");
      preBlocks.forEach((preBlock) => {
        if (!preBlock.querySelector(".copy-button")) {
          const copyButton = document.createElement("button");
          copyButton.className =
            "copy-button absolute top-2 right-2 px-2 py-1 text-xs bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors duration-200";
          copyButton.textContent = "Copy";
          copyButton.onclick = () => {
            const code = preBlock.querySelector("code");
            if (code) {
              navigator.clipboard.writeText(code.textContent || "");
              copyButton.textContent = "Copied!";
              setTimeout(() => {
                copyButton.textContent = "Copy";
              }, 2000);
            }
          };

          preBlock.style.position = "relative";
          preBlock.appendChild(copyButton);
        }
      });

      // Add smooth scrolling for anchor links
      const anchorLinks = contentRef.current.querySelectorAll('a[href^="#"]');
      anchorLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
          e.preventDefault();
          const targetId = link.getAttribute("href")?.substring(1);
          const targetElement = document.getElementById(targetId || "");
          if (targetElement) {
            targetElement.scrollIntoView({ behavior: "smooth" });
          }
        });
      });
    }
  }, [content]);

  return <div ref={contentRef} className={`markdown-content ${className}`} />;
}
