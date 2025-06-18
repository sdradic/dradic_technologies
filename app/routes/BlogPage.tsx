import { useNavigate } from "react-router";
import { useState, useEffect } from "react";
import Footer from "~/components/Footer";
import SectionHeader from "~/components/SectionHeader";
import Navbar from "~/components/Navbar";
import Loader from "~/components/Loader";
import { fetchPostsFromFirebase } from "~/module/apis";
import { formatDate } from "~/module/utils";
import type { BlogPost } from "~/module/types";

// Create a module-level cache that persists between route changes
let postsCache: BlogPost[] | null = null;

export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      // If we have cached posts, use them instead of fetching
      if (postsCache) {
        setPosts(postsCache);
        setIsLoading(false);
        return;
      }

      try {
        const fetchedPosts = await fetchPostsFromFirebase();
        postsCache = fetchedPosts as BlogPost[];
        setPosts(postsCache);
      } catch (error) {
        console.error("Error loading blog posts:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="inverse-gradient-background min-h-screen flex flex-col justify-between">
      <Navbar />
      <div className="flex flex-col max-w-6xl mx-auto px-4 py-12 items-center">
        <SectionHeader title="Blog Posts" className="text-center" />
        <ul className="flex flex-wrap gap-4">
          {isLoading ? (
            <div className="flex justify-center items-center min-h-[400px]">
              <Loader showText={false} />
            </div>
          ) : (
            posts.map((post) => (
              <li
                key={post.slug}
                className="mx-auto max-w-[300px] p-4 h-full rounded-lg border border-gray-200 bg-white cursor-pointer hover:underline hover:scale-105 transition-all duration-300"
                onClick={() => {
                  navigate(`/blog/${post.slug}`, { state: { post } });
                }}
              >
                <img
                  className="size-48 object-cover w-full"
                  src={post?.image || "/blog_post_placeholder.png"}
                  alt={post.title}
                />
                <div className="text-blue-600 text-lg font-medium">
                  {post.title.slice(0, 40) + "..."}
                </div>
                <p className="text-sm text-gray-500 py-2">
                  {formatDate(post.created_at)}
                </p>
              </li>
            ))
          )}
        </ul>
      </div>
      <Footer />
    </div>
  );
}
