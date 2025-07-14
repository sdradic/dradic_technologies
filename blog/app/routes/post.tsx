import { useLocation } from "react-router";
import { fetchPostContent } from "~/modules/api";
import type { Route } from "./+types/post";
import { renderMarkdownToHtml, parseMarkdown } from "~/modules/utils";
import { MarkdownRenderer } from "~/components/markdown";
import { useEffect, useState } from "react";
import NotFound from "./404";
import Loader from "~/components/Loader";

interface LoaderData {
  html: string;
  metadata: {
    title: string;
    created_at: string;
    image?: string;
    category?: string;
    author?: string;
  };
}

export default function Post({ params }: Route.ComponentProps) {
  const location = useLocation();
  const postFromState = location.state?.post;
  const [renderedPost, setRenderedPost] = useState<null | LoaderData>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setIsLoading(true);
        let content = "";

        if (
          postFromState?.content &&
          postFromState.content !== "Error loading content"
        ) {
          // Use content from navigation state if available and valid
          content = postFromState.content;
        } else {
          // Fetch content from API
          content = await fetchPostContent(params.id);
        }

        if (!content) {
          throw new Error("No post content available");
        }

        // Parse markdown content using utility functions
        const { metadata, body } = parseMarkdown(content);
        const html = await renderMarkdownToHtml(content);

        setRenderedPost({
          html,
          metadata,
        });
      } catch (err) {
        console.error("Failed to load blog post", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [params.id, postFromState]);

  if (isLoading) {
    return (
      <div className="flex flex-col w-full max-w-4xl mx-auto px-4 pt-4">
        <Loader message="Loading post..." />
      </div>
    );
  }

  if (!renderedPost) {
    return <NotFound />;
  }

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 pt-4">
      <div className="flex flex-row w-full mb-4 pt-4 items-center justify-center gap-2">
        <p className="text-gray-500 dark:text-gray-400 text-md md:text-lg">
          {renderedPost.metadata.created_at.split("T")[0]}
        </p>
        <div className="w-1 h-1 bg-gray-500 dark:bg-gray-400 rounded-full"></div>
        <p className="text-gray-500 dark:text-gray-400 text-md md:text-lg">
          {renderedPost.metadata.category || "Education Path"}
        </p>
        <div className="w-1 h-1 bg-gray-500 dark:bg-gray-400 rounded-full"></div>
        <p className="text-gray-500 dark:text-gray-400 text-md md:text-lg">
          {renderedPost.metadata.author || "Dusan Radic"}
        </p>
      </div>
      <span className="text-3xl md:text-4xl font-bold text-center mb-4">
        {renderedPost.metadata.title}
      </span>
      <img
        src={
          renderedPost.metadata.image
            ? renderedPost.metadata.image
            : "/blog_post_placeholder.png"
        }
        alt={renderedPost.metadata.title}
        className="h-48 md:h-96  rounded-xl object-cover my-4"
      />
      <div className="w-full rounded-lg min-h-72 p-4 md:p-6 overflow-x-auto">
        <MarkdownRenderer content={renderedPost.html} />
      </div>
    </div>
  );
}
