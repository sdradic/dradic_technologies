import { useEffect, useState } from "react";
import { NavLink } from "react-router";
import { fetchBlogPosts } from "~/modules/api";
import type { BlogPost } from "~/modules/types";
import { placeholderImage } from "~/modules/store";

export function PostsList() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadPosts = async () => {
      const posts = await fetchBlogPosts();
      setPosts(posts);
      setIsLoading(false);
    };
    loadPosts();
  }, []);

  if (isLoading) {
    return <PostsSkeleton />;
  }

  return (
    <>
      {posts && posts.length > 0 ? (
        posts.map((post: BlogPost) => (
          <NavLink key={post.slug} to={`/blog/${post.slug}`}>
            <li className="flex flex-row gap-4 px-2 py-4 cursor-pointer hover:bg-gray-200 dark:hover:bg-dark-500 rounded-lg">
              <img
                src={post?.image || placeholderImage}
                className="object-cover w-32 h-24 rounded-md"
              />
              <div className="flex flex-col gap-2 items-start justify-center">
                <h3 className="text-sm font-semibold dark:text-gray-200">
                  {post.title}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {new Date(post.created_at).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </div>
            </li>
          </NavLink>
        ))
      ) : (
        <li className="text-center text-gray-500 dark:text-gray-400">
          No posts found
        </li>
      )}
    </>
  );
}

export function PostsSkeleton() {
  return (
    <>
      {[1, 2, 3].map((i) => (
        <li key={i} className="flex flex-row gap-4 w-full py-4">
          <div className="w-32 h-24 rounded-md bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          <div className="flex flex-col gap-2 items-start justify-center">
            <div className="w-24 h-4 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
            <div className="w-16 h-3 bg-gray-200 dark:bg-gray-700 animate-pulse"></div>
          </div>
        </li>
      ))}
    </>
  );
}
