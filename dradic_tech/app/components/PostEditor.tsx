import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { useNavigate } from "react-router";
import MDXEditorComponent from "~/components/MDXEditor";
import { MarkdownRenderer } from "~/components/markdown";
import {
  SaveIcon,
  ChevronLeftIcon,
  TrashIcon,
  ThreeDotsMenuIcon,
} from "~/components/Icons";
import type { BlogPost, BlogPostWithSeparatedContent } from "~/modules/types";
import { v7 as uuidv7 } from "uuid";
import { useAuth } from "~/contexts/AuthContext";
import { createPost, updatePost, deletePost } from "~/modules/apis";
import {
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
  const [error, setError] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [viewMode, setViewMode] = useState<"edit" | "preview" | "split">(
    "edit",
  );
  const editorRootRef = useRef<HTMLElement | null>(null);
  const previewRef = useRef<HTMLDivElement | null>(null);

  // Synchronize scrolling between editor and preview in split view
  useEffect(() => {
    if (viewMode !== "split") return;
    const editorEl = editorRootRef.current;
    const previewEl = previewRef.current;
    if (!editorEl || !previewEl) return;

    let syncing = false;

    const sync = (source: HTMLElement, target: HTMLElement) => {
      if (syncing) return;
      syncing = true;
      const sourceMax = source.scrollHeight - source.clientHeight;
      const ratio = sourceMax > 0 ? source.scrollTop / sourceMax : 0;
      const targetMax = target.scrollHeight - target.clientHeight;
      target.scrollTop = ratio * targetMax;
      syncing = false;
    };

    const onEditorScroll = () => sync(editorEl, previewEl);
    const onPreviewScroll = () => sync(previewEl, editorEl);

    editorEl.addEventListener("scroll", onEditorScroll);
    previewEl.addEventListener("scroll", onPreviewScroll);

    return () => {
      editorEl.removeEventListener("scroll", onEditorScroll);
      previewEl.removeEventListener("scroll", onPreviewScroll);
    };
  }, [viewMode]);

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

  // Memoize the selectedPost object to prevent unnecessary re-renders
  const selectedPost = useMemo(() => {
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

    return {
      ...defaultPost,
      title: formData.title,
      image: formData.image,
      category: formData.category,
      author: formData.author,
    };
  }, [
    slug,
    formData.title,
    formData.image,
    formData.category,
    formData.author,
    postContent,
    existingPost?.metadata.created_at,
  ]);

  const handleSave = useCallback(async () => {
    if (!isAuthenticated) {
      setError("You must be logged in to save posts");
      return;
    }

    // Validate form data
    const validation = validateBlogForm({ ...formData, content: postContent });
    if (!validation.isValid) {
      setError(validation.errors.join("\n"));
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
          newSlug,
        );
        await createPost(newPost);
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
        navigate(`/blog/${slug}`, { state: { post: updatedPost } });
      }
    } catch (error) {
      console.error("Failed to save post:", error);
      setError(
        `Failed to save post: ${
          error instanceof Error ? error.message : "Unknown error"
        }`,
      );
    } finally {
      setIsSaving(false);
    }
  }, [
    isAuthenticated,
    formData,
    postContent,
    isNewPost,
    slug,
    existingPost?.metadata.created_at,
    navigate,
  ]);

  const handleDelete = useCallback(async () => {
    if (!isAuthenticated) {
      setError("You must be logged in to delete posts");
      return;
    }

    if (!slug) {
      setError("Cannot delete a post that hasn't been saved yet");
      return;
    }

    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(slug);
        navigate("/admin");
      } catch (error) {
        console.error("Failed to delete post:", error);
        setError("Failed to delete post. Please try again.");
      }
    }
  }, [isAuthenticated, slug, navigate]);

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
    <div className="w-full ">
      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}
      {/* Header controls*/}
      <div className="flex flex-col gap-2">
        <div className="flex flex-row w-full pt-4 items-center justify-between">
          <button
            onClick={() => navigate("/admin")}
            className="group flex flex-row items-center gap-2 px-4 py-2 min-w-24 justify-center cursor-pointer hover:text-primary-500 dark:hover:text-primary-400"
          >
            <ChevronLeftIcon className="size-4 stroke-2 stroke-gray-500 dark:stroke-gray-100 group-hover:stroke-primary-500 dark:group-hover:stroke-primary-400" />
            Back
          </button>
          {/* Desktop Buttons */}
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="group flex-row md:flex hidden items-center gap-2 border border-primary-500 text-white bg-primary-400 dark:bg-primary-600 dark:border-gray-700 rounded-full px-4 py-2 min-w-28 justify-center cursor-pointer hover:bg-primary-500 dark:hover:bg-primary-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <SaveIcon className="size-4 stroke-2 md:flex hidden stroke-white dark:stroke-gray-100 group-hover:stroke-gray-50 dark:group-hover:stroke-gray-50" />
              {isSaving ? "Saving..." : "Save"}
            </button>
            {!isNewPost && (
              <button
                onClick={handleDelete}
                className="group flex-row md:flex hidden items-center gap-2 px-4 py-2 min-w-28 justify-center cursor-pointer border border-red-200 dark:border-red-700 rounded-full hover:bg-red-600 dark:hover:bg-red-400 bg-red-500 dark:bg-red-500 text-white disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <TrashIcon className="size-4 stroke-2 stroke-white dark:stroke-red-100 group-hover:stroke-red-100 dark:group-hover:stroke-red-100" />
                Delete
              </button>
            )}
          </div>
          {/* Mobile Buttons */}
          <div className="flex gap-2 md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <ThreeDotsMenuIcon className="size-5 stroke-2 stroke-gray-500 dark:stroke-gray-100 group-hover:stroke-primary-500 dark:group-hover:stroke-primary-400 cursor-pointer" />
            </button>
            {isMobileMenuOpen && (
              <>
                <div
                  className="fixed inset-0 bg-transparent"
                  onClick={() => setIsMobileMenuOpen(false)}
                  onKeyDown={(e) => {
                    if (e.key === "Escape") {
                      setIsMobileMenuOpen(false);
                    }
                  }}
                  tabIndex={-1}
                  role="presentation"
                />
                <div className="absolute right-4 top-36 bg-white dark:bg-dark-500 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg p-2 flex flex-col gap-2 z-10">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave();
                      setIsMobileMenuOpen(false);
                    }}
                    disabled={isSaving}
                    className="group flex flex-row items-center rounded-md gap-2 px-4 py-2 min-w-28 justify-start cursor-pointer hover:bg-gray-100 hover:text-primary-600 dark:hover:bg-gray-700 dark:hover:text-primary-400 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <SaveIcon className="size-4 stroke-2 stroke-gray-500 dark:stroke-gray-100 group-hover:stroke-primary-600 dark:group-hover:stroke-primary-600" />
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                  {!isNewPost && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDelete();
                        setIsMobileMenuOpen(false);
                      }}
                      className="group flex flex-row items-center rounded-md gap-2 px-4 py-2 min-w-28 justify-start cursor-pointer hover:bg-red-100 dark:hover:bg-red-500 text-red-600 dark:text-red-400 hover:text-red-600 dark:hover:text-red-200"
                    >
                      <TrashIcon className="size-4 stroke-2 stroke-red-600 dark:stroke-red-400 group-hover:stroke-red-600 dark:group-hover:stroke-red-200" />
                      Delete
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        <h1 className="text-2xl font-bold text-center mb-4">
          {isNewPost ? "Create New Post" : "Edit Post"}
        </h1>
      </div>

      {/* Metadata Form */}
      <BlogPostForm formData={formData} onFormDataChange={setFormData} />

      {/* View Mode Switcher */}
      <div className="flex items-center justify-end gap-2 p-2">
        <button
          onClick={() => setViewMode("edit")}
          className={`px-3 py-1 rounded-md text-sm border ${viewMode === "edit" ? "bg-primary-600 text-white border-primary-600" : "bg-transparent text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"} cursor-pointer`}
        >
          Edit
        </button>
        <button
          onClick={() => setViewMode("preview")}
          className={`px-3 py-1 rounded-md text-sm border ${viewMode === "preview" ? "bg-primary-600 text-white border-primary-600" : "bg-transparent text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"} cursor-pointer`}
        >
          Preview
        </button>
        <button
          onClick={() => setViewMode("split")}
          className={`px-3 py-1 rounded-md text-sm border ${viewMode === "split" ? "bg-primary-600 text-white border-primary-600" : "bg-transparent text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600"} cursor-pointer`}
        >
          Split
        </button>
      </div>
      {/* Editor */}
      <div className="w-full rounded-lg min-h-72 px-2 overflow-x-auto border border-gray-300 dark:border-gray-600">
        {/* Content */}
        {viewMode === "edit" && (
          <MDXEditorComponent
            selectedPost={selectedPost}
            selectedPostContent={postContent}
            setSelectedPostContent={setPostContent}
          />
        )}

        {viewMode === "preview" && (
          <div className="w-full rounded-lg min-h-72 p-4 md:p-6 overflow-x-auto">
            <MarkdownRenderer content={postContent} />
          </div>
        )}

        {viewMode === "split" && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            style={{ height: "70vh" }}
          >
            <div className="h-full overflow-y-auto">
              <MDXEditorComponent
                selectedPost={selectedPost}
                selectedPostContent={postContent}
                setSelectedPostContent={setPostContent}
                onRootElementReady={(el) => {
                  editorRootRef.current = el;
                }}
              />
            </div>
            <div
              ref={previewRef}
              className="h-full rounded-lg p-4 md:p-6 overflow-y-auto overflow-x-auto border-l border-gray-200 dark:border-gray-700"
            >
              <MarkdownRenderer content={postContent} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
