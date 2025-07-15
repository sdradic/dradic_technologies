import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import MDXEditorComponent from "~/components/MDXEditor";
import { localState } from "~/modules/utils";
import { SaveIcon, ChevronLeftIcon } from "~/components/Icons";
import type { BlogPost } from "~/modules/types";

export default function NewPost() {
  const navigate = useNavigate();
  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postImage, setPostImage] = useState("");
  const [postCategory, setPostCategory] = useState("");
  const [postAuthor, setPostAuthor] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Initialize content with frontmatter when component mounts
  useEffect(() => {
    if (!postContent) {
      setPostContent(generateFrontmatter());
    }
  }, []);

  // Generate frontmatter with current form values
  const generateFrontmatter = () => {
    const now = new Date().toISOString();
    return `---
title: ${postTitle || "New Post"}
created_at: ${now}
updated_at: ${now}
image: ${postImage || ""}
category: ${postCategory || ""}
author: ${postAuthor || ""}
---

`;
  };

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

  const defaultPost: BlogPost = {
    slug: "",
    title: postTitle || "New Post",
    content: postContent || generateFrontmatter(),
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    image: postImage,
    category: postCategory,
    author: postAuthor,
  };

  // Memoize the selectedPost object to prevent unnecessary re-renders
  const selectedPost = useMemo(
    () => ({
      ...defaultPost,
      title: postTitle,
      image: postImage,
      category: postCategory,
      author: postAuthor,
    }),
    [postTitle, postImage, postCategory, postAuthor, defaultPost]
  );

  const handleSave = async () => {
    if (!postTitle.trim()) {
      alert("Please enter a title for your post");
      return;
    }

    if (!postContent.trim()) {
      alert("Please enter some content for your post");
      return;
    }

    setIsSaving(true);
    try {
      // Create a slug from the title
      const slug = postTitle
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      // Ensure content has proper frontmatter
      const contentWithFrontmatter = postContent.trim().startsWith("---")
        ? postContent
        : generateFrontmatter() + postContent;

      const newPost: BlogPost = {
        ...defaultPost,
        slug,
        title: postTitle,
        content: contentWithFrontmatter,
        image: postImage,
        category: postCategory,
        author: postAuthor,
        updated_at: new Date().toISOString(),
      };

      // Save to local storage
      localState.setPost(newPost);

      // Navigate to the new post
      navigate(`/${slug}`, { state: { post: newPost } });
    } catch (error) {
      console.error("Failed to save post:", error);
      alert("Failed to save post. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto px-4 pt-4">
      {/* Header */}
      <div className="flex flex-row w-full mb-4 pt-4 items-center justify-between gap-2">
        <button
          onClick={() => navigate("/")}
          className="flex flex-row items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 min-w-24 justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 bg-gray-100 dark:bg-gray-700"
        >
          <ChevronLeftIcon className="w-4 h-4 stroke-2 stroke-gray-500 dark:stroke-gray-100" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-center">Create New Post</h1>
        <button
          onClick={handleSave}
          disabled={isSaving}
          className="flex flex-row items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 min-w-24 justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 bg-gray-100 dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <SaveIcon className="w-4 h-4 stroke-2 stroke-gray-500 dark:stroke-gray-100" />
          {isSaving ? "Saving..." : "Save"}
        </button>
      </div>

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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
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
          selectedPost={selectedPost}
          selectedPostContent={postContent}
          setSelectedPostContent={setPostContent}
        />
      </div>
    </div>
  );
}
