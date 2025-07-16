import { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router";
import MDXEditorComponent from "~/components/MDXEditor";
import { localState } from "~/modules/utils";
import { SaveIcon, ChevronLeftIcon, TrashIcon } from "~/components/Icons";
import type { BlogPost, BlogPostWithSeparatedContent } from "~/modules/types";
import { v7 as uuidv7 } from "uuid";
import { useAuth } from "~/contexts/AuthContext";
import { createPost, updatePost, deletePost } from "~/modules/api";
import {
  BLOG_CATEGORIES,
  type BlogFormData,
  createBlogPostFromForm,
  validateBlogForm,
  getDefaultFormData,
} from "~/modules/utils";
import { BlogPostForm } from "~/components/BlogPostForm";
import Loader from "~/components/Loader";

interface PostEditorProps {
  isNewPost?: boolean;
  existingPost?: BlogPostWithSeparatedContent | null;
  slug?: string;
}

export default function PostEditor({
  isNewPost = false,
  existingPost = null,
  slug,
}: PostEditorProps) {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading } = useAuth();
  const [formData, setFormData] = useState<BlogFormData>(getDefaultFormData());
  const [postContent, setPostContent] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingPost, setIsLoadingPost] = useState(!isNewPost);
  const hasNavigated = useRef(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated && !hasNavigated.current) {
      hasNavigated.current = true;
      navigate("/admin/login");
    }
  }, [isAuthenticated, isLoading, navigate]);

  // Load existing post data
  useEffect(() => {
    if (!isNewPost && existingPost) {
      setFormData({
        title: existingPost.metadata.title || "",
        content: existingPost.content || "",
        image: existingPost.metadata.image || "",
        category: existingPost.metadata.category || "",
        author: existingPost.metadata.author || "",
      });
      setPostContent(existingPost.content || "");
      setIsLoadingPost(false);
    } else if (!isNewPost && slug) {
      // Load post from API if not provided
      const loadPost = async () => {
        try {
          // This would need to be implemented in the parent component
          // For now, we'll handle it through props
          setIsLoadingPost(false);
        } catch (error) {
          console.error("Error loading post:", error);
          setIsLoadingPost(false);
        }
      };
      loadPost();
    } else {
      setIsLoadingPost(false);
    }
  }, [isNewPost, existingPost, slug]);

  const defaultPost: BlogPost = {
    slug: slug || "",
    title: formData.title || "New Post",
    content: postContent,
    created_at: existingPost?.metadata.created_at || new Date().toISOString(),
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
      alert("You must be logged in to save posts");
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
      if (isNewPost) {
        // Create new post
        console.log("Creating new post...");
        const newSlug = uuidv7();
        const newPost = createBlogPostFromForm(
          { ...formData, content: postContent },
          newSlug
        );
        await createPost(newPost);
        localState.setPost(newPost);
        navigate(`/admin/${newSlug}`, { state: { post: newPost } });
      } else {
        // Update existing post
        const updatedPost: BlogPost = {
          slug: slug!,
          title: formData.title,
          content: postContent,
          created_at:
            existingPost?.metadata.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          image: formData.image,
          category: formData.category,
          author: formData.author,
        };
        await updatePost(slug!, updatedPost);
        localState.setPost(updatedPost);
        navigate(`/blog/${slug}`, { state: { post: updatedPost } });
      }
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

  const handleDelete = async () => {
    if (!isAuthenticated) {
      alert("You must be logged in to delete posts");
      return;
    }

    if (!slug) {
      alert("Cannot delete a post that hasn't been saved yet");
      return;
    }

    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(slug);
        localState.removePost(slug);
        navigate("/admin");
      } catch (error) {
        console.error("Failed to delete post:", error);
        alert("Failed to delete post. Please try again.");
      }
    }
  };

  // Show loading state while checking authentication or loading post
  if (isLoading || isLoadingPost) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  // Don't render anything if not authenticated (will redirect)
  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="flex flex-col w-full max-w-6xl mx-auto px-4 pt-4">
      {/* Header */}
      <div className="flex flex-row w-full mb-4 pt-4 items-center justify-between gap-2">
        <button
          onClick={() => navigate("/admin")}
          className="flex flex-row items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 min-w-24 justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 bg-gray-100 dark:bg-gray-700"
        >
          <ChevronLeftIcon className="w-4 h-4 stroke-2 stroke-gray-500 dark:stroke-gray-100" />
          Back
        </button>
        <h1 className="text-2xl font-bold text-center">
          {isNewPost ? "Create New Post" : "Edit Post"}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="flex flex-row items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 min-w-24 justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 bg-gray-100 dark:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <SaveIcon className="w-4 h-4 stroke-2 stroke-gray-500 dark:stroke-gray-100" />
            {isSaving ? "Saving..." : "Save"}
          </button>
          {!isNewPost && (
            <button
              onClick={handleDelete}
              className="flex flex-row items-center gap-2 border border-red-200 dark:border-red-700 rounded-full px-4 py-2 min-w-24 justify-center cursor-pointer hover:bg-red-100 dark:hover:bg-red-600 bg-red-50 dark:bg-red-700 text-red-600 dark:text-red-100"
            >
              <TrashIcon className="w-4 h-4 stroke-2 stroke-red-500 dark:stroke-red-100" />
              Delete
            </button>
          )}
        </div>
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
