import { useEffect, useRef, useState } from "react";
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
  codeBlockPlugin,
  codeMirrorPlugin,
  AdmonitionDirectiveDescriptor,
  directivesPlugin,
  diffSourcePlugin,
  type MDXEditorMethods,
} from "@mdxeditor/editor";
import { useTheme } from "~/contexts/ThemeContext";
import type { BlogPost } from "~/modules/types";

// Import the editor styles
import "@mdxeditor/editor/style.css";

interface MDXEditorProps {
  selectedPost: BlogPost;
  selectedPostContent: string;
  setSelectedPostContent: (content: string) => void;
  onRootElementReady?: (el: HTMLElement) => void;
}

export default function MDXEditorComponent({
  selectedPost,
  selectedPostContent,
  setSelectedPostContent,
  onRootElementReady,
}: MDXEditorProps) {
  const { theme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isClient, setIsClient] = useState(false);
  const editorRef = useRef<MDXEditorMethods | null>(null);

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
          '[data-testid="mdxeditor-root"]',
        );
        if (editorElement) {
          if (onRootElementReady) {
            onRootElementReady(editorElement as HTMLElement);
          }
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
        <h1 className="text-2xl font-bold py-4 text-center text-slate-800 dark:text-slate-200">
          Editor
        </h1>
        <div className="w-full rounded-md flex-1 bg-white dark:bg-slate-900 h-full lg:min-h-[calc(100vh-210px)] animate-pulse">
          <div className="h-full bg-slate-200 dark:bg-slate-800 rounded-md"></div>
        </div>
      </div>
    );
  }

  // Safety check for content
  const safeContent = selectedPostContent || "";

  // Additional safety check to prevent rendering issues
  if (!selectedPost || typeof selectedPost !== "object") {
    return (
      <div className="flex flex-col px-2 w-full lg:max-h-full max-h-96 min-h-96">
        <h1 className="text-2xl font-bold py-4 text-center text-slate-800 dark:text-slate-200">
          Editor
        </h1>
        <div className="w-full rounded-md flex-1 bg-white dark:bg-slate-900 h-full lg:min-h-[calc(100vh-210px)]">
          <div className="h-full flex items-center justify-center text-slate-500 dark:text-slate-400">
            Invalid post data
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-h-96 min-h-96">
      {selectedPost && (
        <>
          <h1 className="text-2xl font-bold py-4 text-center text-slate-800 dark:text-slate-200">
            Editor
          </h1>
          <div className="w-full rounded-md flex-1 h-full lg:min-h-[calc(100vh-210px)]">
            <MDXEditor
              ref={editorRef}
              markdown={safeContent}
              onChange={(newContent: string) => {
                setSelectedPostContent(newContent);
              }}
              plugins={[
                headingsPlugin(),
                listsPlugin(),
                quotePlugin(),
                thematicBreakPlugin(),
                markdownShortcutPlugin(),
                codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
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
                  ? "prose-invert prose-headings:text-slate-100 prose-p:text-slate-300 prose-strong:text-slate-100 prose-em:text-slate-300 prose-code:text-brand-400 prose-pre:bg-slate-800 prose-pre:text-slate-200"
                  : "prose-headings:text-slate-900 prose-p:text-slate-700 prose-strong:text-slate-900 prose-em:text-slate-700 prose-code:text-brand-600 prose-pre:bg-slate-100 prose-pre:text-slate-800"
              }`}
              placeholder="Start writing your blog post..."
            />
          </div>
        </>
      )}
    </div>
  );
}
