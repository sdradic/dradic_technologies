import { NavLink, useLocation } from "react-router";
import { fetchPostContent } from "~/modules/api";
import type { Route } from "./+types/post";
import { renderMarkdownToHtml, parseMarkdown } from "~/modules/utils";
import { useEffect, useState } from "react";
import { ChevronLeftIcon } from "~/components/Icons";
import NotFound from "./404";

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

export async function clientLoader({ params }: Route.ClientLoaderArgs) {
  const post = await fetchPostContent(params.id);
  return { post };
}

export default function Post({ loaderData }: Route.ComponentProps) {
  const { post } = loaderData || { post: null };
  const location = useLocation();
  const postFromState = location.state?.post;
  const [renderedPost, setRenderedPost] = useState<null | LoaderData>(null);

  useEffect(() => {
    const loadPost = async () => {
      try {
        let content = "";

        if (
          postFromState?.content &&
          postFromState.content !== "Error loading content"
        ) {
          // Use content from navigation state if available and valid
          content = postFromState.content;
        } else if (post) {
          // Use content from loader data
          content = post;
        } else {
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
      }
    };

    loadPost();
  }, [post, postFromState]);

  if (!renderedPost) {
    return <NotFound />;
  }

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 pt-4">
      <div className="flex flex-row w-full mb-4 pt-4 items-center justify-center gap-2">
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {renderedPost.metadata.created_at.split("T")[0]}
        </p>
        <div className="w-1 h-1 bg-gray-500 dark:bg-gray-400 rounded-full"></div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {renderedPost.metadata.category || "Education Path"}
        </p>
        <div className="w-1 h-1 bg-gray-500 dark:bg-gray-400 rounded-full"></div>
        <p className="text-gray-500 dark:text-gray-400 text-sm">
          {renderedPost.metadata.author || "Dusan Radic"}
        </p>
      </div>
      <span className="text-2xl font-bold text-center mb-4">
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
      <div className="w-full rounded-lg min-h-72 p-4 md:p-6 overflow-hidden">
        <div
          className="prose prose-sm md:prose-base lg:prose-lg max-w-none w-full overflow-x-auto dark:prose-invert"
          style={{
            wordWrap: "break-word",
            overflowWrap: "break-word",
          }}
          dangerouslySetInnerHTML={{
            __html: renderedPost.html,
          }}
        ></div>
      </div>
    </div>
  );
}
