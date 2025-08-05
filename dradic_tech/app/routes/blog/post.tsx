import { useLocation } from "react-router";
import { fetchPostContent } from "~/modules/api";
import type { Route } from "./+types/post";
import { renderMarkdownToHtml } from "~/modules/utils";
import { MarkdownRenderer } from "~/components/markdown";
import { useEffect, useState } from "react";
import NotFound from "../404";
import Loader from "~/components/Loader";
import { localState } from "~/modules/utils";
import type { BlogPostWithSeparatedContent } from "~/modules/types";

interface LoaderData {
  html: string;
  metadata: {
    title: string;
    created_at: string;
    updated_at: string;
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
        let post: BlogPostWithSeparatedContent | null = null;

        // Skip cache for now to ensure fresh data (temporary fix for migration)
        if (
          postFromState?.content &&
          postFromState.content !== "Error loading content"
        ) {
          // Use content from navigation state if available and valid
          // Convert to new format if needed
          if (postFromState.metadata) {
            post = postFromState;
          } else {
            post = {
              metadata: {
                slug: postFromState.slug,
                title: postFromState.title,
                created_at: postFromState.created_at,
                updated_at: postFromState.updated_at,
                image: postFromState.image,
                category: postFromState.category,
                author: postFromState.author,
              },
              content: postFromState.content,
            };
          }
        } else {
          // Fetch content from API
          post = await fetchPostContent(params.slug);
          // Cache the post for future use
          if (post) {
            localState.setPost({
              slug: post.metadata.slug,
              title: post.metadata.title,
              created_at: post.metadata.created_at,
              updated_at: post.metadata.updated_at,
              image: post.metadata.image,
              category: post.metadata.category,
              author: post.metadata.author,
              content: post.content,
            });
          }
        }

        if (!post || !post.content) {
          throw new Error("No post content available");
        }

        // Render markdown content (now pure markdown without frontmatter)
        const html = await renderMarkdownToHtml(post.content);

        setRenderedPost({
          html,
          metadata: post.metadata,
        });
      } catch (err) {
        console.error("Failed to load blog post", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [params.slug, postFromState]);

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
          {new Date(renderedPost.metadata.created_at).toLocaleDateString(
            "en-US",
            window.innerWidth > 768
              ? {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                }
              : {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                },
          )}
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
      <span className="text-3xl md:text-4xl font-bold text-center mb-2">
        {renderedPost.metadata.title}
      </span>
      <p className="text-gray-500 dark:text-gray-400 text-md md:text-sm text-center text-xs">
        Last updated:{" "}
        {new Date(renderedPost.metadata.updated_at).toLocaleDateString(
          "en-US",
          {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          },
        )}
      </p>
      <img
        src={
          renderedPost.metadata.image
            ? renderedPost.metadata.image
            : "/blog_post_placeholder.webp"
        }
        alt={renderedPost.metadata.image}
        className="h-48 md:h-96  rounded-xl object-cover my-4"
      />
      <div className="w-full rounded-lg min-h-72 p-4 md:p-6 overflow-x-auto">
        <MarkdownRenderer content={renderedPost.html} />
      </div>
    </div>
  );
}
