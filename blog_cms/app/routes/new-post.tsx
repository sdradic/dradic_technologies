import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router";
import MDXEditorComponent from "~/components/MDXEditor";
import { localState } from "~/modules/utils";
import { SaveIcon, ChevronLeftIcon } from "~/components/Icons";
import type { BlogPost } from "~/modules/types";
import { v7 as uuidv7 } from "uuid";
import { useAuth } from "~/contexts/AuthContext";
import { createPost } from "~/modules/apis";
import {
  BLOG_CATEGORIES,
  type BlogFormData,
  createBlogPostFromForm,
  validateBlogForm,
  getDefaultFormData,
} from "~/modules/utils";
import { BlogPostForm } from "~/components/BlogPostForm";

export default function NewPost() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [formData, setFormData] = useState<BlogFormData>(getDefaultFormData());
  const [postContent, setPostContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  // Initialize content with frontmatter when component mounts
  useEffect(() => {
    if (!postContent) {
      setPostContent("");
    }
  }, []);

  const defaultPost: BlogPost = {
    slug: "",
    title: formData.title || "New Post",
    content: postContent,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    image: formData.image,
    category: formData.category,
    author: formData.author,
  };

  // Memoize the selectedPost object to prevent unnecessary re-renders
  const selectedPost = useMemo(
    () => ({
      ...defaultPost,
      title: formData.title,
      image: formData.image,
      category: formData.category,
      author: formData.author,
    }),
    [
      formData.title,
      formData.image,
      formData.category,
      formData.author,
      defaultPost,
    ]
  );

  const handleSave = async () => {
    if (!isAuthenticated) {
      alert("You must be logged in to create posts");
      return;
    }

    // Validate form data
    const validation = validateBlogForm({ ...formData, content: postContent });
    if (!validation.isValid) {
      alert(validation.errors.join("\n"));
      return;
    }

    setIsSaving(true);
    try {
      console.log("Creating new post...");

      // Generate UUID v7 for the slug
      const slug = uuidv7();

      // Create the blog post using the shared utility
      const newPost = createBlogPostFromForm(
        { ...formData, content: postContent },
        slug
      );

      // Create the post via API
      await createPost(newPost);

      // Save to local storage
      localState.setPost(newPost);

      // Navigate to the new post
      navigate(`/${slug}`, { state: { post: newPost } });
    } catch (error) {
      console.error("Failed to save post:", error);
      alert(
        `Failed to save post: ${
          error instanceof Error ? error.message : "Unknown error"
        }`
      );
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
      <BlogPostForm formData={formData} onFormDataChange={setFormData} />

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
