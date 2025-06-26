import { Link, useLoaderData, useLocation } from "react-router";
import {
  formatDate,
  parseMarkdownWithFrontmatter,
  renderMarkdownToHtml,
} from "~/module/utils";
import Loader from "~/components/Loader";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import { useEffect, useState } from "react";
import { ChevronLeftIcon } from "~/components/Icons";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000/api";

interface LoaderData {
  html: string;
  metadata: {
    title: string;
    created_at: string;
    updated_at: string;
    image: string;
  };
}

export function loader({ params }: { params: { slug: string } }) {
  return { slug: params.slug };
}

export default function BlogPost() {
  const { slug } = useLoaderData() as { slug: string };
  const location = useLocation();
  const postFromState = location.state?.post;

  const [post, setPost] = useState<null | LoaderData>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        let content = "";

        if (
          postFromState?.content &&
          postFromState.content !== "Error loading content"
        ) {
          // Use content from navigation state if available and valid
          content = postFromState.content;
        } else {
          // Fetch from backend API
          const response = await fetch(`${API_BASE_URL}/blog/posts/${slug}`);
          if (!response.ok) {
            throw new Error(`Failed to fetch post: ${response.statusText}`);
          }
          const blogPost = await response.json();
          content = blogPost.content;
        }

        // Parse markdown content using utility functions
        const { metadata, body } = parseMarkdownWithFrontmatter(content);
        const html = await renderMarkdownToHtml(content);

        setPost({
          html,
          metadata,
        });
      } catch (err) {
        console.error("Failed to load blog post", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [postFromState, slug]);

  return (
    <div className="inverse-gradient-background flex flex-col justify-between min-h-screen">
      <div className="flex flex-col justify-between">
        <Navbar />
        {loading ? (
          <div className="flex flex-col items-center justify-center min-h-screen">
            <Loader showText={false} />
          </div>
        ) : post ? (
          <div className="flex flex-col w-full max-w-4xl mx-auto px-4 py-8">
            <div className="flex flex-col w-full mb-4 pt-4">
              <Link
                to="/blog"
                className="text-gray-500 text-sm flex items-center gap-2 mb-8"
              >
                <ChevronLeftIcon className="w-6 h-6 stroke-gray-500 hover:stroke-gray-700" />
                Back to Blog
              </Link>
              <h1 className="text-4xl font-bold text-center">
                {post.metadata.title}
              </h1>
            </div>
            <p className="text-gray-500 text-sm mb-8 text-center">
              {formatDate(post.metadata.created_at)}
            </p>
            <div className="w-full bg-white dark:bg-gray-800 rounded-lg min-h-72 p-4 md:p-6 overflow-hidden">
              <div
                className="prose prose-sm md:prose-base lg:prose-lg max-w-none w-full overflow-x-auto"
                style={{
                  wordWrap: "break-word",
                  overflowWrap: "break-word",
                }}
                dangerouslySetInnerHTML={{
                  __html: post.html,
                }}
              ></div>
            </div>
          </div>
        ) : (
          <div className="text-center text-red-600 py-8">Post not found.</div>
        )}
        <Footer />
      </div>
    </div>
  );
}
