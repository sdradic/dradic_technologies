import { useLoaderData, useLocation } from "react-router";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { app } from "~/module/firebase";
import {
  formatDate,
  parseMarkdownWithFrontmatter,
  renderMarkdownToHtml,
} from "~/module/utils";
import Loader from "~/components/Loader";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import { useEffect, useState } from "react";

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

        if (postFromState?.content) {
          // Use content from navigation state
          content = postFromState.content;
        } else {
          // Fetch from Firebase if no state available
          const storage = getStorage(app);
          const fileRef = ref(
            storage,
            `gs://${
              import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
            }/blog_posts/${slug}.md`
          );
          const url = await getDownloadURL(fileRef);
          const response = await fetch(url);
          content = await response.text();
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
          <Loader showText={false} />
        ) : post ? (
          <div className="flex flex-col max-w-4xl mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-4 pt-12 text-center">
              {post.metadata.title}
            </h1>
            <p className="text-gray-500 text-sm mb-8 text-center">
              {formatDate(post.metadata.created_at)}
            </p>
            <div className="flex flex-col items-center p-4 justify-center bg-white dark:bg-gray-800 rounded-lg min-h-72 w-full">
              <div
                className="prose prose-lg max-w-none"
                dangerouslySetInnerHTML={{ __html: post.html }}
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
