import { useLocation, useNavigate } from "react-router";
import {
  createPost,
  deletePost,
  fetchPostContent,
  updatePost,
} from "~/modules/api";
// Admin post editing route
import { BLOG_CATEGORIES, renderMarkdownToHtml } from "~/modules/utils";
import { MarkdownRenderer } from "~/components/markdown";
import { useEffect, useState, useMemo } from "react";
import NotFound from "../404";
import Loader from "~/components/Loader";
import { placeholderImage } from "~/modules/store";
import { localState } from "~/modules/utils";
import { TrashIcon, SaveIcon } from "~/components/Icons";
import MDXEditorComponent from "~/components/MDXEditor";
import type { BlogPost, BlogPostWithSeparatedContent } from "~/modules/types";
import { useAuth } from "~/contexts/AuthContext";

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

export default function AdminPost({ params }: { params: { slug: string } }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const postFromState = location.state?.post;
  const [renderedPost, setRenderedPost] = useState<null | LoaderData>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // Form state
  const [postContent, setPostContent] = useState("");
  const [postTitle, setPostTitle] = useState("");
  const [postImage, setPostImage] = useState("");
  const [postCategory, setPostCategory] = useState("");
  const [postAuthor, setPostAuthor] = useState("");

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      navigate("/admin/login");
    }
  }, [isAuthenticated, authLoading, navigate]);

  // Memoize the selectedPost object to prevent unnecessary re-renders
  const memoizedSelectedPost = useMemo(() => {
    if (!renderedPost) return null;
    return {
      slug: params.slug!,
      title: postTitle || renderedPost.metadata.title,
      content: postContent,
      created_at: renderedPost.metadata.created_at,
      updated_at: renderedPost.metadata.updated_at,
      image: postImage || renderedPost.metadata.image || "",
      category: postCategory || renderedPost.metadata.category || "",
      author: postAuthor || renderedPost.metadata.author || "",
    };
  }, [
    renderedPost,
    postTitle,
    postContent,
    postImage,
    postCategory,
    postAuthor,
    params.slug,
  ]);

  useEffect(() => {
    const load = async () => {
      if (!params.slug) return;

      try {
        let post: BlogPostWithSeparatedContent | null = null;

        // Skip cache for now to ensure fresh data (temporary fix for migration)
        if (
          postFromState?.content &&
          postFromState.content !== "Error loading content"
        ) {
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
          post = await fetchPostContent(params.slug);
        }

        if (!post || !post.content) {
          throw new Error("No post content available");
        }

        const html = await renderMarkdownToHtml(post.content);

        setRenderedPost({
          html,
          metadata: post.metadata,
        });

        setPostContent(post.content);
        setPostTitle(post.metadata.title || "");
        setPostImage(post.metadata.image || "");
        setPostCategory(post.metadata.category || "");
        setPostAuthor(post.metadata.author || "");
      } catch (error) {
        console.error("Error loading post:", error);
        setRenderedPost(null);
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      load();
    }
  }, [params.slug, postFromState, isAuthenticated]);

  const handleSave = async () => {
    if (!isAuthenticated) {
      alert("You must be logged in to edit posts");
      return;
    }

    try {
      const updatedPost: BlogPost = {
        slug: params.slug!,
        title: postTitle,
        content: postContent, // Pure markdown content
        created_at:
          renderedPost?.metadata?.created_at || new Date().toISOString(),
        updated_at: new Date().toISOString(),
        image: postImage,
        category: postCategory,
        author: postAuthor,
      };

      await updatePost(params.slug!, updatedPost);

      // Update cache
      localState.setPost({
        slug: updatedPost.slug,
        title: updatedPost.title,
        content: updatedPost.content,
        created_at: updatedPost.created_at,
        updated_at: updatedPost.updated_at,
        image: updatedPost.image,
        category: updatedPost.category,
        author: updatedPost.author,
      });

      setIsEditing(false);

      // Refresh the rendered post
      const html = await renderMarkdownToHtml(postContent);
      setRenderedPost({
        html,
        metadata: {
          title: postTitle,
          created_at:
            renderedPost?.metadata?.created_at || new Date().toISOString(),
          updated_at: new Date().toISOString(),
          image: postImage,
          category: postCategory,
          author: postAuthor,
        },
      });
    } catch (error) {
      console.error("Failed to save post:", error);
      alert("Failed to save post. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!isAuthenticated) {
      alert("You must be logged in to delete posts");
      return;
    }

    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        await deletePost(params.slug!);
        localState.removePost(params.slug!);
        navigate("/admin");
      } catch (error) {
        console.error("Failed to delete post:", error);
        alert("Failed to delete post. Please try again.");
      }
    }
  };

  // Show loading state while checking authentication or loading post
  if (authLoading || isLoading) {
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

  if (!renderedPost) {
    return <NotFound />;
  }

  if (isEditing) {
    return (
      <div className="flex flex-col w-full max-w-6xl mx-auto px-4 pt-4">
        {/* Header */}
        <div className="flex flex-row w-full mb-4 pt-4 items-center justify-between gap-2">
          <button
            onClick={() => setIsEditing(false)}
            className="flex flex-row items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 min-w-24 justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 bg-gray-100 dark:bg-gray-700"
          >
            Cancel
          </button>
          <h1 className="text-2xl font-bold text-center">Edit Post</h1>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="flex flex-row items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 min-w-24 justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 bg-gray-100 dark:bg-gray-700"
            >
              <SaveIcon className="w-4 h-4 stroke-2 stroke-gray-500 dark:stroke-gray-100" />
              Save
            </button>
            <button
              onClick={handleDelete}
              className="flex flex-row items-center gap-2 border border-red-200 dark:border-red-700 rounded-full px-4 py-2 min-w-24 justify-center cursor-pointer hover:bg-red-100 dark:hover:bg-red-600 bg-red-50 dark:bg-red-700 text-red-600 dark:text-red-100"
            >
              <TrashIcon className="w-4 h-4 stroke-2 stroke-red-500 dark:stroke-red-100" />
              Delete
            </button>
          </div>
        </div>

        {/* Metadata Form */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Title
            </label>
            <input
              type="text"
              value={postTitle}
              onChange={(e) => setPostTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={postCategory}
              onChange={(e) => setPostCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            >
              <option value="">Select category...</option>
              {BLOG_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Author
            </label>
            <input
              type="text"
              value={postAuthor}
              onChange={(e) => setPostAuthor(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={postImage}
              onChange={(e) => setPostImage(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
            />
          </div>
        </div>

        {/* Editor */}
        <div className="w-full rounded-lg min-h-72 p-4 md:p-6 overflow-x-auto border border-gray-300 dark:border-gray-600">
          {memoizedSelectedPost && (
            <MDXEditorComponent
              selectedPost={memoizedSelectedPost}
              selectedPostContent={postContent}
              setSelectedPostContent={setPostContent}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4 pt-4">
      {/* Header */}
      <div className="flex flex-row w-full mb-4 pt-4 items-center justify-between gap-2">
        <button
          onClick={() => navigate("/admin")}
          className="flex flex-row items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 min-w-24 justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 bg-gray-100 dark:bg-gray-700"
        >
          Back
        </button>
        <h1 className="text-2xl font-bold text-center">View Post</h1>
        <button
          onClick={() => setIsEditing(true)}
          className="flex flex-row items-center gap-2 border border-gray-200 dark:border-gray-700 rounded-full px-4 py-2 min-w-24 justify-center cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-600 bg-gray-100 dark:bg-gray-700"
        >
          Edit
        </button>
      </div>

      {/* Post Content */}
      <article className="prose prose-lg max-w-none dark:prose-invert">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-4">
            {renderedPost.metadata.title}
          </h1>
          {renderedPost.metadata.image && (
            <img
              src={renderedPost.metadata.image || placeholderImage}
              alt={renderedPost.metadata.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />
          )}
          <div className="flex flex-wrap gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
            {renderedPost.metadata.author && (
              <span>By {renderedPost.metadata.author}</span>
            )}
            {renderedPost.metadata.category && (
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">
                {renderedPost.metadata.category}
              </span>
            )}
            <span>
              {new Date(renderedPost.metadata.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        <MarkdownRenderer content={renderedPost.html} />
      </article>
    </div>
  );
}
