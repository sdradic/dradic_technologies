import { Await, useLoaderData } from "react-router";
import { marked } from "marked";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { app } from "module/firebase";
import Loader from "~/components/Loader";
import Navbar from "~/components/Navbar";
import Footer from "~/components/Footer";
import { Suspense } from "react";

interface LoaderData {
  html: string;
  metadata: {
    title: string;
    date: string;
    image: string;
  };
}

const VITE_FIREBASE_STORAGE_BUCKET = import.meta.env
  .VITE_FIREBASE_STORAGE_BUCKET;

export async function loader({
  params,
  request,
}: {
  params: { slug: string };
  request: Request;
}) {
  const slug = params.slug;

  // Check if we have the post data in navigation state
  const url = new URL(request.url);
  const state = url.searchParams.get("state");
  if (state) {
    return {
      post: new Promise(async (resolve) => {
        try {
          const post = JSON.parse(decodeURIComponent(state));
          if (post.slug === slug) {
            const parts = post.content.split("---");
            if (parts.length >= 3) {
              const metadata = parts[1];
              const markdownContent = parts[2];

              const title = metadata.match(/title:\s*(.*)/)?.[1] || "";
              const date = metadata.match(/date:\s*(.*)/)?.[1] || "";
              const image = metadata.match(/image:\s*(.*)/)?.[1] || "";

              const html = marked.parse(markdownContent);

              return {
                html,
                metadata: { title, date, image },
              } as LoaderData;
            }
          }
        } catch (error) {
          console.error("Error parsing state:", error);
        }
      }),
    };
  }

  // If no state or parsing failed, fetch from Firebase
  const storage = getStorage(app);
  const fileRef = ref(
    storage,
    `gs://${VITE_FIREBASE_STORAGE_BUCKET}/blog_posts/${slug}.md`
  );

  return {
    post: new Promise(async (resolve) => {
      try {
        const url = await getDownloadURL(fileRef);
        const response = await fetch(url);
        const content = await response.text();

        // Parse the markdown content
        const parts = content.split("---");
        if (parts.length < 3) {
          throw new Error("Invalid markdown format");
        }

        const metadata = parts[1];
        const markdownContent = parts[2];

        const title = metadata.match(/title:\s*(.*)/)?.[1] || "";
        const date = metadata.match(/date:\s*(.*)/)?.[1] || "";
        const image = metadata.match(/image:\s*(.*)/)?.[1] || "";

        const html = marked.parse(markdownContent);

        resolve({
          html,
          metadata: { title, date, image },
        });
      } catch (error) {
        console.error("Error loading blog post:", error);
        throw new Response("Not Found", { status: 404 });
      }
    }),
  };
}

function BlogPostContent({ post }: { post: LoaderData }) {
  return (
    <div className="flex flex-col justify-center items-center py-12 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">{post.metadata.title}</h1>
      <p className="text-gray-500 text-sm mb-8">{post.metadata.date}</p>
      <div className="prose prose-lg max-w-none">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: post.html }}
        />
      </div>
    </div>
  );
}

export default function BlogPost() {
  const { post } = useLoaderData() as { post: Promise<LoaderData> };

  return (
    <div className="inverse-gradient-background min-h-screen flex flex-col justify-between">
      <Navbar />
      <Suspense fallback={<Loader showText={false} />}>
        <Await resolve={post}>
          {(resolvedPost) => <BlogPostContent post={resolvedPost} />}
        </Await>
      </Suspense>
      <Footer />
    </div>
  );
}
