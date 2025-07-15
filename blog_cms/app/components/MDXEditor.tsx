import { useEffect, useRef, useState, useMemo } from "react";
import {
  MDXEditor,
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  markdownShortcutPlugin,
  BoldItalicUnderlineToggles,
  UndoRedo,
  BlockTypeSelect,
  CreateLink,
  InsertImage,
  InsertTable,
  InsertThematicBreak,
  toolbarPlugin,
  imagePlugin,
  tablePlugin,
  linkPlugin,
  linkDialogPlugin,
  frontmatterPlugin,
  codeBlockPlugin,
  codeMirrorPlugin,
  sandpackPlugin,
  AdmonitionDirectiveDescriptor,
  directivesPlugin,
  diffSourcePlugin,
} from "@mdxeditor/editor";
import { useTheme } from "~/contexts/ThemeContext";
import type { BlogPost } from "~/modules/types";

// Import the editor styles
import "@mdxeditor/editor/style.css";

interface MDXEditorProps {
  selectedPost: BlogPost;
  selectedPostContent: string;
  setSelectedPostContent: (content: string) => void;
}

export default function MDXEditorComponent({
  selectedPost,
  selectedPostContent,
  setSelectedPostContent,
}: MDXEditorProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const editorRef = useRef<any>(null);

  // Ensure selectedPost is not undefined
  const safeSelectedPost = selectedPost || {
    slug: "",
    title: "Untitled",
    content: "",
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    image: "",
    category: "",
    author: "",
  };

  // Memoize frontmatter generation to prevent infinite loops
  const currentFrontmatter = useMemo(() => {
    const now = new Date().toISOString();
    return `---
title: ${safeSelectedPost.title || "New Post"}
created_at: ${safeSelectedPost.created_at || now}
updated_at: ${now}
image: ${safeSelectedPost.image || ""}
category: ${safeSelectedPost.category || ""}
author: ${safeSelectedPost.author || ""}
---

`;
  }, [
    safeSelectedPost.title,
    safeSelectedPost.created_at,
    safeSelectedPost.image,
    safeSelectedPost.category,
    safeSelectedPost.author,
  ]);

  // Get content without frontmatter for the editor
  const getContentWithoutFrontmatter = (content: string) => {
    if (!content) return "";

    if (content.trim().startsWith("---")) {
      const parts = content.split("---");
      if (parts.length >= 3) {
        return parts.slice(2).join("---").trim();
      }
    }
    return content;
  };

  // Get content with frontmatter for saving
  const getContentWithFrontmatter = (bodyContent: string) => {
    return currentFrontmatter + bodyContent;
  };

  // Handle client-side mounting
  useEffect(() => {
    // Use a small delay to ensure proper hydration
    const timer = setTimeout(() => {
      setIsClient(true);
      setMounted(true);
    }, 0);

    return () => clearTimeout(timer);
  }, []);

  // Apply dark mode styles to the editor (only on client)
  useEffect(() => {
    if (mounted && isClient) {
      // Use a timeout to ensure DOM is ready
      const timeoutId = setTimeout(() => {
        const editorElement = document.querySelector(
          '[data-testid="mdxeditor-root"]'
        );
        if (editorElement) {
          if (theme === "dark") {
            editorElement.classList.add("dark");
            document.documentElement.classList.add("dark");
          } else {
            editorElement.classList.remove("dark");
            document.documentElement.classList.remove("dark");
          }
        }
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [theme, mounted, isClient]);

  // Show loading state during SSR or before mounting
  if (!mounted || !isClient) {
    return (
      <div className="flex flex-col px-2 w-full lg:max-h-full max-h-96 min-h-96">
        <h1 className="text-2xl font-bold py-4 text-center">Editor</h1>
        <div className="w-full rounded-md flex-1 bg-white dark:bg-gray-800 h-full lg:min-h-[calc(100vh-210px)] animate-pulse">
          <div className="h-full bg-gray-200 dark:bg-gray-700 rounded-md"></div>
        </div>
      </div>
    );
  }

  // Safety check for content
  const safeContent = selectedPostContent || "";
  const editorContent = getContentWithoutFrontmatter(safeContent);

  // Additional safety check to prevent rendering issues
  if (!selectedPost || typeof selectedPost !== "object") {
    return (
      <div className="flex flex-col px-2 w-full lg:max-h-full max-h-96 min-h-96">
        <h1 className="text-2xl font-bold py-4 text-center">Editor</h1>
        <div className="w-full rounded-md flex-1 bg-white dark:bg-gray-800 h-full lg:min-h-[calc(100vh-210px)]">
          <div className="h-full flex items-center justify-center text-gray-500">
            Invalid post data
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col px-2 w-full lg:max-h-full max-h-96 min-h-96">
      {selectedPost && (
        <>
          <h1 className="text-2xl font-bold py-4 text-center">Editor</h1>
          <div className="w-full rounded-md flex-1 h-full lg:min-h-[calc(100vh-210px)] border border-gray-300 dark:border-gray-600">
            <MDXEditor
              ref={editorRef}
              markdown={editorContent}
              onChange={(newContent) => {
                const contentWithFrontmatter =
                  getContentWithFrontmatter(newContent);
                setSelectedPostContent(contentWithFrontmatter);
              }}
              plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
                frontmatterPlugin(),
                codeBlockPlugin({ defaultCodeBlockLanguage: "js" }),
                codeMirrorPlugin({
                  codeBlockLanguages: {
                    js: "JavaScript",
                    ts: "TypeScript",
                    jsx: "JSX",
                    tsx: "TSX",
                    html: "HTML",
                    css: "CSS",
                    json: "JSON",
                    md: "Markdown",
                    py: "Python",
                    sql: "SQL",
                  },
                }),
                imagePlugin(),
                tablePlugin(),
                linkPlugin(),
                linkDialogPlugin(),
                directivesPlugin({
                  directiveDescriptors: [AdmonitionDirectiveDescriptor],
                }),
                diffSourcePlugin({ viewMode: "rich-text" }),
                toolbarPlugin({
                  toolbarContents: () => (
                    <>
                      <UndoRedo />
                      <BoldItalicUnderlineToggles />
                      <BlockTypeSelect />
                      <CreateLink />
                      <InsertImage />
                      <InsertTable />
                      <InsertThematicBreak />
                    </>
                  ),
                }),
              ]}
              className={`h-full ${theme === "dark" ? "dark" : ""}`}
              contentEditableClassName={`prose prose-sm sm:prose lg:prose-lg xl:prose-2xl mx-auto focus:outline-none ${
                theme === "dark"
                  ? "prose-invert prose-headings:text-white prose-p:text-gray-300 prose-strong:text-white prose-em:text-gray-300 prose-code:text-green-400 prose-pre:bg-gray-800 prose-pre:text-gray-200"
                  : "prose-headings:text-gray-900 prose-p:text-gray-700 prose-strong:text-gray-900 prose-em:text-gray-700 prose-code:text-green-600 prose-pre:bg-gray-100 prose-pre:text-gray-800"
              }`}
              placeholder="Start writing your blog post..."
            />
          </div>
        </>
      )}
    </div>
  );
}
