import { NavLink } from "react-router";
import type { Route } from "./+types/home";
import { SimpleInput } from "~/components/SimpleInput";
import { fetchBlogPosts } from "~/modules/api";
import type { BlogPost } from "~/modules/types";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Dradic Technologies Blog" },
    { name: "description", content: "Welcome to Dradic Technologies Blog!" },
  ];
}

export async function clientLoader() {
  const posts = await fetchBlogPosts();
  return { posts };
}

export default function Home({ loaderData }: Route.ComponentProps) {
  const { posts } = loaderData || { posts: [] };

  return (
    <div className="flex flex-col w-full max-w-4xl mx-auto px-4">
      {/* Hero Section */}
      <div className="flex flex-col mt-4 justify-center items-center text-center mx-4 pt-4 pb-8">
        <h1 className="text-4xl md:text-6xl font-semibold">
          Weekly <span className="text-primary-500">embedded</span> +{" "}
          <span className="text-primary-500">programing</span> tech insights and
          tutorials
        </h1>
        <p className="text-lg text-gray-500 dark:text-gray-400 mt-4">
          Join us as we explore the latest trends in technology and share our
          insights with you.
        </p>
        {/* Subscribe Bar */}
        <SimpleInput />
      </div>
      {/* Recent Posts */}
      <div className="flex flex-col mt-6 justify-center text-left mx-4">
        <h2 className="font-semibold text-gray-600 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700 pb-2">
          Latest content
        </h2>
        <ul className="flex flex-col mt-4 dark:bg-dark-400 bg-gray-100 rounded-xl p-4 divide-y divide-gray-200 dark:divide-gray-700">
          {posts && posts.length > 0 ? (
            posts.map((post: BlogPost) => (
              <NavLink key={post.slug} to={`/blog/${post.slug}`}>
                <li className="flex flex-row gap-2 px-2 py-4 cursor-pointer">
                  <img
                    src={post.image || "blog_post_placeholder.png"}
                    className="object-cover w-32 h-24 rounded-md"
                  />
                  <div className="flex flex-col gap-2 items-start justify-center">
                    <h3 className="text-sm font-semibold dark:text-gray-200">
                      {post.title}
                    </h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {post.created_at}
                    </p>
                  </div>
                </li>
              </NavLink>
            ))
          ) : (
            <li>No posts found</li>
          )}
        </ul>
      </div>
    </div>
  );
}
