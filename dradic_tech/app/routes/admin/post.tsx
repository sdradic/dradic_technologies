import { useLocation, useNavigate } from "react-router";
import { fetchPostContent } from "~/modules/apis";
import { useEffect, useState, useRef } from "react";
import Loader from "~/components/Loader";
import PostEditor from "~/components/PostEditor";
import type { BlogPostWithSeparatedContent } from "~/modules/types";
import { localState } from "~/modules/utils";
import { useAuth } from "~/contexts/AuthContext";

export default function AdminPost({ params }: { params: { slug: string } }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, isLoading: isAuthLoading } = useAuth();
  const postFromState = location.state?.post;
  const [existingPost, setExistingPost] =
    useState<BlogPostWithSeparatedContent | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasNavigated = useRef(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthLoading && !isAuthenticated && !hasNavigated.current) {
      hasNavigated.current = true;
      navigate("/admin/login");
    }
  }, [isAuthLoading, isAuthenticated, navigate]);

  useEffect(() => {
    const loadPost = async () => {
      try {
        setIsLoading(true);
        let post: BlogPostWithSeparatedContent | null = null;

        // Use content from navigation state if available and valid
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

        setExistingPost(post);
      } catch (err) {
        console.error("Failed to load blog post", err);
      } finally {
        setIsLoading(false);
      }
    };

    loadPost();
  }, [params.slug, postFromState]);

  // Show loading state while checking authentication
  if (isAuthLoading) {
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

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <Loader />
      </div>
    );
  }

  if (!existingPost) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <p className="text-red-500">Post not found</p>
      </div>
    );
  }

  return (
    <PostEditor
      isNewPost={false}
      existingPost={existingPost}
      slug={params.slug}
    />
  );
}
