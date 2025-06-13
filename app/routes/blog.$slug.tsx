import { useLoaderData, useLocation } from "react-router";
import { marked } from "marked";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { app } from "~/module/firebase";
import { formatDate } from "~/module/utils";
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
        if (postFromState?.content) {
          const parts = postFromState.content.split("---");
          if (parts.length >= 3) {
            const metadata = parts[1];
            const markdownContent = parts[2];

            const title = metadata.match(/title:\s*(.*)/)?.[1] || "";
            const created_at = metadata.match(/created_at:\s*(.*)/)?.[1] || "";
            const updated_at = metadata.match(/updated_at:\s*(.*)/)?.[1] || "";
            const image = metadata.match(/image:\s*(.*)/)?.[1] || "";

            const html = await marked.parse(markdownContent);
            setPost({
              html,
              metadata: { title, created_at, updated_at, image },
            });
            return;
          }
        }

        // If no state or parsing failed, fetch from Firebase
        const storage = getStorage(app);
        const fileRef = ref(
          storage,
          `gs://${
            import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
          }/blog_posts/${slug}.md`
        );
        const url = await getDownloadURL(fileRef);
        const response = await fetch(url);
        const content = await response.text();

        const parts = content.split("---");
        if (parts.length < 3) throw new Error("Invalid markdown");

        const metadata = parts[1];
        const markdownContent = parts[2];

        const title = metadata.match(/title:\s*(.*)/)?.[1] || "";
        const created_at = metadata.match(/created_at:\s*(.*)/)?.[1] || "";
        const updated_at = metadata.match(/updated_at:\s*(.*)/)?.[1] || "";
        const image = metadata.match(/image:\s*(.*)/)?.[1] || "";

        const html = await marked.parse(markdownContent);
        setPost({ html, metadata: { title, created_at, updated_at, image } });
      } catch (err) {
        console.error("Failed to load blog post", err);
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [postFromState, slug]);

  return (
    <div className="inverse-gradient-background min-h-screen flex flex-col justify-between">
      <Navbar />
      {loading ? (
        <Loader showText={false} />
      ) : post ? (
        <div className="flex flex-col justify-center items-center py-12 max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-4">{post.metadata.title}</h1>
          <p className="text-gray-500 text-sm mb-8">
            {formatDate(post.metadata.created_at)}
          </p>
          <div className="flex flex-col items-center justify-center max-w-md bg-white dark:bg-gray-800 rounded-lg p-4 overflow-y-auto">
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
  );
}
