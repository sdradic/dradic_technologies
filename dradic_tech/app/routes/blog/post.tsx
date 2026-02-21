import { useLocation } from "react-router";
import { fetchPostContent } from "~/modules/apis";
import type { Route } from "./+types/post";
import { MarkdownRenderer } from "~/components/markdown";
import { useEffect, useState } from "react";
import NotFound from "../404";
import Loader from "~/components/Loader";
import { Calendar, User } from "lucide-react";
import type { BlogPostWithSeparatedContent } from "~/modules/types";

interface LoaderData {
  content: string; // raw markdown content
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
        }

        if (!post || !post.content) {
          throw new Error("No post content available");
        }

        // Keep pure markdown content; rendering handled by MarkdownRenderer
        setRenderedPost({ content: post.content, metadata: post.metadata });
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
      <div className="flex flex-col w-full max-w-4xl mx-auto px-4 pt-4 min-h-screen justify-center items-center">
        <Loader message="Loading post..." />
      </div>
    );
  }

  if (!renderedPost) {
    return <NotFound />;
  }

  const formattedDate = new Date(
    renderedPost.metadata.created_at,
  ).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  return (
    <article className="flex flex-col w-full max-w-3xl mx-auto px-4 pt-4 pb-16">
      {/* Metadata: Category badge + Date */}
      <div className="flex flex-wrap items-center gap-3 mb-6">
        <span className="inline-flex items-center px-3 py-1 rounded-md text-sm font-semibold bg-brand-100 dark:bg-brand-900/40 text-brand-700 dark:text-brand-300 uppercase tracking-wider">
          {renderedPost.metadata.category || "Article"}
        </span>
        <span className="flex items-center gap-2 text-slate-600 dark:text-slate-400 text-sm">
          <Calendar className="size-4" />
          {formattedDate}
        </span>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white tracking-tight mb-8">
        {renderedPost.metadata.title}
      </h1>

      {/* Author */}
      <div className="flex items-start gap-4 mb-8">
        <div className="shrink-0 w-12 h-12 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
          <User className="size-6 text-slate-500 dark:text-slate-400" />
        </div>
        <div>
          <p className="font-semibold text-slate-900 dark:text-white">
            {renderedPost.metadata.author || "Dradic Technologies"}
          </p>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Engineering Team, Dradic Tech
          </p>
        </div>
      </div>

      <hr className="border-slate-200 dark:border-slate-700 mb-8" />

      {/* Featured image */}
      {renderedPost.metadata.image && (
        <img
          src={renderedPost.metadata.image}
          alt=""
          className="w-full h-48 md:h-80 rounded-xl object-cover mb-10"
        />
      )}

      {/* Content */}
      <div className="prose prose-lg dark:prose-invert max-w-none">
        <MarkdownRenderer content={renderedPost.content} />
      </div>

      {/* Share this insight */}
      <div className="mt-12 p-6 rounded-xl bg-slate-100 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="font-semibold text-slate-800 dark:text-white">
          Share this insight
        </p>
        <div className="flex items-center gap-3">
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Share"
          >
            <svg
              className="size-5 text-slate-600 dark:text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
              />
            </svg>
          </button>
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Share on LinkedIn"
          >
            <svg
              className="size-5 text-slate-600 dark:text-slate-400"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
            </svg>
          </button>
          <button
            type="button"
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
            aria-label="Bookmark"
          >
            <svg
              className="size-5 text-slate-600 dark:text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
              />
            </svg>
          </button>
        </div>
      </div>
    </article>
  );
}
