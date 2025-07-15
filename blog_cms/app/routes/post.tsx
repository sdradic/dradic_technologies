import { useLocation } from "react-router";
import { fetchPostContent } from "~/modules/apis";
import type { Route } from "./+types/post";
import { renderMarkdownToHtml, parseMarkdown } from "~/modules/utils";
import { MarkdownRenderer } from "~/components/markdown";
import { useEffect, useState, useMemo } from "react";
import NotFound from "./404";
import Loader from "~/components/Loader";
import { placeholderImage } from "~/modules/store";
import { localState } from "~/modules/utils";
import { TrashIcon, SaveIcon } from "~/components/Icons";
import MDXEditorComponent from "~/components/MDXEditor";

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
  const [isEditing, setIsEditing] = useState(false);
  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postImage, setPostImage] = useState("");
  const [postCategory, setPostCategory] = useState("");
  const [postAuthor, setPostAuthor] = useState("");

  // Predefined categories for dropdown
  const categories = [
    "Technology",
    "Programming",
    "IoT",
    "Electronics",
    "Embedded Systems",
    "Hardware",
    "Software",
    "Tutorial",
    "Project",
    "Review",
    "News",
    "Education",
    "Other",
  ];

  // Memoize the selectedPost object to prevent unnecessary re-renders
  const memoizedSelectedPost = useMemo(() => {
    return (
      postFromState || {
        slug: params.id,
        title: postTitle,
        content: postContent,
        created_at:
          renderedPost?.metadata?.created_at || new Date().toISOString(),
        updated_at:
          renderedPost?.metadata?.updated_at || new Date().toISOString(),
        image: postImage,
        category: postCategory,
        author: postAuthor,
      }
    );
  }, [
    postFromState,
    params.id,
    postTitle,
    postContent,
    renderedPost?.metadata?.created_at,
    renderedPost?.metadata?.updated_at,
    postImage,
    postCategory,
    postAuthor,
  ]);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setIsLoading(true);
        let content = "";

        // Check local cache first
        const cachedPost = localState.getPost(params.id);
        if (cachedPost?.content) {
          content = cachedPost.content;
        } else if (
          postFromState?.content &&
          postFromState.content !== "Error loading content"
        ) {
          // Use content from navigation state if available and valid
          content = postFromState.content;
        } else {
          // Fetch content from API
          content = await fetchPostContent(params.id);
          // Cache the post for future use
          if (content && postFromState) {
            localState.setPost({
              ...postFromState,
              content,
            });
          }
        }

        if (!content) {
          throw new Error("No post content available");
        }

        // Set the post content for editing
        setPostContent(content);

        // Parse markdown content using utility functions
        const { metadata, body } = parseMarkdown(content);
        const html = await renderMarkdownToHtml(content);

        // Set metadata for editing
        setPostTitle(metadata.title || "");
        setPostImage(metadata.image || "");
        setPostCategory(metadata.category || "");
        setPostAuthor(metadata.author || "");

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

  // Update rendered post when content changes in edit mode
  useEffect(() => {
    if (isEditing && postContent && renderedPost) {
      const updateRenderedPost = async () => {
        try {
          const html = await renderMarkdownToHtml(postContent);
          setRenderedPost((prev) => {
            if (!prev) return null;
            return {
              ...prev,
              html,
            };
          });
        } catch (error) {
          console.error("Failed to update rendered post:", error);
        }
      };
      updateRenderedPost();
    }
  }, [postContent, isEditing]); // Removed renderedPost from dependencies

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
      <div className="flex flex-row w-full mb-4 pt-4 items-center justify-evenly gap-2">
        <button className="flex flex-row items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 min-w-24 justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 bg-gray-100 dark:bg-gray-700">
          <TrashIcon className="w-4 h-4 stroke-2 stroke-gray-500 dark:stroke-gray-100" />
          Delete
        </button>
        <button
          className="flex flex-row items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 min-w-24 justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 bg-gray-100 dark:bg-gray-700"
          onClick={() => {
            // Simple toggle first to test if the issue is with the save logic
            if (!isEditing) {
              setIsEditing(true);
              return;
            }

            // Save logic only when exiting edit mode
            console.log("Saving and exiting edit mode...");
            const now = new Date().toISOString();
            const frontmatter = `---
title: ${postTitle || "Untitled"}
created_at: ${
              postFromState?.created_at ||
              renderedPost?.metadata?.created_at ||
              now
            }
updated_at: ${now}
image: ${postImage || ""}
category: ${postCategory || ""}
author: ${postAuthor || ""}
---

`;

            const contentWithFrontmatter = postContent.trim().startsWith("---")
              ? postContent
              : frontmatter + postContent;

            const postToSave = {
              slug: params.id,
              title: postTitle,
              content: contentWithFrontmatter,
              created_at:
                postFromState?.created_at ||
                renderedPost?.metadata?.created_at ||
                now,
              updated_at: now,
              image: postImage,
              category: postCategory,
              author: postAuthor,
            };

            localState.setPost(postToSave);

            // Reload the post content from localStorage to show updated data
            const updatedPost = localState.getPost(params.id);
            if (updatedPost) {
              // Update the rendered post with new content
              const updateRenderedPost = async () => {
                try {
                  const { metadata, body } = parseMarkdown(updatedPost.content);
                  const html = await renderMarkdownToHtml(updatedPost.content);

                  setRenderedPost({
                    html,
                    metadata,
                  });

                  // Update form fields with new metadata
                  setPostTitle(metadata.title || "");
                  setPostImage(metadata.image || "");
                  setPostCategory(metadata.category || "");
                  setPostAuthor(metadata.author || "");
                  setPostContent(updatedPost.content);
                } catch (error) {
                  console.error("Failed to reload post after save:", error);
                }
              };
              updateRenderedPost();
            }

            setIsEditing(false);
          }}
        >
          <SaveIcon className="w-4 h-4 stroke-2 stroke-gray-500 dark:stroke-gray-100" />
          {isEditing ? "Save" : "Edit"}
        </button>
      </div>
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
                }
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
          }
        )}
      </p>
      <img
        src={
          renderedPost.metadata.image
            ? renderedPost.metadata.image
            : placeholderImage
        }
        alt={renderedPost.metadata.title}
        className="h-48 md:h-96  rounded-xl object-cover my-4"
      />
      {isEditing ? (
        <>
          {/* Metadata Form */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {/* Title Input */}
            <div className="md:col-span-2">
              <label
                htmlFor="post-title"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Post Title *
              </label>
              <input
                id="post-title"
                type="text"
                value={postTitle}
                onChange={(e) => setPostTitle(e.target.value)}
                placeholder="Enter your post title..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-500 text-gray-900 dark:text-gray-100"
                required
              />
            </div>

            {/* Category Dropdown */}
            <div>
              <label
                htmlFor="post-category"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Category
              </label>
              <select
                id="post-category"
                value={postCategory}
                onChange={(e) => setPostCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-500 text-gray-900 dark:text-gray-100"
              >
                <option value="">Select a category...</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            {/* Author Input */}
            <div>
              <label
                htmlFor="post-author"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Author
              </label>
              <input
                id="post-author"
                type="text"
                value={postAuthor}
                onChange={(e) => setPostAuthor(e.target.value)}
                placeholder="Enter author name..."
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-500 text-gray-900 dark:text-gray-100"
              />
            </div>

            {/* Image URL Input */}
            <div className="md:col-span-2">
              <label
                htmlFor="post-image"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
              >
                Featured Image URL
              </label>
              <input
                id="post-image"
                type="url"
                value={postImage}
                onChange={(e) => setPostImage(e.target.value)}
                placeholder="https://example.com/image.jpg"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-dark-500 text-gray-900 dark:text-gray-100"
              />
              {postImage && (
                <div className="mt-2">
                  <img
                    src={postImage}
                    alt="Preview"
                    className="w-32 h-24 object-cover rounded-md border border-gray-300 dark:border-gray-600"
                    onError={(e) => {
                      e.currentTarget.style.display = "none";
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* Editor */}
          <div className="w-full rounded-lg min-h-72 p-4 md:p-6 overflow-x-auto border border-gray-300 dark:border-gray-600">
            <MDXEditorComponent
              selectedPost={memoizedSelectedPost}
              selectedPostContent={postContent}
              setSelectedPostContent={setPostContent}
            />
          </div>
        </>
      ) : (
        <div className="w-full rounded-lg min-h-72 p-4 md:p-6 overflow-x-auto">
          <MarkdownRenderer content={renderedPost.html} />
        </div>
      )}
    </div>
  );
}
